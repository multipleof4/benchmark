async function findAvailableSlots(calendar1, calendar2, constraints) {
  const {
    parseISO, addMinutes, formatISO, max, setHours, setMinutes,
    setSeconds, setMilliseconds, startOfDay, endOfDay, eachDayOfInterval,
  } = await import('https://cdn.jsdelivr.net/npm/date-fns@2/esm/index.js');

  const { durationMinutes: duration, searchRange, workHours } = constraints;
  const searchStart = parseISO(searchRange.start);
  const searchEnd = parseISO(searchRange.end);
  const [workStartH, workStartM] = workHours.start.split(':').map(Number);
  const [workEndH, workEndM] = workHours.end.split(':').map(Number);

  const setTime = (date, h, m) =>
    setMilliseconds(setSeconds(setMinutes(setHours(date, h), m), 0), 0);

  const busySlots = [...calendar1, ...calendar2].map(({ start, end }) => ({
    start: parseISO(start),
    end: parseISO(end),
  }));

  const nonWorkSlots = eachDayOfInterval({ start: searchStart, end: searchEnd })
    .flatMap(day => [
      { start: startOfDay(day), end: setTime(day, workStartH, workStartM) },
      { start: setTime(day, workEndH, workEndM), end: endOfDay(day) }
    ]);

  const allUnavailable = [...busySlots, ...nonWorkSlots]
    .sort((a, b) => a.start - b.start);

  const merged = allUnavailable.reduce((acc, current) => {
    const last = acc.at(-1);
    if (last && current.start <= last.end) {
      last.end = max(last.end, current.end);
    } else {
      acc.push({ ...current });
    }
    return acc;
  }, []);

  const availableSlots = [];
  let cursor = searchStart;

  [...merged, { start: searchEnd, end: searchEnd }].forEach(block => {
    let slotStart = cursor;
    while (addMinutes(slotStart, duration) <= block.start) {
      const slotEnd = addMinutes(slotStart, duration);
      availableSlots.push({ start: slotStart, end: slotEnd });
      slotStart = slotEnd;
    }
    cursor = max(cursor, block.end);
  });

  return availableSlots.map(({ start, end }) => ({
    start: formatISO(start),
    end: formatISO(end),
  }));
}
export default findAvailableSlots;