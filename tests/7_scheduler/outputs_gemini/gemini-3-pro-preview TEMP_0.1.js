const findAvailableSlots = async (calA, calB, { durationMinutes: dur, searchRange: rng, workHours: wh }) => {
  const [djs, utc] = await Promise.all([
    import('https://esm.sh/dayjs@1.11.10'),
    import('https://esm.sh/dayjs@1.11.10/plugin/utc')
  ]).then(m => m.map(i => i.default));

  djs.extend(utc);
  const U = (d) => djs(d).utc();
  const [wsH, wsM] = wh.start.split(':').map(Number);
  const [weH, weM] = wh.end.split(':').map(Number);
  
  const busy = [...calA, ...calB]
    .map(s => ({ s: U(s.start), e: U(s.end) }))
    .sort((a, b) => a.s - b.s)
    .reduce((acc, c) => {
      const last = acc[acc.length - 1];
      if (last && c.s.diff(last.e) < 0) last.e = c.e.diff(last.e) > 0 ? c.e : last.e;
      else acc.push(c);
      return acc;
    }, []);

  const slots = [];
  let curDay = U(rng.start).startOf('day');
  const limit = U(rng.end);

  while (curDay.isBefore(limit)) {
    let wStart = curDay.hour(wsH).minute(wsM);
    let wEnd = curDay.hour(weH).minute(weM);

    if (wStart.isBefore(U(rng.start))) wStart = U(rng.start);
    if (wEnd.isAfter(limit)) wEnd = limit;

    let ptr = wStart;
    while (ptr.add(dur, 'm').diff(wEnd) <= 0) {
      const next = ptr.add(dur, 'm');
      const clash = busy.find(b => ptr.isBefore(b.e) && next.isAfter(b.s));
      
      if (clash) ptr = clash.e;
      else {
        slots.push({ start: ptr.format(), end: next.format() });
        ptr = next;
      }
    }
    curDay = curDay.add(1, 'day');
  }
  return slots;
};
export default findAvailableSlots;