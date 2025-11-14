export default {
  functionName: 'findConvexHull',
  prompt: `// Write an async JavaScript function 'findConvexHull' that finds the convex hull of a set of 2D points using the Monotone Chain algorithm.
// - The function must accept an array of points, e.g., [{x: 0, y: 3}, {x: 1, y: 1}, ...].
// - You MUST use a dynamic import() to load the 'lodash' library from a CDN for sorting and uniqueness operations.
// - The function should return an array of points representing the convex hull.`,
  runTest: async (findConvexHull) => {
    const assert = {
      deepStrictEqual: (a, e, m) => { if (JSON.stringify(a) !== JSON.stringify(e)) throw new Error(m) },
    };
    const points = [
      {x: 0, y: 3}, {x: 1, y: 1}, {x: 2, y: 2}, {x: 4, y: 4},
      {x: 0, y: 0}, {x: 1, y: 2}, {x: 3, y: 1}, {x: 3, y: 3}
    ];
    const expected = [{x: 0, y: 0}, {x: 3, y: 1}, {x: 4, y: 4}, {x: 0, y: 3}];
    const hull = await findConvexHull(points);
    const sortFn = (a, b) => a.x - b.x || a.y - b.y;
    assert.deepStrictEqual(hull.sort(sortFn), expected.sort(sortFn), "Test Failed: Convex hull points do not match.");
  }
};


