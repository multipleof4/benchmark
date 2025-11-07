async function findAvailableSlots(cal1, cal2, c) {
  const { DateTime, Interval } = await import('https://cdn.skypack.dev/luxon')
  const d = c.durationMinutes
  const sR = c.searchRange
  const wH = c.workHours
  const z = 'UTC'
  const p = (x, y) => DateTime.fromISO(x, { zone: y })
  const b = c => c.map(v => Interval.fromDateTimes(p(v.start, z), p(v.end, z)))
  const m = (a, b) => [...a, ...b].sort((x, y) => x.start - y.start)
  const n = i => {
    const r = []
    let c = i[0]
    for (let k = 1; k < i.length; k++) {
      const v = i[k]
      if (c.overlaps(v) || c.abutsStart(v)) c = Interval.fromDateTimes(c.start, c.end > v.end ? c.end : v.end)
      else r.push(c), (c = v)
    }
    r.push(c)
    return r
  }
  const iA = b(cal1)
  const iB = b(cal2)
  const all = m(iA, iB)
  const busy = all.length ? n(all) : []
  const srI = Interval.fromDateTimes(p(sR.start, z), p(sR.end, z))
  const whS = wH.start.split(':').map(Number)
  const whE = wH.end.split(':').map(Number)

  const dayI = []
  let cur = srI.start.startOf('day')
  const endDay = srI.end.startOf('day')
  while (cur <= endDay) {
    const ws = cur.set({ hour: whS[0], minute: whS[1] })
    const we = cur.set({ hour: whE[0], minute: whE[1] })
    const w = Interval.fromDateTimes(ws, we)
    const clipped = srI.intersection(w)
    if (clipped && clipped.isValid && clipped.length('minutes') >= d) dayI.push(clipped)
    cur = cur.plus({ days: 1 })
  }

  const inv = []
  let pS = null
  for (const x of busy) {
    const xs = x.start < srI.start ? srI.start : x.start
    const xe = x.end > srI.end ? srI.end : x.end
    if (!pS) {
      if (xs > srI.start) inv.push(Interval.fromDateTimes(srI.start, xs))
      pS = xe
    } else {
      if (xs > pS) inv.push(Interval.fromDateTimes(pS, xs))
      if (xe > pS) pS = xe
    }
  }
  if (!busy.length) inv.push(srI)
  else if (pS < srI.end) inv.push(Interval.fromDateTimes(pS, srI.end))

  const freeWithinRange = inv
    .map(v => dayI.map(dv => dv.intersection(v)).filter(x => x && x.isValid))
    .flat()
    .filter(x => x.length('minutes') >= d)

  const res = []
  for (const f of freeWithinRange) {
    let st = f.start
    const mins = f.length('minutes')
    const steps = Math.floor(mins / d)
    for (let i = 0; i < steps; i++) {
      const en = st.plus({ minutes: d })
      res.push({ start: st.toISO(), end: en.toISO() })
      st = en
    }
  }
  return res
}
export default findAvailableSlots;