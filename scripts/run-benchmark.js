import { promises as fs } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import axios from 'axios';

const CWD = process.cwd();
const README_PATH = path.join(CWD, 'README');
const TESTS_DIR = path.join(CWD, 'tests');

const getLlmCode = async (prompt, model, functionName) => {
  try {
    const res = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      { model, messages: [{ role: 'user', content: prompt }] },
      { headers: { Authorization: `Bearer ${process.env.OPENROUTER_KEY}` } }
    );
    const content = res.data.choices[0].message.content;
    const code = content.match(/```(?:javascript|js)?\n([\s\S]+?)\n```/)?.[1].trim() ?? content.trim();
    return `${code.replace(/^export\s+(default\s+)?/, '')}\nexport default ${functionName};`;
  } catch (error) {
    console.error(`API Error for ${model}: ${error.message}`);
    return null;
  }
};

const main = async () => {
  const readme = await fs.readFile(README_PATH, 'utf-8');
  const models = readme.match(/<!-- MODELS_START -->\n([\s\S]+?)\n<!-- MODELS_END -->/)[1].trim().split('\n');
  const percentage = parseInt(readme.match(/RUN_PERCENTAGE:\s*(\d+)/)?.[1] ?? '100', 10);
  const allTestDirs = (await fs.readdir(TESTS_DIR, { withFileTypes: true }))
    .filter(d => d.isDirectory()).map(d => d.name).sort();

  await Promise.all(
    allTestDirs.map(dir => fs.rm(path.join(TESTS_DIR, dir, 'outputs'), { recursive: true, force: true }))
  );

  const testsToRun = allTestDirs.slice(0, Math.ceil(allTestDirs.length * (percentage / 100)));

  for (const model of models) {
    for (const dir of testsToRun) {
      const testModule = await import(pathToFileURL(path.join(TESTS_DIR, dir, 'test.js')));
      const { prompt, functionName } = testModule.default;
      console.log(`Generating ${dir} for ${model}...`);
      const llmCode = await getLlmCode(prompt, model, functionName);
      if (!llmCode) continue;

      const outDir = path.join(TESTS_DIR, dir, 'outputs');
      await fs.mkdir(outDir, { recursive: true });
      const fname = `${model.replace(/[\/:]/g, '_')}.js`;
      await fs.writeFile(path.join(outDir, fname), llmCode);
    }
  }
  console.log('Code generation complete.');
};

main().catch(console.error);
