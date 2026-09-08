export async function findAvailableSlots(cal1, cal2, constraints) {
  const { DateTime } = await import('https://cdn.jsdelivr.net/npm/luxon@3/+esm');
  const { durationMinutes, searchRange, workHours } = constraints;
  const dur = durationMinutes * 60000;
  const toUtc = s => DateTime.fromISO(s, { zone: 'utc' });
  const [sH, sM] = workHours.start.split(':').map(Number);
  const [eH, eM] = workHours.end.split(':').map(Number);

  const rangeStart = toUtc(searchRange.start);
  const rangeEnd = toUtc(searchRange.end);
  const rStartMs = rangeStart.toMillis();
  const rEndMs = rangeEnd.toMillis();

  const busy = [...cal1, ...cal2]
    .map(({ start, end }) => ({ s: toUtc(start).toMillis(), e: toUtc(end).toMillis() }))
    .filter(b => b.s < b.e)
    .sort((a, b) => a.s - b.s);

  const mergedBusy = busy.reduce((acc, b) => {
    const last = acc[acc.length - 1];
    last && b.s <= last.e ? (last.e = Math.max(last.e, b.e)) : acc.push({ ...b });
    return acc;
  }, []);

  const slots = [];
  const addSlots = (from, to) => {
    for (let t = from; t + dur <= to; t += dur) {
      slots.push({
        start: DateTime.fromMillis(t, { zone: 'utc' }).toISO(),
        end: DateTime.fromMillis(t + dur, { zone: 'utc' }).toISO()
      });
    }
  };

  for (let d = rangeStart.startOf('day'); d <= rangeEnd; d = d.plus({ days: 1 })) {
    const wStart = Math.max(d.set({ hour: sH, minute: sM, second: 0, millisecond: 0 }).toMillis(), rStartMs);
    const wEnd = Math.min(d.set({ hour: eH, minute: eM, second: 0, millisecond: 0 }).toMillis(), rEndMs);

    if (wStart < wEnd) {
      let cur = wStart;
      for (const b of mergedBusy) {
        if (b.e <= cur) continue;
        if (b.s >= wEnd) break;
        if (b.s > cur) addSlots(cur, Math.min(b.s, wEnd));
        cur = Math.max(cur, b.e);
        if (cur >= wEnd) break;
      }
      if (cur < wEnd) addSlots(cur, wEnd);
    }
  }

  return slots;
}
export default findAvailableSlots;
// Generation time: 71.113s
// Result: PASS