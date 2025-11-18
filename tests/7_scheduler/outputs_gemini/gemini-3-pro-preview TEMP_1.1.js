const findAvailableSlots = async (calA, calB, { durationMinutes: dur, searchRange: rng, workHours: wh }) => {
  const { addMinutes: add, parseISO: prs, isBefore: isB, isAfter: isA, isEqual: isE } = await import('https://cdn.jsdelivr.net/npm/date-fns@2.30.0/esm/index.js');
  
  const [rS, rE] = [prs(rng.start), prs(rng.end)];
  const busy = [...calA, ...calB]
    .map(x => ({ s: prs(x.start), e: prs(x.end) }))
    .filter(x => isB(x.s, rE) && isA(x.e, rS))
    .sort((a, b) => a.s - b.s);

  let ptr = rS, res = [];
  const [wsH, wsM] = wh.start.split(':'), [weH, weM] = wh.end.split(':');

  for (const b of [...busy, { s: rE, e: rE }]) {
    if (isA(b.s, ptr)) {
      let cur = ptr;
      while (true) {
        const nxt = add(cur, dur);
        if (isA(nxt, b.s)) break;
        
        const uDay = new Date(Date.UTC(cur.getUTCFullYear(), cur.getUTCMonth(), cur.getUTCDate()));
        const wS = add(uDay, wsH * 60 + +wsM), wE = add(uDay, weH * 60 + +weM);

        if ((isA(cur, wS) || isE(cur, wS)) && (isB(nxt, wE) || isE(nxt, wE))) {
          res.push({ start: cur.toISOString(), end: nxt.toISOString() });
        }
        cur = nxt;
      }
    }
    ptr = isA(b.e, ptr) ? b.e : ptr;
  }
  return res;
};
export default findAvailableSlots;