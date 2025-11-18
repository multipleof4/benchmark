const findAvailableSlots = async (calA, calB, { durationMinutes: dur, searchRange: rng, workHours: wh }) => {
  const { DateTime: D, Interval: I } = await import('https://cdn.jsdelivr.net/npm/luxon@3.4.4/+esm');
  const Z = 'utc', parse = t => D.fromISO(t, { zone: Z });
  const busy = I.merge([...calA, ...calB].map(x => I.fromDateTimes(parse(x.start), parse(x.end))));
  const search = I.fromDateTimes(parse(rng.start), parse(rng.end));
  const [sH, sM] = wh.start.split(':'), [eH, eM] = wh.end.split(':');
  const slots = [];

  let curr = search.start.startOf('day');
  while (curr < search.end) {
    const wStart = curr.set({ hour: sH, minute: sM }), wEnd = curr.set({ hour: eH, minute: eM });
    const work = I.fromDateTimes(wStart, wEnd).intersection(search);

    if (work?.isValid) {
      let free = [work];
      busy.forEach(b => free = free.flatMap(f => f.difference(b)));
      free.forEach(f => {
        let t = f.start;
        while (t.plus({ minutes: dur }) <= f.end) {
          slots.push({ start: t.toISO(), end: (t = t.plus({ minutes: dur })).toISO() });
        }
      });
    }
    curr = curr.plus({ days: 1 });
  }
  return slots;
};
export default findAvailableSlots;