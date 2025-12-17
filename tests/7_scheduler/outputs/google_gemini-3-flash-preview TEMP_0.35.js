export async function findAvailableSlots(cal1, cal2, { durationMinutes: dur, searchRange: range, workHours: work }) {
  const { default: dayjs } = await import('https://cdn.skypack.dev/dayjs');
  const { default: utc } = await import('https://cdn.skypack.dev/dayjs/plugin/utc');
  dayjs.extend(utc);

  const setTime = (date, timeStr) => {
    const [h, m] = timeStr.split(':');
    return date.utc().set('h', h).set('m', m).set('s', 0).set('ms', 0);
  };

  const busy = [...cal1, ...cal2]
    .map(b => ({ s: dayjs.utc(b.start), e: dayjs.utc(b.end) }))
    .sort((a, b) => a.s - b.s)
    .reduce((acc, cur) => {
      const last = acc[acc.length - 1];
      last && cur.s <= last.e ? (last.e = cur.e > last.e ? cur.e : last.e) : acc.push(cur);
      return acc;
    }, []);

  const slots = [];
  let curr = dayjs.utc(range.start);
  const limit = dayjs.utc(range.end);

  while (curr.add(dur, 'm') <= limit) {
    const start = curr;
    const end = curr.add(dur, 'm');
    const workStart = setTime(start, work.start);
    const workEnd = setTime(start, work.end);

    if (start < workStart) {
      curr = workStart;
      continue;
    }

    if (end > workEnd) {
      curr = setTime(start.add(1, 'd'), work.start);
      continue;
    }

    const conflict = busy.find(b => start < b.e && end > b.s);
    if (conflict) {
      curr = conflict.e;
      continue;
    }

    slots.push({
      start: start.toISOString(),
      end: end.toISOString()
    });
    curr = end;
  }

  return slots;
}
export default findAvailableSlots;
// Generation time: 41.040s
// Result: PASS