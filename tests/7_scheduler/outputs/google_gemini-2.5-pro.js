async function findAvailableSlots(cal1, cal2, c) {
  const {
    parseISO, formatISO, addMinutes, isAfter, max, startOfDay,
    setHours, setMinutes, setSeconds, setMilliseconds, eachDayOfInterval
  } = await import('https://cdn.jsdelivr.net/npm/date-fns@3.6.0/index.mjs');

  const { durationMinutes: dur, searchRange: sr, workHours: wh } = c;
  const sStart = parseISO(sr.start);
  const sEnd = parseISO(sr.end);
  const toDate = s => parseISO(s);

  const [whsH, whsM] = wh.start.split(':').map(Number);
  const [wheH, wheM] = wh.end.split(':').map(Number);

  const applyTime = (d, h, m) =>
    setMilliseconds(setSeconds(setMinutes(setHours(startOfDay(d), h), m), 0), 0);

  const busy = [...cal1, ...cal2].map(({ start, end }) => ({
    start: toDate(start),
    end: toDate(end),
  }));

  const nonWork = [];
  if (sStart < sEnd) {
    for (const day of eachDayOfInterval({ start: sStart, end: sEnd })) {
      nonWork.push({
        start: startOfDay(day),
        end: applyTime(day, whsH, whsM)
      });
      nonWork.push({
        start: applyTime(day, wheH, wheM),
        end: addMinutes(startOfDay(day), 1440)
      });
    }
  }

  const unavailable = [...busy, ...nonWork].sort((a, b) => a.start - b.start);

  const merged = unavailable.reduce((acc, slot) => {
    const last = acc[acc.length - 1];
    if (last && slot.start <= last.end) {
      last.end = max(last.end, slot.end);
    } else {
      acc.push({ ...slot });
    }
    return acc;
  }, []);

  const results = [];
  let ptr = sStart;
  const allBlocks = [...merged, { start: sEnd, end: sEnd }];

  for (const block of allBlocks) {
    let slotStart = ptr;
    while (true) {
      const slotEnd = addMinutes(slotStart, dur);
      if (isAfter(slotEnd, block.start)) break;
      results.push({ start: slotStart, end: slotEnd });
      slotStart = slotEnd;
    }
    ptr = max(ptr, block.end);
  }

  return results.map(({ start, end }) => ({
    start: formatISO(start),
    end: formatISO(end),
  }));
}
export default findAvailableSlots;