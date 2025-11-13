const findAvailableSlots = async (a, b, o) => {
  const { parseISO, formatISO, addDays, startOfDay } = await import('https://cdn.skypack.dev/date-fns@2.30.0');
  const dur = o.durationMinutes * 6e4;
  const rng = [parseISO(o.searchRange.start), parseISO(o.searchRange.end)];
  const split = t => t.split(':').map(Number);
  const hrs = { s: split(o.workHours.start), e: split(o.workHours.end) };
  const busy = [...a, ...b]
    .map(v => ({ start: parseISO(v.start), end: parseISO(v.end) }))
    .map(v => {
      const s = new Date(Math.max(v.start, rng[0]));
      const e = new Date(Math.min(v.end, rng[1]));
      return s < e ? { start: s, end: e } : null;
    })
    .filter(Boolean)
    .sort((x, y) => x.start - y.start)
    .reduce((m, v) => {
      const last = m[m.length - 1];
      if (!last || v.start > last.end) m.push({ start: new Date(v.start), end: new Date(v.end) });
      else if (v.end > last.end) last.end = new Date(v.end);
      return m;
    }, []);
  const slots = [];
  const collect = (s, e) => {
    let a = s.getTime(), b = e.getTime();
    while (a + dur <= b) {
      const r = a + dur;
      slots.push({ start: formatISO(new Date(a)), end: formatISO(new Date(r)) });
      a = r;
    }
  };
  let idx = 0;
  for (let d = startOfDay(rng[0]); d <= rng[1]; d = addDays(d, 1)) {
    const ws = new Date(d);
    ws.setHours(hrs.s[0], hrs.s[1], 0, 0);
    const we = new Date(d);
    we.setHours(hrs.e[0], hrs.e[1], 0, 0);
    const winStart = new Date(Math.max(ws, rng[0]));
    const winEnd = new Date(Math.min(we, rng[1]));
    if (winStart >= winEnd) continue;
    let cursor = winStart;
    while (idx < busy.length && busy[idx].end <= winStart) idx++;
    let view = idx;
    let done = false;
    while (view < busy.length && busy[view].start < winEnd) {
      const gapEnd = new Date(Math.min(busy[view].start, winEnd));
      if (gapEnd > cursor) collect(cursor, gapEnd);
      cursor = new Date(Math.max(cursor, busy[view].end));
      if (cursor >= winEnd) {
        done = true;
        break;
      }
      view++;
    }
    if (!done && cursor < winEnd) collect(cursor, winEnd);
    idx = view;
  }
  return slots;
};
export default findAvailableSlots;