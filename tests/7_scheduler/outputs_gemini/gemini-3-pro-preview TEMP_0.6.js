const findAvailableSlots = async (calA, calB, { durationMinutes: dur, searchRange: rng, workHours: wh }) => {
  const { parseISO, addMinutes } = await import('https://cdn.jsdelivr.net/npm/date-fns@2.30.0/+esm');
  const [startR, endR] = [parseISO(rng.start), parseISO(rng.end)];

  const busy = [...calA, ...calB]
    .map(x => ({ s: parseISO(x.start), e: parseISO(x.end) }))
    .sort((a, b) => a.s - b.s)
    .reduce((acc, c) => {
      const last = acc[acc.length - 1];
      if (last && c.s < last.e) last.e = new Date(Math.max(last.e, c.e));
      else acc.push(c);
      return acc;
    }, []);

  const slots = [];
  let currDate = new Date(Date.UTC(startR.getUTCFullYear(), startR.getUTCMonth(), startR.getUTCDate()));
  const lastDate = new Date(Date.UTC(endR.getUTCFullYear(), endR.getUTCMonth(), endR.getUTCDate()));

  while (currDate <= lastDate) {
    const dStr = currDate.toISOString().split('T')[0];
    const wStart = parseISO(`${dStr}T${wh.start}:00Z`);
    const wEnd = parseISO(`${dStr}T${wh.end}:00Z`);

    const winStart = wStart < startR ? startR : wStart;
    const winEnd = wEnd > endR ? endR : wEnd;

    if (winStart < winEnd) {
      let cursor = winStart;
      const relevant = busy.filter(b => b.s < winEnd && b.e > winStart);

      for (const b of relevant) {
        while (addMinutes(cursor, dur) <= b.s) {
          const next = addMinutes(cursor, dur);
          slots.push({ start: cursor.toISOString(), end: next.toISOString() });
          cursor = next;
        }
        if (cursor < b.e) cursor = b.e;
      }

      while (addMinutes(cursor, dur) <= winEnd) {
        const next = addMinutes(cursor, dur);
        slots.push({ start: cursor.toISOString(), end: next.toISOString() });
        cursor = next;
      }
    }
    currDate.setUTCDate(currDate.getUTCDate() + 1);
  }

  return slots;
};
export default findAvailableSlots;