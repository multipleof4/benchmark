const findAvailableSlots = async (cal1, cal2, { durationMinutes: dur, searchRange: range, workHours: work }) => {
  const { parseISO } = await import('https://esm.sh/date-fns@2.30.0')
  const toMs = d => parseISO(d).getTime()
  
  const busy = [...cal1, ...cal2]
    .map(c => ({ s: toMs(c.start), e: toMs(c.end) }))
    .sort((a, b) => a.s - b.s)
    .reduce((acc, c) => {
      const last = acc[acc.length - 1]
      if (last && c.s < last.e) last.e = Math.max(last.e, c.e)
      else acc.push(c)
      return acc
    }, [])

  const start = toMs(range.start), end = toMs(range.end), ms = dur * 60000
  const [sh, sm] = work.start.split(':'), [eh, em] = work.end.split(':')
  const slots = []

  for (let d = new Date(start); d < end; d.setUTCDate(d.getUTCDate() + 1)) {
    d.setUTCHours(0, 0, 0, 0)
    const y = d.getUTCFullYear(), m = d.getUTCMonth(), day = d.getUTCDate()
    const wStart = Math.max(Date.UTC(y, m, day, sh, sm), start)
    const wEnd = Math.min(Date.UTC(y, m, day, eh, em), end)

    if (wStart >= wEnd) continue

    let ptr = wStart
    for (const b of busy) {
      if (b.e <= ptr) continue
      if (b.s >= wEnd) break
      while (ptr + ms <= b.s) {
        slots.push({ start: new Date(ptr).toISOString(), end: new Date(ptr + ms).toISOString() })
        ptr += ms
      }
      ptr = Math.max(ptr, b.e)
    }
    while (ptr + ms <= wEnd) {
      slots.push({ start: new Date(ptr).toISOString(), end: new Date(ptr + ms).toISOString() })
      ptr += ms
    }
  }
  
  return slots
}
export default findAvailableSlots;