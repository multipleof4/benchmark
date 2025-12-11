const loadLodash = (() => {
  let p;
  return () =>
    p || (p = import("https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm")
      .then(m => m.default || m)
      .catch(e => (p = null, Promise.reject(e))));
})();

async function findConvexHull(points) {
  const _ = await loadLodash();
  if (!Array.isArray(points)) throw new TypeError("Expected an array of points");

  const pts = _.uniqBy(
    points.filter(p => p && Number.isFinite(p.x) && Number.isFinite(p.y)),
    p => `${p.x}|${p.y}`
  );

  if (pts.length < 2) return pts.slice();

  const s = _.sortBy(pts, ["x", "y"]);
  const cross = (o, a, b) =>
    (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

  const build = arr => {
    const h = [];
    for (const p of arr) {
      while (h.length > 1 && cross(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop();
      h.push(p);
    }
    return h;
  };

  const lo = build(s);
  const up = build(s.slice().reverse());
  lo.pop();
  up.pop();
  return lo.concat(up);
}
export default findConvexHull;
// Generation time: 134.929s
// Result: PASS