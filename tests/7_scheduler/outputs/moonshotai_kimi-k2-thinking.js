export async function findAvailableSlots(a, b, { durationMinutes: d, searchRange: r, workHours: h }) {
  const { parseISO, addMinutes, isWithinInterval, compareAsc, startOfDay, setHours, setMinutes } = await import('https://esm.sh/date-fns');
  
  const toDate = (s) => parseISO(s);
  const all = [...a, ...b].map(({ start: s, end: e }) => ({ s: toDate(s), e: toDate(e) }));
  all.sort((a, b) => compareAsc(a.s, b.s));
  
  const busy = [];
  for (const i of all) {
    if (!busy.length || compareAsc(i.s, busy.at(-1).e) > 0) busy.push({ s: i.s, e: i.e });
    else if (compareAsc(i.e, busy.at(-1).e) > 0) busy.at(-1).e = i.e;
  }
  
  const range = { s: toDate(r.start), e: toDate(r.end) };
  const [[sh, sm], [eh, em]] = [h.start, h.end].map(t => t.split(':').map(Number));
  
  const slots = [];
  let cur = range.s;
  
  while (compareAsc(cur, range.e) < 0) {
    const end = addMinutes(cur, d);
    if (compareAsc(end, range.e) > 0) break;
    
    const day = startOfDay(cur);
    const work = { s: setHours(setMinutes(day, sm), sh), e: setHours(setMinutes(day, em), eh) };
    
    const inWork = isWithinInterval(cur, work) && isWithinInterval(end, work);
    const isFree = !busy.some(b => compareAsc(cur, b.e) < 0 && compareAsc(end, b.s) > 0);
    
    if (inWork && isFree) slots.push({ start: cur.toISOString(), end: end.toISOString() });
    
    cur = end;
  }
  
  return slots;
}
export default findAvailableSlots;