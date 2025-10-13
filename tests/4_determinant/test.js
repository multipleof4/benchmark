export default {
  functionName: 'calculateDeterminant',
  prompt: `
// Your goal is to write a production-ready and maintainable JavaScript function. Apply code-golfing practices without sacrificing readability by putting everything on one line. Do not include any comments in your code.
//
// Write an async JavaScript function 'calculateDeterminant' that calculates the determinant of a square matrix.
// - The function must accept an n x n matrix, represented as an array of arrays.
// - You MUST use a dynamic import() to load the 'mathjs' library from a CDN.
// - You MUST use the library's built-in 'det' function to perform the calculation.
// - The function should return the determinant value.
`,
  runTest: async (calculateDeterminant) => {
    const assert = {
      strictEqual: (a, e, m) => { if (a !== e) throw new Error(m || `FAIL: ${a} !== ${e}`) },
    };
    const matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    const det = await calculateDeterminant(matrix);
    assert.strictEqual(det, 0, "Test Failed: Determinant should be 0.");
  }
};
