export const findAvailableSlots = async (cal1, cal2, { durationMinutes: dur, searchRange: rng, workHours: wh }) => {
  const [djs, utc] = await Promise.all([
    import('https://esm.sh/dayjs@1.11.10'),
    import('https://esm.sh/dayjs@1.11.10/plugin/utc')
  ]);
  const dayjs = djs.default;
  dayjs.extend(utc.default);

  const parse = d => dayjs(d).utc();
  const [wsH, wsM] = wh.start.split(':').map(Number);
  const [weH, weM] = wh.end.split(':').map(Number);
  
  let now = parse(rng.start);
  const endLimit = parse(rng.end);
  const slots = [];

  const busy = [...cal1, ...cal2]
    .map(s => ({ s: parse(s.start), e: parse(s.end) }))
    .sort((a, b) => a.s - b.s)
    .reduce((acc, c) => {
      const last = acc.at(-1);
      if (last && c.s <= last.e) last.e = c.e > last.e ? c.e : last.e;
      else acc.push(c);
      return acc;
    }, []);

  while (now.add(dur, 'm') <= endLimit) {
    const wStart = now.hour(wsH).minute(wsM).second(0).millisecond(0);
    const wEnd = now.hour(weH).minute(weM).second(0).millisecond(0);

    if (now < wStart) now = wStart;
    
    const next = now.add(dur, 'm');

    if (next > wEnd) {
      now = wStart.add(1, 'd');
      continue;
    }
    if (next > endLimit) break;

    const clash = busy.find(b => now < b.e && next > b.s);
    
    if (clash) {
      now = clash.e;
    } else {
      slots.push({ start: now.toISOString(), end: next.toISOString() });
      now = next;
    }
  }

  return slots;
};
export default findAvailableSlots;