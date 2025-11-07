async function findAvailableSlots(calendar1, calendar2, constraints) {
  const [dayjsModule, durationModule] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js'),
    import('https://cdn.jsdelivr.net/npm/dayjs@1/plugin/duration.js')
  ]);
  const dayjs = dayjsModule.default;
  dayjs.extend(durationModule.default);

  const { durationMinutes: duration, searchRange, workHours } = constraints;
  const searchStart = dayjs(searchRange.start);
  const searchEnd = dayjs(searchRange.end);
  const [workStartH, workStartM] = workHours.start.split(':').map(Number);
  const [workEndH, workEndM] = workHours.end.split(':').map(Number);

  const toDayjs = ({ start, end }) => ({ start: dayjs(start), end: dayjs(end) });
  const allBusy = [...calendar1, ...calendar2].map(toDayjs);

  for (let day = searchStart.clone().startOf('day'); day.isBefore(searchEnd); day = day.add(1, 'day')) {
    allBusy.push({
      start: day,
      end: day.hour(workStartH).minute(workStartM)
    });
    allBusy.push({
      start: day.hour(workEndH).minute(workEndM),
      end: day.endOf('day')
    });
  }

  const mergedBusy = allBusy
    .sort((a, b) => a.start - b.start)
    .reduce((acc, slot) => {
      const last = acc.at(-1);
      if (last && slot.start <= last.end) {
        if (slot.end > last.end) last.end = slot.end;
      } else {
        acc.push({ ...slot });
      }
      return acc;
    }, []);

  const availableSlots = [];
  let nextFreeStart = searchStart;

  const findSlotsInGap = (start, end) => {
    let slotStart = start;
    while (slotStart.add(duration, 'minute') <= end) {
      const slotEnd = slotStart.add(duration, 'minute');
      availableSlots.push({ start: slotStart.toISOString(), end: slotEnd.toISOString() });
      slotStart = slotEnd;
    }
  };

  mergedBusy.forEach(busySlot => {
    if (busySlot.start > nextFreeStart) {
      findSlotsInGap(nextFreeStart, busySlot.start);
    }
    if (busySlot.end > nextFreeStart) {
      nextFreeStart = busySlot.end;
    }
  });

  if (searchEnd > nextFreeStart) {
    findSlotsInGap(nextFreeStart, searchEnd);
  }

  return availableSlots;
}
export default findAvailableSlots;