const findAvailableSlots = async (calA, calB, constraints) => {
  const { DateTime: D } = await import('https://cdn.jsdelivr.net/npm/luxon@3.4.4/+esm');
  const { durationMinutes: dur, searchRange: rng, workHours: wh } = constraints;
  
  const utc = { zone: 'utc' };
  const parse = s => D.fromISO(s, utc);
  const durMs = dur * 60000;
  
  const busy = [...calA, ...calB]
    .map(x => ({ s: parse(x.start).valueOf(), e: parse(x.end).valueOf() }))
    .sort((a, b) => a.s - b.s)
    .reduce((acc, cur) => {
      const last = acc.at(-1);
      if (last && cur.s <= last.e) last.e = Math.max(last.e, cur.e);
      else acc.push(cur);
      return acc;
    }, []);

  const slots = [];
  const rangeStart = parse(rng.start).valueOf();
  const rangeEnd = parse(rng.end).valueOf();
  const [wsH, wsM] = wh.start.split(':').map(Number);
  const [weH, weM] = wh.end.split(':').map(Number);

  let currDay = parse(rng.start).startOf('day');

  while (currDay.valueOf() < rangeEnd) {
    const wStart = Math.max(currDay.set({ hour: wsH, minute: wsM }).valueOf(), rangeStart);
    const wEnd = Math.min(currDay.set({ hour: weH, minute: weM }).valueOf(), rangeEnd);

    if (wStart < wEnd) {
      let ptr = wStart;
      for (const b of busy) {
        if (b.e <= ptr) continue;
        if (b.s >= wEnd) break;
        while (ptr + durMs <= b.s) {
          slots.push({ start: D.fromMillis(ptr, utc).toISO(), end: D.fromMillis(ptr + durMs, utc).toISO() });
          ptr += durMs;
        }
        ptr = Math.max(ptr, b.e);
      }
      while (ptr + durMs <= wEnd) {
        slots.push({ start: D.fromMillis(ptr, utc).toISO(), end: D.fromMillis(ptr + durMs, utc).toISO() });
        ptr += durMs;
      }
    }
    currDay = currDay.plus({ days: 1 });
  }

  return slots;
};
export default findAvailableSlots;