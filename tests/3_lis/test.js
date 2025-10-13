module.exports = {
  prompt: `
// Write an async JavaScript function 'findLISLength' that finds the length of the Longest Increasing Subsequence (LIS) in an array of numbers.
// - The function must accept an array of numbers.
// - You MUST implement the efficient O(n log n) algorithm.
// - You MUST use a dynamic import() to load the 'd3-array' library from a CDN and use its 'bisectLeft' function to achieve O(n log n) complexity.
// - The function should return a single number: the length of the LIS.
`,
  harness: `
const assert = require('assert');
async function runTest() {
  const nums = [10, 9, 2, 5, 3, 7, 101, 18, 4, 6];
  try {
    const length = await findLISLength(nums);
    assert.strictEqual(length, 5, "Test Failed: LIS of [10,9,2,5,3,7,101,18,4,6] should be 5 (e.g., 2,3,4,6,18).");
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
