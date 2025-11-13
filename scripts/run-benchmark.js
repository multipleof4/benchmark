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
    allTestDirs.flatMap(dir => [
      fs.rm(path.join(TESTS_DIR, dir, 'outputs'), { recursive: true, force: true }),
      fs.rm(path.join(TESTS_DIR, dir, 'results'), { recursive: true, force: true })
    ])
  );

  const testsToRun = allTestDirs.slice(0, Math.ceil(allTestDirs.length * (percentage / 100)));
  const genData = {};

  for (const modelSpec of models) {
    const [model, tempStr] = modelSpec.split(' TEMP:');
    const temperature = tempStr ? parseFloat(tempStr) : undefined;

    genData[modelSpec] = {};
    for (const dir of testsToRun) {
      const { prompt, functionName, runTest } = (await import(pathToFileURL(path.join(TESTS_DIR, dir, 'test.js')))).default;
      
      console.log(`Generating ${dir} for ${modelSpec}...`);
      const genResult = await getLlmCode(`${sharedPrompt}\n\n${prompt.trim()}`, model, functionName, temperature);
      
      const sModel = modelSpec.replace(/[\/:]/g, '_');
      const outDir = path.join(TESTS_DIR, dir, 'outputs');
      await fs.mkdir(outDir, { recursive: true });
      const fpath = path.join(outDir, `${sModel}.js`);

      let passed = false, error = 'Code generation failed', output = null;

      if (genResult) {
        await fs.writeFile(fpath, genResult.code);
        try {
          console.log(`Testing ${dir} for ${modelSpec}...`);
          output = await runTest((await import(pathToFileURL(fpath))).default);
          passed = true;
          error = null;
        } catch (e) {
          console.error(`Test failed for ${modelSpec} on ${dir}: ${e.message}`);
          error = e.message || String(e);
        }
      }

      const resultsDir = path.join(TESTS_DIR, dir, 'results');
      await fs.mkdir(resultsDir, { recursive: true });
      const resultsFpath = path.join(resultsDir, `${sModel}.json`);
      await fs.writeFile(resultsFpath, JSON.stringify({ output, error }, null, 2));

      genData[modelSpec][dir] = { duration: genResult?.duration ?? null, passed, error };
    }
  }
  await fs.writeFile(RESULTS_PATH, JSON.stringify(genData, null, 2));
  console.log('Benchmark complete. Results saved to results.json.');
};

main().catch(console.error);
