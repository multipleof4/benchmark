const findAvailableSlots = async (calendarA, calendarB, constraints) => {
  const { default: d } = await import('https://esm.sh/dayjs@1.11.10');
  const { default: u } = await import('https://esm.sh/dayjs@1.11.10/plugin/utc');
  d.extend(u);

  const D = d.utc;
  const ms = constraints.durationMinutes * 60000;
  const rangeS = D(constraints.searchRange.start);
  const rangeE = D(constraints.searchRange.end);
  const [wS_H, wS_M] = constraints.workHours.start.split(':').map(Number);
  const [wE_H, wE_M] = constraints.workHours.end.split(':').map(Number);

  const busy = [...calendarA, ...calendarB]
    .map(x => ({ s: D(x.start).valueOf(), e: D(x.end).valueOf() }))
    .sort((a, b) => a.s - b.s)
    .reduce((acc, c) => {
      const l = acc[acc.length - 1];
      if (l && c.s < l.e) l.e = Math.max(l.e, c.e);
      else acc.push(c);
      return acc;
    }, []);

  const slots = [];
  let curr = rangeS.startOf('day');
  const endDay = rangeE.endOf('day');

  while (curr.isBefore(endDay)) {
    let sTime = curr.hour(wS_H).minute(wS_M).second(0).millisecond(0);
    let eTime = curr.hour(wE_H).minute(wE_M).second(0).millisecond(0);

    const sVal = Math.max(sTime.valueOf(), rangeS.valueOf());
    const eVal = Math.min(eTime.valueOf(), rangeE.valueOf());

    let ptr = sVal;
    while (ptr + ms <= eVal) {
      const conflict = busy.find(b => b.s < ptr + ms && b.e > ptr);
      if (conflict) {
        ptr = conflict.e;
      } else {
        slots.push({ start: D(ptr).format(), end: D(ptr + ms).format() });
        ptr += ms;
      }
    }
    curr = curr.add(1, 'day');
  }

  return slots;
};
export default findAvailableSlots;