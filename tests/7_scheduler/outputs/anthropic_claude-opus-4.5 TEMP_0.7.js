async function findAvailableSlots(calendar1, calendar2, constraints) {
  const { DateTime, Interval } = await import('https://cdn.jsdelivr.net/npm/luxon@3.4.4/+esm');
  
  const { durationMinutes, searchRange, workHours } = constraints;
  const rangeStart = DateTime.fromISO(searchRange.start, { zone: 'utc' });
  const rangeEnd = DateTime.fromISO(searchRange.end, { zone: 'utc' });
  const [whStartH, whStartM] = workHours.start.split(':').map(Number);
  const [whEndH, whEndM] = workHours.end.split(':').map(Number);
  
  const allBusy = [...calendar1, ...calendar2]
    .map(b => ({
      start: DateTime.fromISO(b.start, { zone: 'utc' }),
      end: DateTime.fromISO(b.end, { zone: 'utc' })
    }))
    .filter(b => b.end > rangeStart && b.start < rangeEnd)
    .sort((a, b) => a.start - b.start);
  
  const merged = [];
  for (const b of allBusy) {
    if (!merged.length || b.start > merged[merged.length - 1].end) {
      merged.push({ start: b.start, end: b.end });
    } else {
      merged[merged.length - 1].end = DateTime.max(merged[merged.length - 1].end, b.end);
    }
  }
  
  const free = [];
  let cursor = rangeStart;
  for (const b of merged) {
    if (b.start > cursor) {
      free.push({ start: cursor, end: b.start });
    }
    cursor = DateTime.max(cursor, b.end);
  }
  if (cursor < rangeEnd) {
    free.push({ start: cursor, end: rangeEnd });
  }
  
  const getWorkWindow = (day) => {
    const ws = day.set({ hour: whStartH, minute: whStartM, second: 0, millisecond: 0 });
    const we = day.set({ hour: whEndH, minute: whEndM, second: 0, millisecond: 0 });
    return { start: ws, end: we };
  };
  
  const slots = [];
  
  for (const f of free) {
    let day = f.start.startOf('day');
    const lastDay = f.end.startOf('day');
    
    while (day <= lastDay) {
      const ww = getWorkWindow(day);
      const effStart = DateTime.max(f.start, ww.start, rangeStart);
      const effEnd = DateTime.min(f.end, ww.end, rangeEnd);
      
      if (effStart < effEnd) {
        let slotStart = effStart;
        while (true) {
          const slotEnd = slotStart.plus({ minutes: durationMinutes });
          if (slotEnd > effEnd) break;
          slots.push({
            start: slotStart.toISO(),
            end: slotEnd.toISO()
          });
          slotStart = slotEnd;
        }
      }
      day = day.plus({ days: 1 });
    }
  }
  
  return slots;
}
export default findAvailableSlots;
// Generation time: 12.726s
// Result: PASS