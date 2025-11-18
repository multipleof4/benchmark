const findAvailableSlots = async (calA, calB, { durationMinutes: dm, searchRange: sr, workHours: wh }) => {
  const { addMinutes } = await import('https://cdn.jsdelivr.net/npm/date-fns@2.30.0/esm/index.js');
  const T = d => new Date(d).getTime(), I = d => new Date(d).toISOString();

  let busy = [...calA, ...calB]
    .map(x => ({ s: T(x.start), e: T(x.end) }))
    .sort((a, b) => a.s - b.s)
    .reduce((acc, c) => {
      const l = acc[acc.length - 1];
      (l && c.s <= l.e) ? l.e = Math.max(l.e, c.e) : acc.push(c);
      return acc;
    }, []);

  const slots = [], [sh, sm] = wh.start.split(':'), [eh, em] = wh.end.split(':');
  let cur = new Date(sr.start); cur.setHours(0, 0, 0, 0);

  while (T(cur) <= T(sr.end)) {
    const wS = new Date(cur); wS.setHours(sh, sm, 0, 0);
    const wE = new Date(cur); wE.setHours(eh, em, 0, 0);
    const winS = Math.max(T(wS), T(sr.start)), winE = Math.min(T(wE), T(sr.end));

    if (winS < winE) {
      let ptr = winS;
      const dBusy = busy.filter(b => b.s < winE && b.e > winS);

      for (const b of dBusy) {
        if (ptr < b.s) {
          while (T(addMinutes(ptr, dm)) <= b.s) {
            const nxt = addMinutes(ptr, dm);
            slots.push({ start: I(ptr), end: I(nxt) });
            ptr = T(nxt);
          }
        }
        ptr = Math.max(ptr, b.e);
      }

      while (T(addMinutes(ptr, dm)) <= winE) {
        const nxt = addMinutes(ptr, dm);
        slots.push({ start: I(ptr), end: I(nxt) });
        ptr = T(nxt);
      }
    }
    cur = addMinutes(cur, 1440);
  }

  return slots;
};
export default findAvailableSlots;