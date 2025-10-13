const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);
const README_PATH = path.join(__dirname, '..', 'README.md');
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
    const match = content.match(/```(?:javascript|js)?\n([\s\S]+?)\n```/);
    return match ? match[1].trim() : content.trim();
  } catch (error) {
    console.error(`API Error for ${model}: ${error.message}`);
    return null;
  }
};

const runTest = async (code) => {
  try {
    await fs.writeFile(TEMP_FILE, code, 'utf-8');
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
  const testFiles = (await fs.readdir(TESTS_DIR)).sort();

  let resultsTable = '| Model | ' + testFiles.map(f => f.replace('.js','')).join(' | ') + ' |\n';
  resultsTable += '|' + ' --- |'.repeat(testFiles.length + 1) + '\n';

  for (const model of models) {
    resultsTable += `| ${model} |`;
    for (const file of testFiles) {
      const { prompt, harness } = require(path.join(TESTS_DIR, file));
      console.log(`Running ${file} for ${model}...`);
      const llmCode = await getLlmCode(prompt, model);
      if (!llmCode) {
        resultsTable += ' ❌ API Error |';
        continue;
      }
      const passed = await runTest(llmCode + '\n' + harness);
      resultsTable += ` ${passed ? '✅ Pass' : '❌ Fail'} |`;
    }
    resultsTable += '\n';
  }

  const newReadme = readme.replace(
    /<!-- RESULTS_START -->[\s\S]*<!-- RESULTS_END -->/,
    `<!-- RESULTS_START -->\n${resultsTable}\n<!-- RESULTS_END -->`
  );
  await fs.writeFile(README_PATH, newReadme, 'utf-8');
  console.log('Benchmark complete. README updated.');
};

main().catch(console.error);
