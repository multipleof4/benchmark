module.exports = {
  prompt: `
// Write an async JavaScript function 'findConvexHull' that finds the convex hull of a set of 2D points using the Monotone Chain algorithm.
// - The function must accept an array of points, e.g., [{x: 0, y: 3}, {x: 1, y: 1}, ...].
// - You MUST use a dynamic import() to load the 'lodash' library from a CDN for sorting and uniqueness operations.
// - The function should return an array of points representing the convex hull, ordered clockwise.
`,
  harness: `
const assert = require('assert');
async function runTest() {
  const points = [
    {x: 0, y: 3}, {x: 1, y: 1}, {x: 2, y: 2}, {x: 4, y: 4},
    {x: 0, y: 0}, {x: 1, y: 2}, {x: 3, y: 1}, {x: 3, y: 3}
  ];
  const expectedHull = [
    {x: 0, y: 0}, {x: 3, y: 1}, {x: 4, y: 4}, {x: 0, y: 3}
  ];
  try {
    const hull = await findConvexHull(points);
    assert.deepStrictEqual(hull, expectedHull, "Test Failed: Convex hull does not match expected output.");
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
