export default {
  prompt: `
// Write an async JavaScript function 'calculateDeterminant' that calculates the determinant of a square matrix.
// - The function must accept an n x n matrix, represented as an array of arrays.
// - You MUST use a dynamic import() to load the 'mathjs' library from a CDN.
// - You MUST use the library's built-in 'det' function to perform the calculation.
// - The function should return the determinant value.
`,
  harness: `
import assert from 'assert';
async function runTest() {
  const matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  try {
    const det = await calculateDeterminant(matrix);
    assert.strictEqual(det, 0, "Test Failed: Determinant of [[1,2,3],[4,5,6],[7,8,9]] should be 0.");
    console.log("Test Passed!");
    process.exit(0);
  } catch (e) {
    console.error("Test Execution Error:", e.message);
    process.exit(1);
  }
}
runTest();
`
};
