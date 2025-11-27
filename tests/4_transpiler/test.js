export default {
  functionName: 'renderTemplate',
  prompt: `// Write an async JavaScript function 'renderTemplate' that renders a Handlebars template with data.
// - The function must accept a template string and a data object.
// - You MUST use dynamic import() to load the 'handlebars' library from a CDN.
// - Compile the template and execute it with the provided data.
// - Return the resulting HTML string.`,
  runTest: async (renderTemplate) => {
    const assert = {
      strictEqual: (a, e, m) => { if (a !== e) throw new Error(m || `FAIL: ${a} !== ${e}`) },
    };
    
    const template = '<div class="user"><h1>{{name}}</h1><p>Score: {{score}}</p></div>';
    const data = { name: 'Alice', score: 100 };
    const expected = '<div class="user"><h1>Alice</h1><p>Score: 100</p></div>';
    
    const result = await renderTemplate(template, data);
    assert.strictEqual(result, expected, 'Test Failed: Rendered output does not match expected HTML.');
  }
};
