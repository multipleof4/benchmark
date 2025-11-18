import { promises as fs } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import axios from 'axios';
import { performance } from 'perf_hooks';

const CWD = process.cwd();
const [README, TESTS, RESULTS] = ['README', 'tests', 'results.json'].map(f => path.join(CWD, f));
const getArg = n => { const i = process.argv.indexOf(n); return i > -1 ? process.argv[i + 1] : null; };
const isGemini = process.argv.includes('--gemini');

const apiCall = async (prompt, model, temp) => {
  if (isGemini) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GOOGLE_KEY}`;
    const body = { contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: temp } };
    const res = await axios.post(url, body);
    return res.data.candidates[0].content.parts[0].text;
  }
  const res = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    { model, messages: [{ role: 'user', content: prompt }], ...(temp !== undefined && { temperature: temp }) },
    { headers: { Authorization: `Bearer ${process.env.OPENROUTER_KEY}` } }
  );
  return res.data.choices[0].message.content;
};

const getLlmCode = async (prompt, model, funcName, temp) => {
  const start = performance.now();
  try {
    const content = await apiCall(prompt, model, temp);
    const duration = (performance.now() - start) / 1000;
    const code = content.match(/```(?:javascript|js)?\n([\s\S]+?)\n```/)?.[1].trim() ?? content.trim();
    return { code: `${code.replace(/export\s+default\s+.*$/m, '')}\nexport default ${funcName};`, duration };
  } catch (e) { console.error(`API Error ${model}: ${e.message}`); return null; }
};

const main = async () => {
  const readme = await fs.readFile(README, 'utf-8');
  const regex = isGemini ? /<!-- GEMINI_START -->\n([\s\S]+?)\n<!-- MODELS_END -->/ : /<!-- MODELS_START -->\n([\s\S]+?)\n<!-- MODELS_END -->/;
  const allModels = readme.match(regex)[1].trim().split('\n').filter(Boolean);
  const pct = parseInt(readme.match(/RUN_PERCENTAGE:\s*(\d+)/)?.[1] ?? '100', 10);
  const shared = readme.match(/SHARED_PROMPT:\s*"([\s\S]+?)"/)?.[1] ?? '';
  
  const sModel = getArg('--model');
  if (sModel && !allModels.includes(sModel)) throw new Error(`Model "${sModel}" not found in README.`);
  const models = sModel ? [sModel] : allModels;

  const testDirs = (await fs.readdir(TESTS, { withFileTypes: true })).filter(d => d.isDirectory()).map(d => d.name).sort();
  const targetTests = testDirs.slice(0, Math.ceil(testDirs.length * (pct / 100)));

  const clean = dir => fs.rm(path.join(TESTS, dir, 'outputs', sModel ? `${sModel.replace(/[\/:]/g, '_')}.js` : ''), { recursive: !sModel, force: true });
  await Promise.all(testDirs.map(clean));

  let data = {};
  try { data = JSON.parse(await fs.readFile(RESULTS, 'utf-8')); } catch {}

  for (const mSpec of models) {
    const [model, tStr] = mSpec.split(' TEMP:');
    const temp = tStr ? parseFloat(tStr) : undefined;
    data[mSpec] ||= {};
    
    for (const dir of targetTests) {
      const { prompt, functionName } = (await import(pathToFileURL(path.join(TESTS, dir, 'test.js')))).default;
      console.log(`Gen ${dir} for ${mSpec}...`);
      const res = await getLlmCode(`${shared}\n\n${prompt.trim()}`, model, functionName, temp);
      
      data[mSpec][dir] = res?.duration ?? null;
      if (!res) continue;

      const outDir = path.join(TESTS, dir, 'outputs');
      await fs.mkdir(outDir, { recursive: true });
      await fs.writeFile(path.join(outDir, `${mSpec.replace(/[\/:]/g, '_')}.js`), res.code);
    }
  }
  await fs.writeFile(RESULTS, JSON.stringify(data, null, 2));
  console.log('Done.');
};

main().catch(console.error);
