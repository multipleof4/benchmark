async function findAvailableSlots(cal1, cal2, constraints) {
  const { default: dayjs } = await import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/+esm');
  const [{ default: utc }, { default: isBetween }, { default: customParseFormat }] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/esm/plugin/utc/+esm'),
    import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/esm/plugin/isBetween/+esm'),
    import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/esm/plugin/customParseFormat/+esm')
  ]);
  
  dayjs.extend(utc);
  dayjs.extend(isBetween);
  dayjs.extend(customParseFormat);

  const { durationMinutes, searchRange, workHours } = constraints;
  const allBusy = [...cal1, ...cal2]
    .map(s => ({ start: dayjs(s.start), end: dayjs(s.end) }))
    .sort((a, b) => a.start.valueOf() - b.start.valueOf());

  const merged = allBusy.reduce((acc, curr) => {
    if (!acc.length || acc[acc.length - 1].end.isBefore(curr.start)) {
      acc.push(curr);
    } else {
      acc[acc.length - 1].end = dayjs.max(acc[acc.length - 1].end, curr.end);
    }
    return acc;
  }, []);

  const slots = [];
  const rangeStart = dayjs(searchRange.start);
  const rangeEnd = dayjs(searchRange.end);
  const [workStart, workEnd] = [workHours.start, workHours.end];

  const getWorkBounds = (date) => {
    const [sh, sm] = workStart.split(':').map(Number);
    const [eh, em] = workEnd.split(':').map(Number);
    return {
      start: date.hour(sh).minute(sm).second(0).millisecond(0),
      end: date.hour(eh).minute(em).second(0).millisecond(0)
    };
  };

  let currentDay = rangeStart.startOf('day');
  while (currentDay.isBefore(rangeEnd) || currentDay.isSame(rangeEnd, 'day')) {
    const { start: dayWorkStart, end: dayWorkEnd } = getWorkBounds(currentDay);
    const dayStart = dayjs.max(dayWorkStart, rangeStart);
    const dayEnd = dayjs.min(dayWorkEnd, rangeEnd);

    if (dayStart.isBefore(dayEnd)) {
      let cursor = dayStart;
      
      for (const busy of merged) {
        if (busy.end.isBefore(dayStart) || busy.start.isAfter(dayEnd)) continue;
        
        const gapEnd = dayjs.min(busy.start, dayEnd);
        while (cursor.add(durationMinutes, 'minute').isSameOrBefore(gapEnd)) {
          slots.push({
            start: cursor.toISOString(),
            end: cursor.add(durationMinutes, 'minute').toISOString()
          });
          cursor = cursor.add(durationMinutes, 'minute');
        }
        cursor = dayjs.max(cursor, busy.end);
      }

      while (cursor.add(durationMinutes, 'minute').isSameOrBefore(dayEnd)) {
        slots.push({
          start: cursor.toISOString(),
          end: cursor.add(durationMinutes, 'minute').toISOString()
        });
        cursor = cursor.add(durationMinutes, 'minute');
      }
    }
    
    currentDay = currentDay.add(1, 'day');
  }

  return slots;
}
export default findAvailableSlots;