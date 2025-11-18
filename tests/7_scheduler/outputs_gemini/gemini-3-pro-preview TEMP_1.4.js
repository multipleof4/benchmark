const findAvailableSlots = async (calA, calB, { durationMinutes: dur, searchRange: rng, workHours: wh }) => {
  const { parseISO, formatISO } = await import('https://esm.sh/date-fns@2.30.0');
  
  const toMs = (d) => parseISO(d).getTime();
  const [wSh, wSm] = wh.start.split(':').map(Number);
  const [wEh, wEm] = wh.end.split(':').map(Number);
  
  const busy = [...calA, ...calB]
    .map(x => ({ s: toMs(x.start), e: toMs(x.end) }))
    .sort((a, b) => a.s - b.s)
    .reduce((acc, c) => {
      const last = acc[acc.length - 1];
      if (last && c.s < last.e) last.e = Math.max(last.e, c.e);
      else acc.push(c);
      return acc;
    }, []);

  const res = [];
  const limit = toMs(rng.end);
  let curr = toMs(rng.start);
  const msDur = dur * 60000;

  while (curr + msDur <= limit) {
    const slotEnd = curr + msDur;
    const d = new Date(curr);
    
    const dayS = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), wSh, wSm);
    const dayE = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), wEh, wEm);

    if (curr < dayS) {
      curr = dayS;
      continue;
    }
    
    if (slotEnd > dayE) {
      curr = dayS + 86400000; 
      continue;
    }

    const clash = busy.find(b => curr < b.e && slotEnd > b.s);
    if (clash) {
      curr = clash.e;
      continue;
    }

    res.push({ start: formatISO(curr), end: formatISO(slotEnd) });
    curr = slotEnd;
  }

  return res;
};
export default findAvailableSlots;