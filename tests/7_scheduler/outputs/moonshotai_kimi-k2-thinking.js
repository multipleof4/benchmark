async function findAvailableSlots(cal1, cal2, constraints) {
  const { parseISO, addMinutes, set, max, min, startOfDay } = await import('https://cdn.skypack.dev/date-fns');
  
  const { durationMinutes, searchRange, workHours } = constraints;
  const toDate = d => parseISO(d);
  const [whStart, whEnd] = [workHours.start, workHours.end].map(t => t.split(':').map(Number));
  const durMs = durationMinutes * 60000;
  const rng = { s: toDate(searchRange.start), e: toDate(searchRange.end) };
  
  const merged = [...cal1, ...cal2]
    .map(({ start, end }) => ({ s: toDate(start), e: toDate(end) }))
    .sort((a, b) => a.s - b.s)
    .reduce((acc, slot) => {
      const last = acc.at(-1);
      if (!last || slot.s > last.e) acc.push({ ...slot });
      else last.e = max([last.e, slot.e]);
      return acc;
    }, []);
  
  const gaps = [];
  let cur = rng.s;
  for (let i = 0; i <= merged.length; i++) {
    const slot = merged[i];
    const end = slot ? slot.s : rng.e;
    if (end > cur && cur < rng.e) gaps.push({ s: cur, e: end });
    cur = slot && cur < slot.e ? slot.e : cur;
    if (cur >= rng.e) break;
  }
  
  const slots = [];
  for (const { s, e } of gaps) {
    let day = startOfDay(s);
    const lastDay = startOfDay(e);
    
    while (day <= lastDay) {
      const ws = set(day, { hours: whStart[0], minutes: whStart[1], seconds: 0, milliseconds: 0 });
      const we = set(day, { hours: whEnd[0], minutes: whEnd[1], seconds: 0, milliseconds: 0 });
      
      if (ws < we) {
        const effS = max([ws, s]);
        const effE = min([we, e]);
        
        if (effS < effE) {
          let slotS = effS;
          while (slotS.getTime() + durMs <= effE.getTime()) {
            const slotE = addMinutes(slotS, durationMinutes);
            slots.push({ start: slotS.toISOString(), end: slotE.toISOString() });
            slotS = slotE;
          }
        }
      }
      
      day = addMinutes(day, 1440);
    }
  }
  
  return slots;
}
export default findAvailableSlots;