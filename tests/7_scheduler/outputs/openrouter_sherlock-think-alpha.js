async function findAvailableSlots(cal1, cal2, constraints) {
  const { DateTime, Interval } = await import('https://cdn.skypack.dev/luxon');
  const { durationMinutes, searchRange, workHours } = constraints;
  const searchStart = DateTime.fromISO(searchRange.start);
  const searchEnd = DateTime.fromISO(searchRange.end);
  const searchInterval = Interval.fromDateTimes(searchStart, searchEnd);
  const zone = searchStart.zone;
  const workStart = DateTime.fromFormat(workHours.start, 'HH:mm', { zone });
  const workEnd = DateTime.fromFormat(workHours.end, 'HH:mm', { zone });
  let busies = [];
  for (const slot of [...cal1, ...cal2]) {
    const iv = Interval.fromISO(`${slot.start}/${slot.end}`);
    const i = iv.intersection(searchInterval);
    if (i?.isValid) busies.push(i);
  }
  let nonWork = [];
  let currentDay = searchStart.startOf('day');
  const endDay = searchEnd.endOf('day');
  while (currentDay <= endDay) {
    const dayStart = currentDay;
    const dayEnd = currentDay.plus({ days: 1 });
    const wStart = dayStart.set({ hour: workStart.hour, minute: workStart.minute, second: 0, millisecond: 0 });
    const wEnd = dayStart.set({ hour: workEnd.hour, minute: workEnd.minute, second: 0, millisecond: 0 });
    const blocks = [];
    if (dayStart < wStart) blocks.push(Interval.fromDateTimes(dayStart, wStart));
    if (wEnd < dayEnd) blocks.push(Interval.fromDateTimes(wEnd, dayEnd));
    for (const b of blocks) {
      const i = b.intersection(searchInterval);
      if (i?.isValid) nonWork.push(i);
    }
    currentDay = currentDay.plus({ days: 1 });
  }
  let allBlocked = [...busies, ...nonWork].sort((a, b) => a.start.valueOf() - b.start.valueOf());
  const mergedBlocked = [];
  for (const iv of allBlocked) {
    const last = mergedBlocked.at(-1);
    if (!last || !last.overlaps(iv)) {
      mergedBlocked.push(iv);
    } else {
      mergedBlocked[mergedBlocked.length - 1] = last.union(iv);
    }
  }
  const freePeriods = [];
  if (mergedBlocked.length === 0) {
    freePeriods.push(searchInterval);
  } else {
    if (searchStart < mergedBlocked[0].start) {
      freePeriods.push(Interval.fromDateTimes(searchStart, mergedBlocked[0].start));
    }
    for (let i = 0; i < mergedBlocked.length - 1; i++) {
      const gapStart = mergedBlocked[i].end;
      const gapEnd = mergedBlocked[i + 1].start;
      if (gapStart < gapEnd) {
        freePeriods.push(Interval.fromDateTimes(gapStart, gapEnd));
      }
    }
    if (mergedBlocked.at(-1).end < searchEnd) {
      freePeriods.push(Interval.fromDateTimes(mergedBlocked.at(-1).end, searchEnd));
    }
  }
  const availableSlots = [];
  for (const freeIv of freePeriods) {
    if (freeIv.length('milliseconds') < durationMinutes * 60 * 1000) continue;
    let current = freeIv.start;
    while (true) {
      const slotEnd = current.plus({ minutes: durationMinutes });
      if (slotEnd > freeIv.end) break;
      availableSlots.push({
        start: current.toISO(),
        end: slotEnd.toISO()
      });
      current = slotEnd;
    }
  }
  return availableSlots;
}
export default findAvailableSlots;