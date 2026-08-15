export async function findAvailableSlots(calendar1 = [], calendar2 = [], constraints) {
  const { DateTime } = await import('https://cdn.jsdelivr.net/npm/luxon@3.4.4/+esm');

  const durMs = constraints.durationMinutes * 60000;
  if (!durMs || durMs <= 0) return [];

  const rangeStart = DateTime.fromISO(constraints.searchRange.start, { zone: 'utc' }).toMillis();
  const rangeEnd = DateTime.fromISO(constraints.searchRange.end, { zone: 'utc' }).toMillis();
  if (rangeStart >= rangeEnd) return [];

  const [whStartH, whStartM] = constraints.workHours.start.split(':').map(Number);
  const [whEndH, whEndM] = constraints.workHours.end.split(':').map(Number);

  const busySlots = [...calendar1, ...calendar2]
    .map(slot => ({
      start: DateTime.fromISO(slot.start, { zone: 'utc' }).toMillis(),
      end: DateTime.fromISO(slot.end, { zone: 'utc' }).toMillis()
    }))
    .filter(slot => slot.end > slot.start && slot.end > rangeStart && slot.start < rangeEnd)
    .sort((a, b) => a.start - b.start);

  const mergedBusy = busySlots.reduce((acc, curr) => {
    if (!acc.length || acc.at(-1).end < curr.start) {
      acc.push({ ...curr });
    } else {
      acc.at(-1).end = Math.max(acc.at(-1).end, curr.end);
    }
    return acc;
  }, []);

  const slots = [];
  const addSlots = (from, to) => {
    for (let time = from; time + durMs <= to; time += durMs) {
      slots.push({
        start: new Date(time).toISOString(),
        end: new Date(time + durMs).toISOString()
      });
    }
  };

  let dayCursor = DateTime.fromMillis(rangeStart, { zone: 'utc' }).startOf('day');
  const lastDay = DateTime.fromMillis(rangeEnd, { zone: 'utc' }).startOf('day');

  while (dayCursor <= lastDay) {
    const workStart = dayCursor.set({ hour: whStartH, minute: whStartM, second: 0, millisecond: 0 }).toMillis();
    const workEnd = dayCursor.set({ hour: whEndH, minute: whEndM, second: 0, millisecond: 0 }).toMillis();

    const winStart = Math.max(workStart, rangeStart);
    const winEnd = Math.min(workEnd, rangeEnd);

    if (winStart < winEnd) {
      let cursor = winStart;

      for (const busy of mergedBusy) {
        if (busy.end <= cursor) continue;
        if (busy.start >= winEnd) break;

        if (busy.start > cursor) {
          addSlots(cursor, Math.min(busy.start, winEnd));
        }

        cursor = Math.max(cursor, busy.end);
        if (cursor >= winEnd) break;
      }

      if (cursor < winEnd) {
        addSlots(cursor, winEnd);
      }
    }

    dayCursor = dayCursor.plus({ days: 1 });
  }

  return slots;
}
export default findAvailableSlots;
// Generation time: 32.042s
// Result: PASS