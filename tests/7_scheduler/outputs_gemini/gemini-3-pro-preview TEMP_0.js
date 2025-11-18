const findAvailableSlots = async (calA, calB, { durationMinutes: dur, searchRange: rng, workHours: wh }) => {
  const { DateTime, Interval } = await import('https://cdn.jsdelivr.net/npm/luxon@3.4.4/+esm');
  const utc = t => DateTime.fromISO(t, { zone: 'utc' });
  
  const busy = [...calA, ...calB]
    .map(x => Interval.fromDateTimes(utc(x.start), utc(x.end)))
    .sort((a, b) => a.start - b.start)
    .reduce((acc, cur) => {
      const last = acc[acc.length - 1];
      return last && last.end >= cur.start 
        ? (acc[acc.length - 1] = last.union(cur), acc) 
        : [...acc, cur];
    }, []);

  const rangeInt = Interval.fromDateTimes(utc(rng.start), utc(rng.end));
  const [wsH, wsM] = wh.start.split(':');
  const [weH, weM] = wh.end.split(':');
  
  let curr = rangeInt.start.startOf('day'), workInts = [];
  while (curr <= rangeInt.end) {
    const wStart = curr.set({ hour: wsH, minute: wsM });
    const wEnd = curr.set({ hour: weH, minute: weM });
    const i = Interval.fromDateTimes(wStart, wEnd).intersection(rangeInt);
    if (i?.isValid && !i.isEmpty()) workInts.push(i);
    curr = curr.plus({ days: 1 });
  }

  return workInts
    .flatMap(w => busy.reduce((acc, b) => acc.flatMap(a => a.difference(b)), [w]))
    .flatMap(i => {
      const slots = [];
      let s = i.start;
      while (s.plus({ minutes: dur }) <= i.end) {
        slots.push({ start: s.toISO(), end: s.plus({ minutes: dur }).toISO() });
        s = s.plus({ minutes: dur });
      }
      return slots;
    });
};
export default findAvailableSlots;