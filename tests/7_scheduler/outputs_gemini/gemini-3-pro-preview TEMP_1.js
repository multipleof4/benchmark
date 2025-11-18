const findAvailableSlots = async (calendarA, calendarB, { durationMinutes, searchRange, workHours }) => {
  const { addMinutes, formatISO } = await import('https://cdn.jsdelivr.net/npm/date-fns@3.6.0/+esm');
  const T = (d) => new Date(d).getTime();
  const durMs = durationMinutes * 60000;
  const rangeEnd = T(searchRange.end);

  const busy = [...calendarA, ...calendarB]
    .map(s => ({ s: T(s.start), e: T(s.end) }))
    .sort((a, b) => a.s - b.s)
    .reduce((acc, c) => {
      if (acc.length && c.s < acc[acc.length - 1].e) {
        acc[acc.length - 1].e = Math.max(acc[acc.length - 1].e, c.e);
      } else {
        acc.push(c);
      }
      return acc;
    }, []);

  const slots = [];
  let currentDay = new Date(searchRange.start);
  currentDay.setUTCHours(0, 0, 0, 0);

  while (currentDay.getTime() < rangeEnd) {
    const dateStr = currentDay.toISOString().split('T')[0];
    const workStart = T(`${dateStr}T${workHours.start}:00Z`);
    const workEnd = T(`${dateStr}T${workHours.end}:00Z`);

    const winStart = Math.max(workStart, T(searchRange.start));
    const winEnd = Math.min(workEnd, rangeEnd);

    if (winStart < winEnd) {
      let cursor = winStart;
      
      for (const b of busy) {
        if (b.e <= cursor) continue;
        if (b.s >= winEnd) break;

        while (cursor + durMs <= b.s) {
          slots.push({ start: formatISO(cursor), end: formatISO(addMinutes(cursor, durationMinutes)) });
          cursor += durMs;
        }
        cursor = Math.max(cursor, b.e);
      }

      while (cursor + durMs <= winEnd) {
        slots.push({ start: formatISO(cursor), end: formatISO(addMinutes(cursor, durationMinutes)) });
        cursor += durMs;
      }
    }
    currentDay.setUTCDate(currentDay.getUTCDate() + 1);
  }

  return slots;
};
export default findAvailableSlots;