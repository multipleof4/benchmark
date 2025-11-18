export const findAvailableSlots = async (cal1, cal2, { durationMinutes: dur, searchRange: rng, workHours: wh }) => {
  const { DateTime, Interval } = await import('https://cdn.skypack.dev/luxon');
  const zone = 'utc';
  const fromISO = t => DateTime.fromISO(t, { zone });
  const searchIv = Interval.fromDateTimes(fromISO(rng.start), fromISO(rng.end));

  const busy = [...cal1, ...cal2]
    .map(s => Interval.fromDateTimes(fromISO(s.start), fromISO(s.end)))
    .filter(i => i.isValid && i.overlaps(searchIv))
    .sort((a, b) => a.start - b.start)
    .reduce((acc, cur) => {
      const last = acc[acc.length - 1];
      return last && (last.overlaps(cur) || last.abutsStart(cur))
        ? [...acc.slice(0, -1), last.union(cur)]
        : [...acc, cur];
    }, []);

  const slots = [];
  let curDate = searchIv.start.startOf('day');
  const [wsH, wsM] = wh.start.split(':');
  const [weH, weM] = wh.end.split(':');

  while (curDate < searchIv.end) {
    const workStart = curDate.set({ hour: wsH, minute: wsM });
    const workEnd = curDate.set({ hour: weH, minute: weM });
    const workIv = Interval.fromDateTimes(workStart, workEnd).intersection(searchIv);

    if (workIv && workIv.isValid) {
      let free = [workIv];
      busy.forEach(b => { free = free.flatMap(f => f.difference(b)); });
      
      free.forEach(iv => {
        iv.splitBy({ minutes: dur }).forEach(chunk => {
          if (Math.abs(chunk.length('minutes') - dur) < 0.01) {
            slots.push({ start: chunk.start.toISO(), end: chunk.end.toISO() });
          }
        });
      });
    }
    curDate = curDate.plus({ days: 1 });
  }

  return slots;
};
export default findAvailableSlots;