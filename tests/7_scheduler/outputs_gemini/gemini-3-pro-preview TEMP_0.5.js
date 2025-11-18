const findAvailableSlots = async (calA, calB, { durationMinutes: dur, searchRange: rng, workHours: wh }) => {
  const { addMinutes } = await import('https://esm.sh/date-fns@3');
  const D = (d) => new Date(d);
  const [sH, sM] = wh.start.split(':').map(Number);
  const [eH, eM] = wh.end.split(':').map(Number);
  const startMins = sH * 60 + sM;
  const endMins = eH * 60 + eM;

  let busy = [...calA, ...calB].map(x => ({ s: D(x.start), e: D(x.end) })).sort((a, b) => a.s - b.s);
  let merged = [], c = busy[0];
  if (c) {
    for (let i = 1; i < busy.length; i++) busy[i].s < c.e ? c.e = new Date(Math.max(c.e, busy[i].e)) : (merged.push(c), c = busy[i]);
    merged.push(c);
  }

  let slots = [], cur = D(rng.start), end = D(rng.end), bIdx = 0;
  while (cur < end) {
    const curMins = cur.getUTCHours() * 60 + cur.getUTCMinutes();
    if (curMins < startMins) {
      cur.setUTCHours(sH, sM, 0, 0);
      continue;
    }

    const nxt = addMinutes(cur, dur);
    const nxtMins = nxt.getUTCHours() * 60 + nxt.getUTCMinutes();
    const isNextDay = nxt.getUTCDate() !== cur.getUTCDate();
    
    if ((isNextDay && nxtMins !== 0) || (!isNextDay && nxtMins > endMins) || (isNextDay && nxtMins === 0 && endMins < 1440)) {
      cur.setUTCDate(cur.getUTCDate() + 1);
      cur.setUTCHours(sH, sM, 0, 0);
      continue;
    }

    if (nxt > end) break;

    while (bIdx < merged.length && merged[bIdx].e <= cur) bIdx++;
    let overlap = null;
    for (let i = bIdx; i < merged.length; i++) {
      if (merged[i].s >= nxt) break;
      if (merged[i].s < nxt && merged[i].e > cur) { overlap = merged[i]; break; }
    }

    if (overlap) cur = overlap.e;
    else {
      slots.push({ start: cur.toISOString(), end: nxt.toISOString() });
      cur = nxt;
    }
  }
  return slots;
};
export default findAvailableSlots;