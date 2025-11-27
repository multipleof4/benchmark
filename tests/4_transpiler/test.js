export default {
  functionName: 'bundleApp',
  prompt: `// Write an async JavaScript function 'bundleApp' that acts as a mini-bundler for ES6 modules.
// - Input: 'entryFile' (string, e.g., 'main.js') and 'files' (object: { 'filename.js': 'code content' }).
// - You MUST use dynamic import() to load '@babel/standalone' from a CDN.
// - Process:
//   1. Recursively traverse dependencies starting from 'entryFile'.
//   2. Use Babel to transform each file's code from ES6+ to CommonJS (presets: ['env']).
//   3. Extract dependencies from the transformed code (look for 'require' calls).
//   4. Build a dependency graph. Throw an error if a file is missing.
// - Output: Return a single string of executable JavaScript code.
//   - This code must contain a lightweight runtime that defines 'require', 'module', and 'exports'.
//   - It must wrap each module's code in a function.
//   - When executed (e.g., via eval), it should run the entry file and return its 'module.exports'.
// - The runtime must handle relative paths (e.g., './utils.js') correctly during resolution.
// - Ensure the generated code is self-contained and does not pollute the global scope.`,
  runTest: async (bundleApp) => {
    const assert = {
      strictEqual: (a, e, m) => { if (a !== e) throw new Error(m || `FAIL: ${a} !== ${e}`) },
      ok: (v, m) => { if (!v) throw new Error(m) }
    };

    const files = {
      'main.js': `
        import { add, multiply } from './math.js';
        import { format } from './utils/formatter.js';
        
        const sum = add(5, 3);
        const prod = multiply(2, 4);
        
        export const result = format(sum + prod);
      `,
      'math.js': `
        export const add = (a, b) => a + b;
        export const multiply = (a, b) => a * b;
      `,
      'utils/formatter.js': `
        export const format = (n) => \`Value: \${n}\`;
      `
    };

    // 1. Test successful bundling
    const bundle = await bundleApp('main.js', files);
    assert.ok(typeof bundle === 'string', 'Result must be a string');
    assert.ok(bundle.length > 100, 'Bundle seems too short');
    assert.ok(!bundle.includes('import '), 'Bundle should not contain ES6 import statements');

    // 2. Test execution of the bundle
    // We wrap in an IIFE to ensure it returns the exports
    const result = eval(bundle);
    
    // Check if result matches expected logic: (5+3) + (2*4) = 8 + 8 = 16 -> "Value: 16"
    assert.ok(result && typeof result === 'object', 'Bundle execution should return module.exports object');
    assert.strictEqual(result.result, 'Value: 16', 'Logic execution failed');

    // 3. Test Missing File Error
    const brokenFiles = { 'main.js': "import './missing.js';" };
    try {
      await bundleApp('main.js', brokenFiles);
      throw new Error('Should have thrown on missing file');
    } catch (e) {
      assert.ok(e.message.toLowerCase().includes('missing') || e.message.includes('found'), 'Error message should mention missing file');
    }
  }
};
