const findAvailableSlots = async (calA, calB, { durationMinutes: dur, searchRange: rng, workHours: wh }) => {
  const { addMinutes } = await import('https://cdn.jsdelivr.net/npm/date-fns@3.6.0/+esm');
  const parse = d => new Date(d).getTime();
  const toIso = t => new Date(t).toISOString();

  const [rStart, rEnd] = [parse(rng.start), parse(rng.end)];
  const msDur = dur * 60000;

  const busy = [...calA, ...calB]
    .map(x => ({ s: parse(x.start), e: parse(x.end) }))
    .sort((a, b) => a.s - b.s)
    .reduce((acc, c) => {
      const last = acc[acc.length - 1];
      if (last && c.s < last.e) last.e = Math.max(last.e, c.e);
      else acc.push({ ...c });
      return acc;
    }, []);

  const slots = [];
  let curr = new Date(rStart);
  curr.setUTCHours(0, 0, 0, 0);

  while (curr.getTime() < rEnd) {
    const [wsH, wsM] = wh.start.split(':'), [weH, weM] = wh.end.split(':');
    const wStart = new Date(curr).setUTCHours(+wsH, +wsM, 0, 0);
    const wEnd = new Date(curr).setUTCHours(+weH, +weM, 0, 0);
    
    const winStart = Math.max(wStart, rStart);
    const winEnd = Math.min(wEnd, rEnd);

    if (winStart < winEnd) {
      let t = winStart;
      while (t + msDur <= winEnd) {
        const tEnd = addMinutes(t, dur).getTime();
        const clash = busy.find(b => t < b.e && tEnd > b.s);
        
        if (clash) t = clash.e;
        else {
          slots.push({ start: toIso(t), end: toIso(tEnd) });
          t = tEnd;
        }
      }
    }
    curr.setUTCDate(curr.getUTCDate() + 1);
  }

  return slots;
};
export default findAvailableSlots;