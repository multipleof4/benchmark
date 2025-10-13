import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';
import { performance } from 'perf_hooks';

const execPromise = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const README_PATH = path.join(__dirname, '..', 'README.md');
const TESTS_DIR = path.join(__dirname, '..', 'tests');
const TEMP_FILE = path.join(__dirname, 'temp_test.js');

const getLlmCode = async (prompt, model) => {
  try {
    const res = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      { model, messages: [{ role: 'user', content: prompt }] },
      { headers: { Authorization: `Bearer ${process.env.OPENROUTER_KEY}` } }
    );
    const content = res.data.choices[0].message.content;
    const code = content.match(/```(?:javascript|js)?\n([\s\S]+?)\n```/)?.[1].trim() ?? content.trim();
    return code.replace(/^export\s+(default\s+)?/, '');
  } catch (error) {
    console.error(`API Error for ${model}: ${error.message}`);
    return null;
  }
};

const runTest = async (code) => {
  const start = performance.now();
  let passed = false;
  try {
    await fs.writeFile(TEMP_FILE, code);
    await execPromise(`node ${TEMP_FILE}`);
    passed = true;
  } catch (error) { // eslint-disable-line no-empty
  } finally {
    await fs.unlink(TEMP_FILE).catch(() => {});
  }
  return { passed, duration: (performance.now() - start) / 1000 };
};

const main = async () => {
  const readme = await fs.readFile(README_PATH, 'utf-8');
  const models = readme.match(/<!-- MODELS_START -->\n([\s\S]+?)\n<!-- MODELS_END -->/)[1].trim().split('\n');
  const percentage = parseInt(readme.match(/RUN_PERCENTAGE:\s*(\d+)/)?.[1] ?? '100', 10);
  const allTestDirs = (await fs.readdir(TESTS_DIR, { withFileTypes: true }))
    .filter(d => d.isDirectory()).map(d => d.name);

  console.log('Clearing old test outputs...');
  await Promise.all(allTestDirs.map(dir => 
    fs.rm(path.join(TESTS_DIR, dir, 'outputs'), { recursive: true, force: true })
  ));

  allTestDirs.sort();
  const testsToRun = allTestDirs.slice(0, Math.ceil(allTestDirs.length * (percentage / 100)));

  const results = [];
  for (const model of models) {
    results.push(`**${model}**`);
    for (const dir of allTestDirs) {
      if (!testsToRun.includes(dir)) {
        results.push(`- ${dir}: ⚪ Not Run`);
        continue;
      }
      const testModule = await import(pathToFileURL(path.join(TESTS_DIR, dir, 'test.js')));
      const { prompt, imports, harness } = testModule.default;
      console.log(`Running ${dir} for ${model}...`);
      const llmCode = await getLlmCode(prompt, model);
      if (llmCode) {
        const outDir = path.join(TESTS_DIR, dir, 'outputs');
        await fs.mkdir(outDir, { recursive: true });
        const fname = `${model.replace(/[\/:]/g, '_')}.js`;
        await fs.writeFile(path.join(outDir, fname), llmCode);
        const { passed, duration } = await runTest(`${imports || ''}\n${llmCode}\n${harness}`);
        results.push(`- ${dir}: ${passed ? '✅ Pass' : '❌ Fail'} (${duration.toFixed(3)}s)`);
      } else {
        results.push(`- ${dir}: ❌ API Error`);
      }
    }
    results.push('');
  }

  const newReadme = readme.replace(
    /<!-- RESULTS_START -->[\s\S]*<!-- RESULTS_END -->/,
    `<!-- RESULTS_START -->\n${results.join('\n').trim()}\n<!-- RESULTS_END -->`
  );
  await fs.writeFile(README_PATH, newReadme);
  console.log('Benchmark complete. README updated.');
};

main().catch(console.error);
