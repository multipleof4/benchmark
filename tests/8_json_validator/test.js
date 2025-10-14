export default {
  functionName: 'validateJSON',
  prompt: `// Write an async JavaScript function 'validateJSON' that validates a JSON object against a JSON Schema.
// - The function must accept a JSON object and a JSON Schema object.
// - You MUST use dynamic import() to load one or more libraries from a CDN for JSON Schema validation.
// - Return an object: { valid: boolean, errors: array } where errors contains validation error messages if invalid.
// - Handle nested schemas, required fields, type validation, and pattern matching.`,
  runTest: async (validateJSON) => {
    const assert = {
      strictEqual: (a, e, m) => { if (a !== e) throw new Error(m || `FAIL: ${a} !== ${e}`) },
      ok: (v, m) => { if (!v) throw new Error(m) },
    };
    const schema = {
      type: 'object',
      required: ['name', 'age'],
      properties: {
        name: { type: 'string', minLength: 1 },
        age: { type: 'number', minimum: 0 },
        email: { type: 'string', pattern: '^[^@]+@[^@]+\\.[^@]+$' }
      }
    };
    const validData = { name: 'Alice', age: 30, email: 'alice@example.com' };
    const invalidData = { name: '', age: -5 };
    
    const validResult = await validateJSON(validData, schema);
    assert.strictEqual(validResult.valid, true, 'Test Failed: Valid data marked as invalid.');
    
    const invalidResult = await validateJSON(invalidData, schema);
    assert.strictEqual(invalidResult.valid, false, 'Test Failed: Invalid data marked as valid.');
    assert.ok(Array.isArray(invalidResult.errors) && invalidResult.errors.length > 0, 'Test Failed: No errors returned for invalid data.');
  }
};
