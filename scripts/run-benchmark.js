const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');
const util = require('util');

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
  try {
    await fs.writeFile(TEMP_FILE, code);
    await execPromise(`node ${TEMP_FILE}`);
    return true;
  } catch (error) {
    return false;
  } finally {
    await fs.unlink(TEMP_FILE).catch(() => {});
  }
};

const main = async () => {
  const readme = await fs.readFile(README_PATH, 'utf-8');
  const models = readme.match(/<!-- MODELS_START -->\n([\s\S]+?)\n<!-- MODELS_END -->/)[1].trim().split('\n');
  const percentage = parseInt(readme.match(/RUN_PERCENTAGE:\s*(\d+)/)?.[1] ?? '100', 10);
  const allTestDirs = (await fs.readdir(TESTS_DIR, { withFileTypes: true }))
    .filter(d => d.isDirectory()).map(d => d.name).sort();
  const testsToRun = allTestDirs.slice(0, Math.ceil(allTestDirs.length * (percentage / 100)));

  const resultsData = [];
  for (const model of models) {
    const row = { Model: model };
    for (const dir of allTestDirs) {
      if (!testsToRun.includes(dir)) {
        row[dir] = '⚪ Not Run';
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
        row[dir] = (await runTest(`${llmCode}\n${harness}`)) ? '✅ Pass' : '❌ Fail';
      } else {
        row[dir] = '❌ API Error';
      }
    }
    resultsData.push(row);
  }

  const headers = ['Model', ...allTestDirs];
  const colWidths = Object.fromEntries(headers.map(h => 
    [h, Math.max(h.length, ...resultsData.map(r => r[h]?.length ?? 0))]
  ));
  
  const formatRow = (data, padChar = ' ') => 
    headers.map(h => (data[h] ?? '').padEnd(colWidths[h], padChar)).join(' | ');

  const headerObj = Object.fromEntries(headers.map(h => [h,h]));
  const resultsTable = [
    formatRow(headerObj),
    formatRow({}, '-'),
    ...resultsData.map(row => formatRow(row))
  ].map(line => '    ' + line).join('\n');

  const newReadme = readme.replace(
    /<!-- RESULTS_START -->[\s\S]*<!-- RESULTS_END -->/,
    `<!-- RESULTS_START -->\n${resultsTable}\n<!-- RESULTS_END -->`
  );
  await fs.writeFile(README_PATH, newReadme);
  console.log('Benchmark complete. README updated.');
};

main().catch(console.error);
