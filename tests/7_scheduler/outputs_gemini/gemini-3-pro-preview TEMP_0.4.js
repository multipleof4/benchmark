const findAvailableSlots = async (calA, calB, { durationMinutes: dur, searchRange: rng, workHours: wh }) => {
  const { DateTime, Interval } = await import('https://esm.sh/luxon');
  const Z = { zone: 'utc' }, P = s => DateTime.fromISO(s, Z);
  const [sH, sM] = wh.start.split(':'), [eH, eM] = wh.end.split(':');
  
  let cur = P(rng.start).startOf('day'), end = P(rng.end), work = [];
  while (cur < end.plus({ days: 1 })) {
    const wS = cur.set({ hour: sH, minute: sM }), wE = cur.set({ hour: eH, minute: eM });
    const i = Interval.fromDateTimes(wS, wE).intersection(Interval.fromDateTimes(P(rng.start), P(rng.end)));
    if (i?.isValid) work.push(i);
    cur = cur.plus({ days: 1 });
  }

  const busy = [...calA, ...calB].map(x => Interval.fromDateTimes(P(x.start), P(x.end)))
    .filter(x => x.isValid).sort((a, b) => a.start - b.start)
    .reduce((a, c) => {
      const l = a[a.length - 1];
      return l && l.end >= c.start ? (a[a.length - 1] = l.union(c), a) : [...a, c];
    }, []);

  return busy.reduce((acc, b) => acc.flatMap(w => w.difference(b)), work)
    .flatMap(i => {
      const r = [];
      let s = i.start;
      while (s.plus({ minutes: dur }) <= i.end) {
        r.push({ start: s.toISO(), end: (s = s.plus({ minutes: dur })).toISO() });
      }
      return r;
    });
};
export default findAvailableSlots;