export const findAvailableSlots = async (calA, calB, { durationMinutes: dur, searchRange: range, workHours: work }) => {
  const { formatISO, addMinutes } = await import('https://esm.sh/date-fns@3.6.0');
  const toMs = (d) => new Date(d).getTime();
  const slotMs = dur * 6e4;
  const limit = toMs(range.end);
  
  const parseTime = t => t.split(':').reduce((h, m) => h * 60 + +m, 0);
  const [wStart, wEnd] = [work.start, work.end].map(parseTime);

  const busy = [...calA, ...calB]
    .map(x => ({ s: toMs(x.start), e: toMs(x.end) }))
    .sort((a, b) => a.s - b.s)
    .reduce((a, c) => {
      const l = a.at(-1);
      (l && c.s <= l.e) ? l.e = Math.max(l.e, c.e) : a.push(c);
      return a;
    }, []);

  let now = toMs(range.start);
  let bIdx = 0;
  const res = [];

  while (now + slotMs <= limit) {
    const d = new Date(now);
    const dayBase = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    const [dayStart, dayEnd] = [dayBase + wStart * 6e4, dayBase + wEnd * 6e4];

    if (now < dayStart) {
      now = dayStart;
      continue;
    }
    if (now + slotMs > dayEnd) {
      now = dayStart + 864e5;
      continue;
    }

    while (busy[bIdx] && busy[bIdx].e <= now) bIdx++;
    const b = busy[bIdx];

    if (b && b.s < now + slotMs) {
      now = b.e;
    } else {
      res.push({ start: formatISO(now), end: formatISO(addMinutes(now, dur)) });
      now += slotMs;
    }
  }

  return res;
};
export default findAvailableSlots;