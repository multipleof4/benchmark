export const findAvailableSlots = async (calendarA, calendarB, { durationMinutes, searchRange, workHours }) => {
  const { default: dayjs } = await import('https://esm.sh/dayjs');
  const { default: utc } = await import('https://esm.sh/dayjs/plugin/utc');
  dayjs.extend(utc);

  const parse = (d) => dayjs.utc(d);
  const msDuration = durationMinutes * 60000;
  const rangeStart = parse(searchRange.start);
  const rangeEnd = parse(searchRange.end);

  let busy = [...calendarA, ...calendarB]
    .map(s => ({ s: parse(s.start).valueOf(), e: parse(s.end).valueOf() }))
    .sort((a, b) => a.s - b.s)
    .reduce((acc, curr) => {
      const last = acc[acc.length - 1];
      if (last && curr.s < last.e) last.e = Math.max(last.e, curr.e);
      else acc.push(curr);
      return acc;
    }, []);

  const slots = [];
  let currentDay = rangeStart.startOf('day');
  const finalDay = rangeEnd.endOf('day');

  while (currentDay.isBefore(finalDay) || currentDay.isSame(finalDay)) {
    const dateStr = currentDay.format('YYYY-MM-DD');
    let start = parse(`${dateStr}T${workHours.start}`);
    let end = parse(`${dateStr}T${workHours.end}`);

    if (start.isBefore(rangeStart)) start = rangeStart;
    if (end.isAfter(rangeEnd)) end = rangeEnd;

    let ptr = start.valueOf();
    const limit = end.valueOf();

    while (ptr + msDuration <= limit) {
      const slotEnd = ptr + msDuration;
      const conflict = busy.find(b => b.s < slotEnd && b.e > ptr);

      if (conflict) {
        ptr = conflict.e;
      } else {
        slots.push({
          start: dayjs(ptr).utc().format(),
          end: dayjs(slotEnd).utc().format()
        });
        ptr += msDuration;
      }
    }
    currentDay = currentDay.add(1, 'day');
  }

  return slots;
};
export default findAvailableSlots;