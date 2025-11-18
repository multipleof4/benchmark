async function findAvailableSlots(calendar1, calendar2, constraints) {
  const {
    parseISO, addMinutes, addDays, max, isBefore, isAfter, startOfDay,
  } = await import('https://cdn.jsdelivr.net/npm/date-fns@3.6.0/esm/index.js');

  const { durationMinutes, searchRange, workHours } = constraints;
  const searchStart = parseISO(searchRange.start);
  const searchEnd = parseISO(searchRange.end);
  const [workStartH, workStartM] = workHours.start.split(':').map(Number);
  const [workEndH, workEndM] = workHours.end.split(':').map(Number);

  const busySlots = [...calendar1, ...calendar2]
    .map(slot => ({ start: parseISO(slot.start), end: parseISO(slot.end) }))
    .sort((a, b) => a.start - b.start);

  const mergedBusy = busySlots.reduce((acc, current) => {
    const last = acc.at(-1);
    if (last && isBefore(current.start, last.end)) {
      last.end = max([last.end, current.end]);
    } else {
      acc.push({ ...current });
    }
    return acc;
  }, []);

  const freeIntervals = [];
  let cursor = searchStart;

  mergedBusy.forEach(busy => {
    if (isBefore(cursor, busy.start)) {
      freeIntervals.push({ start: cursor, end: busy.start });
    }
    cursor = max([cursor, busy.end]);
  });

  if (isBefore(cursor, searchEnd)) {
    freeIntervals.push({ start: cursor, end: searchEnd });
  }

  const availableSlots = freeIntervals.flatMap(gap => {
    const slotsInGap = [];
    let slotCursor = gap.start;

    while (isBefore(slotCursor, gap.end)) {
      const day = startOfDay(slotCursor);
      const workDayStart = new Date(day);
      workDayStart.setUTCHours(workStartH, workStartM, 0, 0);

      const workDayEnd = new Date(day);
      workDayEnd.setUTCHours(workEndH, workEndM, 0, 0);

      const slotStart = max([slotCursor, workDayStart]);
      const slotEnd = addMinutes(slotStart, durationMinutes);

      const canFit = !isAfter(slotEnd, workDayEnd) && !isAfter(slotEnd, gap.end);

      if (canFit) {
        slotsInGap.push({ start: slotStart, end: slotEnd });
        slotCursor = slotEnd;
      } else {
        const nextDayStart = addDays(day, 1);
        nextDayStart.setUTCHours(workStartH, workStartM, 0, 0);
        slotCursor = nextDayStart;
      }
    }
    return slotsInGap;
  });

  return availableSlots.map(slot => ({
    start: slot.start.toISOString(),
    end: slot.end.toISOString(),
  }));
}
export default findAvailableSlots;