let luxon$

const findAvailableSlots = async (calA, calB, cfg) => {
  const {DateTime, Interval} = await (luxon$ ||= import('https://cdn.skypack.dev/luxon'))
  const {durationMinutes: d, searchRange: r, workHours: w} = cfg
  const s = DateTime.fromISO(r.start)
  const e = DateTime.fromISO(r.end)
  const range = Interval.fromDateTimes(s, e)
  const [sh, sm] = w.start.split(':').map(Number)
  const [eh, em] = w.end.split(':').map(Number)
  const busy = [...calA, ...calB]
    .map(({start, end}) => ({start: DateTime.fromISO(start), end: DateTime.fromISO(end)}))
    .filter(v => v.end > s && v.start < e)
    .map(v => ({start: v.start < s ? s : v.start, end: v.end > e ? e : v.end}))
    .sort((a, b) => a.start.valueOf() - b.start.valueOf())
  const merged = []
  for (const slot of busy) {
    const last = merged.at(-1)
    if (!last || slot.start > last.end) merged.push({...slot})
    else if (slot.end > last.end) last.end = slot.end
  }
  const out = []
  const emit = (from, to) => {
    if (!(to > from)) return
    for (let st = from, en = st.plus({minutes: d}); en <= to; st = en, en = st.plus({minutes: d}))
      out.push({start: st.toISO(), end: en.toISO()})
  }
  let i = 0
  for (let day = s.startOf('day'); day < e; day = day.plus({days: 1})) {
    const ws = day.set({hour: sh, minute: sm, second: 0, millisecond: 0})
    const we = day.set({hour: eh, minute: em, second: 0, millisecond: 0})
    const block = Interval.fromDateTimes(ws, we).intersection(range)
    if (!block) continue
    while (i < merged.length && merged[i].end <= block.start) i++
    let cursor = block.start
    for (let j = i; j < merged.length && merged[j].start < block.end; j++) {
      const bs = merged[j].start > block.start ? merged[j].start : block.start
      if (bs > cursor) {
        emit(cursor, bs)
        cursor = bs
      }
      if (merged[j].end > cursor) {
        const be = merged[j].end < block.end ? merged[j].end : block.end
        cursor = be
      }
      if (cursor >= block.end) break
    }
    if (cursor < block.end) emit(cursor, block.end)
  }
  return out
}
export default findAvailableSlots;