async function findAvailableSlots(cal1, cal2, constraints) {
  const { DateTime, Interval } = await import('https://esm.sh/luxon@3');
  const busySlots = [...cal1, ...cal2].map(slot => {
    const s = DateTime.fromISO(slot.start, { zone: 'utc' });
    const e = DateTime.fromISO(slot.end, { zone: 'utc' });
    return s.isValid && e.isValid && s < e ? Interval.fromDateTimes(s, e) : null;
  }).filter(Boolean);
  const mergedBusies = Interval.union(busySlots);
  const rangeStart = DateTime.fromISO(constraints.searchRange.start, { zone: 'utc' });
  const rangeEnd = DateTime.fromISO(constraints.searchRange.end, { zone: 'utc' });
  const searchInt = Interval.fromDateTimes(rangeStart, rangeEnd);
  let covered = mergedBusies
    .filter(b => searchInt.overlaps(b))
    .map(b => searchInt.intersection(b))
    .filter(i => i.isValid);
  covered.sort((a, b) => a.start.toMillis() - b.start.toMillis());
  const frees = [];
  let current = rangeStart;
  for (const busy of covered) {
    if (current < busy.start) {
      frees.push(Interval.fromDateTimes(current, busy.start));
    }
    current = DateTime.max(current, busy.end);
  }
  if (current < rangeEnd) {
    frees.push(Interval.fromDateTimes(current, rangeEnd));
  }
  const [wsH, wsM] = constraints.workHours.start.split(':').map(Number);
  const [weH, weM] = constraints.workHours.end.split(':').map(Number);
  const durMin = constraints.durationMinutes;
  let workInts = [];
  let curDay = rangeStart.startOf('day');
  const endDayStart = rangeEnd.startOf('day');
  while (curDay <= endDayStart) {
    const dayWorkS = curDay.set({ hour: wsH, minute: wsM });
    const dayWorkE = curDay.set({ hour: weH, minute: weM });
    if (dayWorkS < dayWorkE) {
      workInts.push(Interval.fromDateTimes(dayWorkS, dayWorkE));
    }
    curDay = curDay.plus({ days: 1 });
  }
  const allowables = [];
  for (const free of frees) {
    for (const work of workInts) {
      const inter = free.intersection(work);
      if (inter.isValid) allowables.push(inter);
    }
  }
  const mergedAllows = Interval.union(allowables);
  const availableSlots = [];
  for (const allow of mergedAllows) {
    let slotStart = allow.start;
    while (allow.contains(slotStart.plus({ minutes: durMin }))) {
      const slotEnd = slotStart.plus({ minutes: durMin });
      availableSlots.push({
        start: slotStart.toISO(),
        end: slotEnd.toISO()
      });
      slotStart = slotEnd;
    }
  }
  return availableSlots;
}
export default findAvailableSlots;