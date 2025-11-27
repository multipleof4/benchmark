const findAvailableSlots = async (calA, calB, { durationMinutes, searchRange, workHours }) => {
  const { addMinutes, parseISO, formatISO } = await import('https://esm.sh/date-fns@2.30.0');

  const getMins = (t) => { const [h, m] = t.split(':'); return (+h * 60) + +m; };
  const [workStart, workEnd] = [workHours.start, workHours.end].map(getMins);
  const rangeEnd = parseISO(searchRange.end).getTime();
  
  const busy = [...calA, ...calB]
    .map(s => ({ s: parseISO(s.start).getTime(), e: parseISO(s.end).getTime() }))
    .sort((a, b) => a.s - b.s)
    .reduce((acc, c) => {
      const last = acc[acc.length - 1];
      if (last && c.s <= last.e) last.e = Math.max(last.e, c.e);
      else acc.push(c);
      return acc;
    }, []);

  let current = parseISO(searchRange.start).getTime();
  const slots = [];

  while (current + durationMinutes * 60000 <= rangeEnd) {
    const d = new Date(current);
    const curMins = d.getUTCHours() * 60 + d.getUTCMinutes();

    if (curMins >= workEnd) {
      d.setUTCDate(d.getUTCDate() + 1);
      d.setUTCHours(0, 0, 0, 0);
      current = addMinutes(d, workStart).getTime();
      continue;
    }

    if (curMins < workStart) {
      d.setUTCHours(0, 0, 0, 0);
      current = addMinutes(d, workStart).getTime();
      continue;
    }

    const end = addMinutes(current, durationMinutes).getTime();
    const endD = new Date(end);
    const endMins = endD.getUTCHours() * 60 + endD.getUTCMinutes();

    if (end > rangeEnd) break;

    if (endD.getUTCDate() !== d.getUTCDate() || endMins > workEnd) {
      d.setUTCDate(d.getUTCDate() + 1);
      d.setUTCHours(0, 0, 0, 0);
      current = addMinutes(d, workStart).getTime();
      continue;
    }

    const conflict = busy.find(b => current < b.e && end > b.s);
    
    if (conflict) {
      current = conflict.e;
    } else {
      slots.push({ start: formatISO(current), end: formatISO(end) });
      current = end;
    }
  }

  return slots;
};
export default findAvailableSlots;
// Generation time: 47.831s
// Result: PASS