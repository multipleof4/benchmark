import { promises as fs } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import axios from 'axios';
import { performance } from 'perf_hooks';

const CWD = process.cwd();
const README_PATH = path.join(CWD, 'README');
const TESTS_DIR = path.join(CWD, 'tests');
const RESULTS_PATH = path.join(CWD, 'results.json');

const getLlmCode = async (prompt, model, functionName, temperature) => {
  const start = performance.now();
  try {
    const res = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      { model, messages: [{ role: 'user', content: prompt }], ...(temperature !== undefined && { temperature }) },
      { headers: { Authorization: `Bearer ${process.env.OPENROUTER_KEY}` } }
    );
    const duration = (performance.now() - start) / 1000;
    const content = res.data.choices[0].message.content;
    const code = content.match(/```(?:javascript|js)?\n([\s\S]+?)\n```/)?.[1].trim() ?? content.trim();
    const finalCode = `${code.replace(/export\s+default\s+.*$/m, '')}\nexport default ${functionName};`;
    return { code: finalCode, duration };
  } catch (error) {
    console.error(`API Error for ${model}: ${error.message}`);
    return null;
  }
};

const main = async () => {
  const readme = await fs.readFile(README_PATH, 'utf-8');
  const models = readme.match(/<!-- MODELS_START -->\n([\s\S]+?)\n<!-- MODELS_END -->/)[1].trim().split('\n');
  const percentage = parseInt(readme.match(/RUN_PERCENTAGE:\s*(\d+)/)?.[1] ?? '100', 10);
  const sharedPrompt = readme.match(/SHARED_PROMPT:\s*"([\s\S]+?)"/)?.[1] ?? '';
  const allTestDirs = (await fs.readdir(TESTS_DIR, { withFileTypes: true }))
    .filter(d => d.isDirectory()).map(d => d.name).sort();

  await Promise.all(
    allTestDirs.map(dir => fs.rm(path.join(TESTS_DIR, dir, 'outputs'), { recursive: true, force: true }))
  );

  const testsToRun = allTestDirs.slice(0, Math.ceil(allTestDirs.length * (percentage / 100)));
  const genData = {};

  for (const modelSpec of models) {
    const [model, tempStr] = modelSpec.split(' TEMP:');
    const temperature = tempStr ? parseFloat(tempStr) : undefined;

    genData[modelSpec] = {};
    for (const dir of testsToRun) {
      const { prompt, functionName } = (await import(pathToFileURL(path.join(TESTS_DIR, dir, 'test.js')))).default;
      console.log(`Generating ${dir} for ${modelSpec}...`);
      const result = await getLlmCode(
        `${sharedPrompt}\n\n${prompt.trim()}`,
        model,
        functionName,
        temperature
      );
      
      genData[modelSpec][dir] = result?.duration ?? null;
      if (!result) continue;

      const outDir = path.join(TESTS_DIR, dir, 'outputs');
      await fs.mkdir(outDir, { recursive: true });
      const fname = `${modelSpec.replace(/[\/:]/g, '_')}.js`;
      await fs.writeFile(path.join(outDir, fname), result.code);
    }
  }
  await fs.writeFile(RESULTS_PATH, JSON.stringify(genData, null, 2));
  console.log('Code generation and results.json update complete.');
};

main().catch(console.error);
