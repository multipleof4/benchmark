export const findAvailableSlots = async (calA, calB, { durationMinutes, searchRange, workHours }) => {
  const { DateTime, Interval } = await import('https://cdn.jsdelivr.net/npm/luxon@3.4.4/+esm');
  const zone = 'utc';
  const toDt = (iso) => DateTime.fromISO(iso, { zone });
  const totalRange = Interval.fromDateTimes(toDt(searchRange.start), toDt(searchRange.end));
  const busy = Interval.merge([...calA, ...calB].map(({ start, end }) => Interval.fromDateTimes(toDt(start), toDt(end))));

  const results = [];
  let cursor = totalRange.start.startOf('day');

  while (cursor < totalRange.end) {
    const [startH, startM] = workHours.start.split(':');
    const [endH, endM] = workHours.end.split(':');
    
    const dailyWork = Interval.fromDateTimes(
      cursor.set({ hour: +startH, minute: +startM }),
      cursor.set({ hour: +endH, minute: +endM })
    );
    
    const effective = dailyWork.intersection(totalRange);

    if (effective?.isValid && !effective.isEmpty()) {
      let available = [effective];
      for (const b of busy) {
        if (b.overlaps(effective)) {
          available = available.flatMap(a => a.difference(b));
        }
      }

      for (const period of available) {
        period.splitBy({ minutes: durationMinutes }).forEach(slot => {
          if (slot.isValid && slot.toDuration('minutes').minutes === durationMinutes) {
            results.push({ start: slot.start.toISO(), end: slot.end.toISO() });
          }
        });
      }
    }
    cursor = cursor.plus({ days: 1 });
  }

  return results;
};
export default findAvailableSlots;