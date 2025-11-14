export default {
  functionName: 'findLISLength',
  prompt: `// Write an async JavaScript function 'findLISLength' that finds the length of the Longest Increasing Subsequence (LIS) in an array of numbers.
// - The function must accept an array of numbers.
// - You MUST implement the efficient O(n log n) algorithm.
// - You MUST use a dynamic import() to load the 'd3-array' library from a CDN and use its 'bisectLeft' function to achieve O(n log n) complexity.
// - The function should return a single number: the length of the LIS.`,
  runTest: async (findLISLength) => {
    const assert = {
      strictEqual: (a, e, m) => { if (a !== e) throw new Error(m || `FAIL: ${a} !== ${e}`) },
    };
    const nums = [10, 9, 2, 5, 3, 7, 101, 18, 4, 6];
    const length = await findLISLength(nums);
    assert.strictEqual(length, 4, "Test Failed: LIS length should be 4.");
  }
};


