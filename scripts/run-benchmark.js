const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');
const util = require('util');
const { performance } = require('perf_hooks');

const execPromise = util.promisify(exec);
const README_PATH = path.join(__dirname, '..', 'README');
const TESTS_DIR = path.join(__dirname, '..', 'tests');
const TEMP_FILE = path.join(__dirname, 'temp_test.mjs');

const getLlmCode = async (prompt, model) => {
  try {
    const res = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      { model, messages: [{ role: 'user', content: prompt }] },
      { headers: { Authorization: `Bearer ${process.env.OPENROUTER_KEY}` } }
    );
    const content = res.data.choices[0].message.content;
    return content.match(/```(?:javascript|js)?\n([\s\S]+?)\n```/)?.[1].trim() ?? content.trim();
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
    .filter(d => d.isDirectory()).map(d => d.name).sort();
  const testsToRun = allTestDirs.slice(0, Math.ceil(allTestDirs.length * (percentage / 100)));

  const results = [];
  for (const model of models) {
    results.push(`**${model}**`);
    for (const dir of allTestDirs) {
      if (!testsToRun.includes(dir)) {
        results.push(`- ${dir}: ⚪ Not Run`);
        continue;
      }
      const { prompt, harness } = require(path.join(TESTS_DIR, dir, 'test.js'));
      console.log(`Running ${dir} for ${model}...`);
      const llmCode = await getLlmCode(prompt, model);
      if (llmCode) {
        const outDir = path.join(TESTS_DIR, dir, 'outputs');
        await fs.mkdir(outDir, { recursive: true });
        const fname = `${model.replace(/[\/:]/g, '_')}_${new Date().toISOString().replace(/:/g, '-')}.js`;
        await fs.writeFile(path.join(outDir, fname), llmCode);
        const { passed, duration } = await runTest(`${llmCode}\n${harness}`);
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
