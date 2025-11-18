export const findAvailableSlots = async (calA, calB, { durationMinutes: dur, searchRange: range, workHours: wh }) => {
  const { default: d } = await import('https://esm.sh/dayjs@1.11.10');
  const { default: u } = await import('https://esm.sh/dayjs@1.11.10/plugin/utc');
  d.extend(u);

  const D = t => d.utc(t);
  const rS = D(range.start), rE = D(range.end);
  const setT = (dt, t) => {
    const [h, m] = t.split(':');
    return dt.hour(h).minute(m).second(0).millisecond(0);
  };

  // 1. Merge and Sort Busy Slots
  let busy = [...calA, ...calB]
    .map(x => ({ s: D(x.start), e: D(x.end) }))
    .filter(x => x.e > rS && x.s < rE)
    .sort((a, b) => a.s - b.s);

  let merged = [], curr = busy[0];
  if (curr) {
    for (let i = 1; i < busy.length; i++) {
      if (busy[i].s < curr.e) curr.e = busy[i].e > curr.e ? busy[i].e : curr.e;
      else { merged.push(curr); curr = busy[i]; }
    }
    merged.push(curr);
  }

  // 2. Identify Free Gaps within Search Range
  let gaps = [], ptr = rS;
  for (const b of merged) {
    if (b.s > ptr) gaps.push({ s: ptr, e: b.s });
    ptr = b.e > ptr ? b.e : ptr;
  }
  if (ptr < rE) gaps.push({ s: ptr, e: rE });

  // 3. Generate Slots intersecting Work Hours
  const slots = [];
  for (const g of gaps) {
    let day = g.s.clone().startOf('day');
    const endDay = g.e.clone().endOf('day');

    while (day <= endDay) {
      const wS = setT(day, wh.start), wE = setT(day, wh.end);
      // Intersection of Gap and Work Hours
      const start = g.s > wS ? g.s : wS;
      const end = g.e < wE ? g.e : wE;

      if (start < end) {
        let s = start;
        while (s.add(dur, 'm') <= end) {
          slots.push({ start: s.toISOString(), end: s.add(dur, 'm').toISOString() });
          s = s.add(dur, 'm');
        }
      }
      day = day.add(1, 'd');
    }
  }

  return slots;
};
export default findAvailableSlots;