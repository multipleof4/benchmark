async function findAvailableSlots(calendar1, calendar2, constraints) {
  const { DateTime, Interval } = await import('https://cdn.jsdelivr.net/npm/luxon@3.4.4/+esm');
  
  const { durationMinutes, searchRange, workHours } = constraints;
  const rangeStart = DateTime.fromISO(searchRange.start, { zone: 'utc' });
  const rangeEnd = DateTime.fromISO(searchRange.end, { zone: 'utc' });
  const [whStartH, whStartM] = workHours.start.split(':').map(Number);
  const [whEndH, whEndM] = workHours.end.split(':').map(Number);
  
  const busyIntervals = [...calendar1, ...calendar2]
    .map(b => Interval.fromDateTimes(
      DateTime.fromISO(b.start, { zone: 'utc' }),
      DateTime.fromISO(b.end, { zone: 'utc' })
    ))
    .filter(i => i.isValid)
    .sort((a, b) => a.start - b.start);
  
  const merged = [];
  for (const interval of busyIntervals) {
    if (!merged.length || merged[merged.length - 1].end < interval.start) {
      merged.push(interval);
    } else {
      const last = merged.pop();
      merged.push(Interval.fromDateTimes(
        last.start,
        last.end > interval.end ? last.end : interval.end
      ));
    }
  }
  
  const freeIntervals = [];
  let cursor = rangeStart;
  for (const busy of merged) {
    if (busy.start > cursor && busy.start <= rangeEnd) {
      freeIntervals.push(Interval.fromDateTimes(cursor, busy.start < rangeEnd ? busy.start : rangeEnd));
    }
    cursor = busy.end > cursor ? busy.end : cursor;
  }
  if (cursor < rangeEnd) {
    freeIntervals.push(Interval.fromDateTimes(cursor, rangeEnd));
  }
  
  const getWorkInterval = day => {
    const start = day.set({ hour: whStartH, minute: whStartM, second: 0, millisecond: 0 });
    const end = day.set({ hour: whEndH, minute: whEndM, second: 0, millisecond: 0 });
    return start < end ? Interval.fromDateTimes(start, end) : null;
  };
  
  const slots = [];
  
  for (const free of freeIntervals) {
    let day = free.start.startOf('day');
    const endDay = free.end.startOf('day');
    
    while (day <= endDay) {
      const workInt = getWorkInterval(day);
      if (workInt) {
        const intersection = free.intersection(workInt);
        if (intersection && intersection.length('minutes') >= durationMinutes) {
          let slotStart = intersection.start;
          while (slotStart.plus({ minutes: durationMinutes }) <= intersection.end) {
            const slotEnd = slotStart.plus({ minutes: durationMinutes });
            slots.push({
              start: slotStart.toISO({ suppressMilliseconds: true }),
              end: slotEnd.toISO({ suppressMilliseconds: true })
            });
            slotStart = slotEnd;
          }
        }
      }
      day = day.plus({ days: 1 });
    }
  }
  
  return slots.sort((a, b) => a.start.localeCompare(b.start));
}
export default findAvailableSlots;