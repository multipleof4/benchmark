const findAvailableSlots = async (c1, c2, { durationMinutes: d, searchRange: r, workHours: wh }) => {
  const { addMinutes } = await import('https://esm.sh/date-fns@3.6.0');
  const toMs = x => new Date(x).getTime();
  const [rangeStart, rangeEnd] = [toMs(r.start), toMs(r.end)];

  const busy = [...c1, ...c2]
    .map(x => ({ s: toMs(x.start), e: toMs(x.end) }))
    .sort((a, b) => a.s - b.s)
    .reduce((acc, c) => {
      const last = acc.at(-1);
      if (last && c.s <= last.e) last.e = Math.max(last.e, c.e);
      else acc.push(c);
      return acc;
    }, []);

  const slots = [], dm = d * 6e4;
  let walker = new Date(rangeStart), bIdx = 0;
  walker.setUTCHours(0, 0, 0, 0);

  const [wsH, wsM] = wh.start.split(':'), [weH, weM] = wh.end.split(':');

  while (walker.getTime() <= rangeEnd) {
    const wStart = new Date(walker).setUTCHours(wsH, wsM, 0, 0);
    const wEnd = new Date(walker).setUTCHours(weH, weM, 0, 0);
    let cur = Math.max(wStart, rangeStart), lim = Math.min(wEnd, rangeEnd);

    while (cur + dm <= lim) {
      const next = cur + dm;
      while (bIdx < busy.length && busy[bIdx].e <= cur) bIdx++;
      
      if (bIdx < busy.length && busy[bIdx].s < next) {
        cur = busy[bIdx].e;
      } else {
        slots.push({ 
          start: new Date(cur).toISOString(), 
          end: addMinutes(new Date(cur), d).toISOString() 
        });
        cur = next;
      }
    }
    walker.setUTCDate(walker.getUTCDate() + 1);
  }
  return slots;
};
export default findAvailableSlots;