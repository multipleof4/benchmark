export const findAvailableSlots = async (calA, calB, { durationMinutes: dur, searchRange, workHours }) => {
  const { DateTime, Interval } = await import('https://esm.sh/luxon@3.4.4');
  const utc = (t) => DateTime.fromISO(t, { zone: 'utc' });
  const bounds = Interval.fromDateTimes(utc(searchRange.start), utc(searchRange.end));
  
  const busy = [...calA, ...calB]
    .map(s => Interval.fromDateTimes(utc(s.start), utc(s.end)))
    .filter(i => i.isValid && i.overlaps(bounds))
    .sort((a, b) => a.start - b.start)
    .reduce((acc, cur) => {
      const last = acc.at(-1);
      return last && last.end >= cur.start ? [...acc.slice(0, -1), last.union(cur)] : [...acc, cur];
    }, []);

  const slots = [];
  let cursor = bounds.start.startOf('day');
  
  while (cursor <= bounds.end) {
    const [sH, sM] = workHours.start.split(':');
    const [eH, eM] = workHours.end.split(':');
    const workInt = Interval.fromDateTimes(
      cursor.set({ hour: sH, minute: sM }), 
      cursor.set({ hour: eH, minute: eM })
    ).intersection(bounds);

    if (workInt?.isValid) {
      let free = [workInt];
      busy.filter(b => b.overlaps(workInt)).forEach(b => free = free.flatMap(f => f.difference(b)));
      
      free.forEach(f => {
        let s = f.start;
        while (s.plus({ minutes: dur }) <= f.end) {
          const e = s.plus({ minutes: dur });
          slots.push({ start: s.toISO(), end: e.toISO() });
          s = e;
        }
      });
    }
    cursor = cursor.plus({ days: 1 });
  }
  
  return slots;
};
export default findAvailableSlots;