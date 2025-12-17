export async function findAvailableSlots(cal1, cal2, { durationMinutes, searchRange, workHours }) {
  const dayjs = (await import('https://cdn.skypack.dev/dayjs')).default;
  const utc = (await import('https://cdn.skypack.dev/dayjs/plugin/utc')).default;
  dayjs.extend(utc);

  const u = (v) => dayjs.utc(v);
  const sR = u(searchRange.start);
  const eR = u(searchRange.end);
  const [sh, sm] = workHours.start.split(':');
  const [eh, em] = workHours.end.split(':');

  let blocked = [...cal1, ...cal2].map((b) => ({
    s: u(b.start),
    e: u(b.end)
  }));

  for (let c = sR.startOf('d'); c <= eR; c = c.add(1, 'd')) {
    blocked.push(
      { s: c, e: c.set('h', sh).set('m', sm) },
      { s: c.set('h', eh).set('m', em), e: c.add(1, 'd') }
    );
  }

  const merged = blocked
    .map((b) => ({
      s: b.s < sR ? sR : b.s,
      e: b.e > eR ? eR : b.e
    }))
    .filter((b) => b.s < b.e)
    .sort((a, b) => a.s - b.s)
    .reduce((acc, b) => {
      const p = acc[acc.length - 1];
      p && b.s <= p.e ? (p.e = b.e > p.e ? b.e : p.e) : acc.push(b);
      return acc;
    }, []);

  const avail = [];
  let cursor = sR;

  [...merged, { s: eR, e: eR }].forEach((b) => {
    while (cursor.add(durationMinutes, 'm') <= b.s) {
      const next = cursor.add(durationMinutes, 'm');
      avail.push({
        start: cursor.toISOString(),
        end: next.toISOString()
      });
      cursor = next;
    }
    if (b.e > cursor) cursor = b.e;
  });

  return avail;
}
export default findAvailableSlots;
// Generation time: 35.904s
// Result: PASS