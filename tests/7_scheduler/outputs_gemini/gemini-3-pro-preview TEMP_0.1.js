const findAvailableSlots = async (calA, calB, { durationMinutes: dur, searchRange: range, workHours: wh }) => {
  const { parseISO } = await import('https://esm.sh/date-fns@2.30.0');
  
  const toMs = (t) => parseISO(t).getTime();
  const getMins = (t) => { const [h, m] = t.split(':'); return h * 60 + +m; };
  
  const [whStart, whEnd] = [getMins(wh.start), getMins(wh.end)];
  const [rStart, rEnd] = [toMs(range.start), toMs(range.end)];
  const durMs = dur * 60000;

  const busy = [...calA, ...calB]
    .map(s => ({ s: toMs(s.start), e: toMs(s.end) }))
    .sort((a, b) => a.s - b.s);

  const merged = [];
  if (busy.length) {
    let curr = busy[0];
    for (let i = 1; i < busy.length; i++) {
      if (busy[i].s < curr.e) curr.e = Math.max(curr.e, busy[i].e);
      else { merged.push(curr); curr = busy[i]; }
    }
    merged.push(curr);
  }

  const gaps = [];
  let ptr = rStart;
  const relBusy = [...merged.filter(b => b.e > rStart && b.s < rEnd), { s: rEnd, e: rEnd }];

  for (const b of relBusy) {
    const s = Math.max(ptr, rStart), e = Math.min(b.s, rEnd);
    if (e - s >= durMs) gaps.push({ s, e });
    ptr = Math.max(ptr, b.e);
  }

  const slots = [];
  for (const g of gaps) {
    let t = g.s;
    while (t + durMs <= g.e) {
      const d = new Date(t);
      const curM = d.getUTCHours() * 60 + d.getUTCMinutes();
      
      if (curM >= whStart && curM + dur <= whEnd) {
        slots.push({ start: d.toISOString(), end: new Date(t + durMs).toISOString() });
        t += durMs;
      } else {
        if (curM < whStart) {
          d.setUTCHours(0, whStart, 0, 0);
        } else {
          d.setUTCDate(d.getUTCDate() + 1);
          d.setUTCHours(0, whStart, 0, 0);
        }
        t = Math.max(t, d.getTime());
      }
    }
  }

  return slots;
};
export default findAvailableSlots;