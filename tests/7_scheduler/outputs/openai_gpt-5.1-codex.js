const loadDay = (() => {
  let memo
  return () => memo ?? (memo = (async () => {
    const [core, utc] = await Promise.all([
      import('https://esm.sh/dayjs@1.11.13?target=esnext'),
      import('https://esm.sh/dayjs@1.11.13/plugin/utc?target=esnext')
    ])
    const d = core.default
    d.extend(utc.default)
    return d
  })())
})()

const findAvailableSlots = async (c1 = [], c2 = [], cfg = {}) => {
  const d = await loadDay()
  const u = v => d.utc(v)
  const {
    durationMinutes: dm,
    searchRange: sr = {},
    workHours: wh = {}
  } = cfg
  const dur = Number(dm)
  if(!Number.isFinite(dur) || dur <= 0 || !sr.start || !sr.end || !wh.start || !wh.end) return []
  const s = u(sr.start)
  const e = u(sr.end)
  if(!s.isValid() || !e.isValid() || !s.isBefore(e)) return []
  const toMin = v => {
    const [h, m = 0] = String(v).split(':').map(Number)
    if(!Number.isFinite(h) || !Number.isFinite(m)) return null
    if(h < 0 || h > 24 || m < 0 || m > 59) return null
    if(h === 24 && m > 0) return null
    return h * 60 + m
  }
  const ws = toMin(wh.start)
  const we = toMin(wh.end)
  if(ws == null || we == null || ws >= we) return []
  const list = [
    ...(Array.isArray(c1) ? c1 : []),
    ...(Array.isArray(c2) ? c2 : [])
  ]
  const busy = list.map(v => {
    if(!v?.start || !v?.end) return null
    const st = u(v.start)
    const en = u(v.end)
    if(!st.isValid() || !en.isValid() || !st.isBefore(en)) return null
    if(!en.isAfter(s) || !st.isBefore(e)) return null
    return {
      start: st.isBefore(s) ? s : st,
      end: en.isAfter(e) ? e : en
    }
  }).filter(Boolean).sort((a, b) => a.start.valueOf() - b.start.valueOf())
  const merged = []
  for(const slot of busy){
    if(!merged.length){
      merged.push({...slot})
      continue
    }
    const last = merged[merged.length - 1]
    if(slot.start.isAfter(last.end)) merged.push({...slot})
    else if(slot.end.isAfter(last.end)) last.end = slot.end
  }
  const free = []
  let cur = s
  for(const slot of merged){
    if(slot.start.isAfter(cur)) free.push({start: cur, end: slot.start})
    if(slot.end.isAfter(cur)) cur = slot.end
  }
  if(cur.isBefore(e)) free.push({start: cur, end: e})
  if(!free.length) return []
  const step = dur * 60000
  if(!Number.isFinite(step) || step <= 0) return []
  const out = []
  for(const seg of free){
    for(let day = seg.start.startOf('day'); day.isBefore(seg.end); day = day.add(1, 'day')){
      const wsStart = day.add(ws, 'minute')
      const wsEnd = day.add(we, 'minute')
      const start = wsStart.isAfter(seg.start) ? wsStart : seg.start
      const end = wsEnd.isBefore(seg.end) ? wsEnd : seg.end
      if(!start.isBefore(end)) continue
      const limit = end.valueOf()
      for(let t = start.valueOf(); t + step <= limit; t += step){
        out.push({
          start: d.utc(t).toISOString(),
          end: d.utc(t + step).toISOString()
        })
      }
    }
  }
  return out
}
export default findAvailableSlots;
// Generation time: 211.798s
// Result: PASS