const findAvailableSlots = async (calA, calB, { durationMinutes: dur, searchRange: rng, workHours: wh }) => {
  const { DateTime: D, Interval: I } = await import('https://esm.sh/luxon@3.4.4');
  const utc = { zone: 'utc' };
  const parse = t => D.fromISO(t, utc);
  
  const busy = [...calA, ...calB]
    .map(s => I.fromDateTimes(parse(s.start), parse(s.end)))
    .filter(i => i.isValid)
    .sort((a, b) => a.start - b.start)
    .reduce((acc, cur) => {
      const last = acc.at(-1);
      return (last && last.end >= cur.start) 
        ? (acc[acc.length - 1] = last.union(cur), acc) 
        : [...acc, cur];
    }, []);

  const searchI = I.fromDateTimes(parse(rng.start), parse(rng.end));
  const [sH, sM] = wh.start.split(':');
  const [eH, eM] = wh.end.split(':');
  const slots = [];

  let day = searchI.start.startOf('day');
  while (day < searchI.end) {
    const wStart = day.set({ hour: sH, minute: sM });
    const wEnd = day.set({ hour: eH, minute: eM });
    const workI = I.fromDateTimes(wStart, wEnd).intersection(searchI);

    if (workI?.isValid) {
      let cur = workI.start;
      while (cur.plus({ minutes: dur }) <= workI.end) {
        const slotI = I.after(cur, { minutes: dur });
        const clash = busy.find(b => b.overlaps(slotI));
        
        if (clash) {
          cur = clash.end > cur ? clash.end : cur.plus({ minutes: 1 });
        } else {
          slots.push({ start: slotI.start.toISO(), end: slotI.end.toISO() });
          cur = slotI.end;
        }
      }
    }
    day = day.plus({ days: 1 });
  }
  return slots;
};
export default findAvailableSlots;