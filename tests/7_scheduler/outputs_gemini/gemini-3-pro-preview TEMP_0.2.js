const findAvailableSlots = async (calA, calB, { durationMinutes: dur, searchRange: rng, workHours: wh }) => {
  const { DateTime: DT, Interval: IV } = await import('https://cdn.jsdelivr.net/npm/luxon@3.4.4/+esm');
  const z = { zone: 'utc' }, parse = s => DT.fromISO(s, z);
  const range = IV.fromDateTimes(parse(rng.start), parse(rng.end));

  const busy = [...calA, ...calB]
    .map(s => IV.fromDateTimes(parse(s.start), parse(s.end)))
    .filter(i => i.isValid)
    .sort((a, b) => a.start - b.start);

  const merged = busy.reduce((acc, curr) => {
    const last = acc[acc.length - 1];
    if (last && (last.overlaps(curr) || last.abutsStart(curr))) {
      acc[acc.length - 1] = last.union(curr);
    } else acc.push(curr);
    return acc;
  }, []);

  const slots = [];
  let day = range.start.startOf('day');
  const [sH, sM] = wh.start.split(':'), [eH, eM] = wh.end.split(':');

  while (day < range.end) {
    const wStart = day.set({ hour: sH, minute: sM }), wEnd = day.set({ hour: eH, minute: eM });
    let work = IV.fromDateTimes(wStart, wEnd).intersection(range);

    if (work && work.isValid) {
      let cursor = work.start;
      while (cursor < work.end) {
        const block = merged.find(b => b.end > cursor && b.start < work.end);
        const limit = (block && block.start < work.end) ? block.start : work.end;

        while (cursor.plus({ minutes: dur }) <= limit) {
          slots.push({ start: cursor.toISO(), end: cursor.plus({ minutes: dur }).toISO() });
          cursor = cursor.plus({ minutes: dur });
        }
        cursor = block ? (block.end > cursor ? block.end : cursor) : work.end;
      }
    }
    day = day.plus({ days: 1 });
  }
  return slots;
};
export default findAvailableSlots;