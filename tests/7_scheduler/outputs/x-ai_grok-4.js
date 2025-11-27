async function findAvailableSlots(c1, c2, con) {
  const {DateTime, Interval} = await import('https://cdn.jsdelivr.net/npm/luxon@3.4.4/+esm');
  const st = DateTime.fromISO(con.searchRange.start, {zone:'utc'});
  const ed = DateTime.fromISO(con.searchRange.end, {zone:'utc'});
  const sr = Interval.fromDateTimes(st, ed);
  let bs = [...c1, ...c2].map(({start, end}) => Interval.fromDateTimes(
    DateTime.fromISO(start, {zone:'utc'}),
    DateTime.fromISO(end, {zone:'utc'})
  ));
  let cur = st.startOf('day');
  const [wh, wm] = con.workHours.start.split(':').map(Number);
  const [eh, em] = con.workHours.end.split(':').map(Number);
  while (cur <= ed) {
    const ws = cur.set({hour: wh, minute: wm});
    const we = cur.set({hour: eh, minute: em});
    if (cur < ws) bs.push(Interval.fromDateTimes(cur, ws));
    const eod = cur.endOf('day');
    if (we < eod) bs.push(Interval.fromDateTimes(we, eod));
    cur = cur.plus({days:1}).startOf('day');
  }
  let mb = Interval.merge(bs).sort((a,b) => a.start.toMillis() - b.start.toMillis());
  let rb = mb.filter(i => i.overlaps(sr));
  let free = [];
  if (rb.length === 0) {
    free.push(sr);
  } else {
    if (sr.start < rb[0].start) free.push(Interval.fromDateTimes(sr.start, rb[0].start));
    for (let i = 0; i < rb.length - 1; i++) {
      free.push(Interval.fromDateTimes(rb[i].end, rb[i + 1].start));
    }
    if (rb[rb.length - 1].end < sr.end) free.push(Interval.fromDateTimes(rb[rb.length - 1].end, sr.end));
  }
  const dur = con.durationMinutes;
  let av = [];
  for (let f of free) {
    let cs = f.start;
    while (true) {
      let ce = cs.plus({minutes: dur});
      if (ce > f.end) break;
      av.push({start: cs.toISO(), end: ce.toISO()});
      cs = ce;
    }
  }
  return av;
}
export default findAvailableSlots;
// Generation time: 201.779s
// Result: PASS