const findConvexHull = async (pts) => {
  const { default: _ } = await import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm')
  const s = _.sortBy(_.uniqWith(pts, _.isEqual), ['x', 'y'])
  if (s.length < 3) return s
  
  const k = (a, b, o) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
  const build = (list) => {
    const stack = []
    for (const p of list) {
      while (stack.length > 1 && k(stack[stack.length - 1], p, stack[stack.length - 2]) <= 0) {
        stack.pop()
      }
      stack.push(p)
    }
    return stack
  }

  const l = build(s)
  const u = build([...s].reverse())
  return [...l.slice(0, -1), ...u.slice(0, -1)]
}
export default findConvexHull;