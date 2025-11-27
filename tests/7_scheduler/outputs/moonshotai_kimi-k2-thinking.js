export async function findAvailableSlots(cal1, cal2, { durationMinutes, searchRange, workHours }) {
  const { parseISO, compareAsc, addMinutes } = await import('https://cdn.skypack.dev/date-fns');
  
  const s = parseISO(searchRange.start);
  const e = parseISO(searchRange.end);
  
  const [whS, whE] = [workHours.start, workHours.end].map(t => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  });
  
  const inWH = (d, de) => {
    const g = t => t.getUTCHours() * 60 + t.getUTCMinutes();
    return g(d) >= whS && g(de) <= whE;
  };
  
  const busy = [...cal1, ...cal2]
    .map(({ start, end }) => ({ s: parseISO(start), e: parseISO(end) }))
    .filter(({ s: bs, e: be }) => compareAsc(be, s) > 0 && compareAsc(bs, e) < 0)
    .map(({ s: bs, e: be }) => ({
      s: compareAsc(bs, s) < 0 ? s : bs,
      e: compareAsc(be, e) > 0 ? e : be
    }))
    .sort((a, b) => compareAsc(a.s, b.s));
  
  const merged = [];
  for (const { s: bs, e: be } of busy) {
    const last = merged[merged.length - 1];
    if (!last || compareAsc(bs, last.e) >= 0) merged.push({ s: bs, e: be });
    else if (compareAsc(be, last.e) > 0) last.e = be;
  }
  
  const free = [];
  let cur = s;
  for (const { s: ms, e: me } of merged) {
    if (compareAsc(cur, ms) < 0) free.push({ s: cur, e: ms });
    cur = compareAsc(me, cur) > 0 ? me : cur;
  }
  if (compareAsc(cur, e) < 0) free.push({ s: cur, e });
  
  const slots = [];
  for (const { s: fs, e: fe } of free) {
    let cs = fs;
    while (true) {
      const ce = addMinutes(cs, durationMinutes);
      if (compareAsc(ce, fe) > 0) break;
      if (inWH(cs, ce)) slots.push({ start: cs.toISOString(), end: ce.toISOString() });
      cs = addMinutes(cs, durationMinutes);
    }
  }
  
  return slots;
}
export default findAvailableSlots;
// Generation time: 289.823s
// Result: PASS