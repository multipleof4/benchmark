async function findAvailableSlots(
  calendar1,
  calendar2,
  { durationMinutes: dur, searchRange: sr, workHours: wh }
) {
  const dayjs = (await import('https://cdn.skypack.dev/dayjs')).default;
  const utc = (await import('https://cdn.skypack.dev/dayjs/plugin/utc')).default;
  dayjs.extend(utc);

  const d = (s) => dayjs.utc(s);
  const rangeStart = d(sr.start);
  const rangeEnd = d(sr.end);
  const [whsH, whsM] = wh.start.split(':');
  const [wheH, wheM] = wh.end.split(':');

  const busySlots = [...calendar1, ...calendar2].map(({ start, end }) => ({
    start: d(start),
    end: d(end),
  }));

  for (let day = rangeStart.clone().startOf('d'); day.isBefore(rangeEnd); day = day.add(1, 'd')) {
    busySlots.push({ start: day.startOf('d'), end: day.hour(whsH).minute(whsM) });
    busySlots.push({ start: day.hour(wheH).minute(wheM), end: day.endOf('d') });
  }

  const merged = busySlots
    .filter(({ start, end }) => start.isBefore(end))
    .sort((a, b) => a.start - b.start)
    .reduce((acc, cur) => {
      const last = acc.at(-1);
      if (!last || cur.start.isAfter(last.end)) {
        acc.push(cur);
      } else if (cur.end.isAfter(last.end)) {
        last.end = cur.end;
      }
      return acc;
    }, []);

  const available = [];
  let cursor = rangeStart;

  [...merged, { start: rangeEnd, end: rangeEnd }].forEach((busy) => {
    const gapEnd = busy.start;
    for (let slotStart = cursor; !slotStart.add(dur, 'm').isAfter(gapEnd); slotStart = slotStart.add(dur, 'm')) {
      const slotEnd = slotStart.add(dur, 'm');
      available.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
      });
    }
    cursor = cursor.isAfter(busy.end) ? cursor : busy.end;
  });

  return available;
}
export default findAvailableSlots;