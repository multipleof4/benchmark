export const findAvailableSlots = async (c1, c2, { durationMinutes: d, searchRange: r, workHours: w }) => {
  const { parseISO } = await import('https://cdn.jsdelivr.net/npm/date-fns@2.30.0/+esm');
  const toMs = x => parseISO(x).getTime();
  const [wsH, wsM] = w.start.split(':').map(Number);
  const [weH, weM] = w.end.split(':').map(Number);
  const rStart = toMs(r.start), rEnd = toMs(r.end), durMs = d * 6e4;

  const busy = [...c1, ...c2]
    .map(x => ({ s: toMs(x.start), e: toMs(x.end) }))
    .sort((a, b) => a.s - b.s)
    .reduce((acc, cur) => {
      if (acc.length && cur.s <= acc[acc.length - 1].e) acc[acc.length - 1].e = Math.max(acc[acc.length - 1].e, cur.e);
      else acc.push(cur);
      return acc;
    }, []);

  let free = [], curr = new Date(rStart);
  curr.setUTCHours(0, 0, 0, 0);
  
  while (curr.getTime() < rEnd) {
    const s = Math.max(new Date(curr).setUTCHours(wsH, wsM, 0, 0), rStart);
    const e = Math.min(new Date(curr).setUTCHours(weH, weM, 0, 0), rEnd);
    if (s < e) free.push({ s, e });
    curr.setUTCDate(curr.getUTCDate() + 1);
  }

  return busy.reduce((acc, b) => acc.flatMap(f => {
    if (b.e <= f.s || b.s >= f.e) return [f];
    return [
      ...(f.s < b.s ? [{ s: f.s, e: b.s }] : []),
      ...(f.e > b.e ? [{ s: b.e, e: f.e }] : [])
    ];
  }), free).flatMap(f => {
    const slots = [];
    for (let t = f.s; t + durMs <= f.e; t += durMs) {
      slots.push({ start: new Date(t).toISOString(), end: new Date(t + durMs).toISOString() });
    }
    return slots;
  });
};
export default findAvailableSlots;