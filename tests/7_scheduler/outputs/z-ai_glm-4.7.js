async function findAvailableSlots(cal1, cal2, constraints) {
  const { DateTime, Duration } = await import('https://cdn.skypack.dev/luxon');
  
  const toDT = (s) => DateTime.fromISO(s, { zone: 'utc' });
  const dur = Duration.fromObject({ minutes: constraints.durationMinutes });
  const rS = toDT(constraints.searchRange.start);
  const rE = toDT(constraints.searchRange.end);

  const busy = [...cal1, ...cal2]
    .map(b => ({ s: toDT(b.start), e: toDT(b.end) }))
    .sort((a, b) => a.s - b.s)
    .reduce((a, b) => {
      const p = a[a.length - 1];
      if (p && b.s <= p.e) {
        p.e = b.e > p.e ? b.e : p.e;
      } else {
        a.push(b);
      }
      return a;
    }, []);

  const slots = [];
  let cur = rS.startOf('day');

  while (cur < rE) {
    const iso = cur.toISODate();
    const wS = toDT(`${iso}T${constraints.workHours.start}`);
    const wE = toDT(`${iso}T${constraints.workHours.end}`);
    
    const s = wS < rS ? rS : wS;
    const e = wE > rE ? rE : wE;

    if (s < e) {
      let t = s;
      for (const b of busy) {
        if (b.e <= t) continue;
        if (b.s >= e) break;

        if (b.s > t) {
          while (t.plus(dur) <= b.s) {
            slots.push({ start: t.toISO(), end: t.plus(dur).toISO() });
            t = t.plus(dur);
          }
        }
        t = b.e > t ? b.e : t;
        if (t >= e) break;
      }

      while (t.plus(dur) <= e) {
        slots.push({ start: t.toISO(), end: t.plus(dur).toISO() });
        t = t.plus(dur);
      }
    }
    cur = cur.plus({ days: 1 });
  }

  return slots;
}
export default findAvailableSlots;
// Generation time: 208.769s
// Result: PASS