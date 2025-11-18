const findConvexHull = async (points) => {
    const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm');
    const pts = _.sortBy(_.uniqWith(points, _.isEqual), ['x', 'y']);
    if (pts.length < 3) return pts;
    const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    const chain = (list) => {
        const h = [];
        for (const p of list) {
            while (h.length >= 2 && cross(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop();
            h.push(p);
        }
        return h;
    };
    const lower = chain(pts), upper = chain([...pts].reverse());
    return [...lower.slice(0, -1), ...upper.slice(0, -1)];
};
export default findConvexHull;