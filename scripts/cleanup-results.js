import { promises as fs } from 'fs';
import path from 'path';

const CWD = process.cwd();
const TESTS_DIR = path.join(CWD, 'tests');
const RESULTS_FILE = path.join(CWD, 'results.json');

const main = async () => {
  // Get list of currently existing test directories
  const existingTests = new Set(
    (await fs.readdir(TESTS_DIR, { withFileTypes: true }))
      .filter(d => d.isDirectory())
      .map(d => d.name)
  );

  // Read results.json
  let results = {};
  try {
    const content = await fs.readFile(RESULTS_FILE, 'utf-8');
    results = JSON.parse(content);
  } catch (e) {
    console.error('Could not read results.json', e);
    process.exit(1);
  }

  let changed = false;

  // Iterate over every model in results
  for (const modelKey in results) {
    const modelResults = results[modelKey];
    const testsInResult = Object.keys(modelResults);

    for (const testName of testsInResult) {
      if (!existingTests.has(testName)) {
        console.log(`Removing stale test result: ${testName} for ${modelKey}`);
        delete modelResults[testName];
        changed = true;
      }
    }
  }

  if (changed) {
    await fs.writeFile(RESULTS_FILE, JSON.stringify(results, null, 2));
    console.log('results.json updated.');
  } else {
    console.log('No stale results found.');
  }
};

main().catch(console.error);
