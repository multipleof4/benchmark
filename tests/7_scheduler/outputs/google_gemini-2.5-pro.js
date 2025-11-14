const findAvailableSlots = async (calendar1, calendar2, constraints) => {
  const [{ default: dayjs }, { default: utc }] = await Promise.all([
    import('https://cdn.skypack.dev/dayjs'),
    import('https://cdn.skypack.dev/dayjs/plugin/utc.js'),
  ]);
  dayjs.extend(utc);

  const { durationMinutes, searchRange, workHours } = constraints;
  
  const toDayjs = (t) => dayjs.utc(t);
  const toDayjsRange = ({ start, end }) => ({ start: toDayjs(start), end: toDayjs(end) });

  const search = toDayjsRange(searchRange);
  const allBusy = [...calendar1, ...calendar2]
    .map(toDayjsRange)
    .sort((a, b) => a.start.valueOf() - b.start.valueOf());

  const mergedBusy = allBusy.reduce((acc, current) => {
    const last = acc[acc.length - 1];
    if (last && current.start.valueOf() < last.end.valueOf()) {
      if (current.end.isAfter(last.end)) {
        last.end = current.end;
      }
    } else {
      acc.push({ ...current });
    }
    return acc;
  }, []);

  const boundaryPoints = [
    search.start,
    ...mergedBusy.flatMap(b => [b.start, b.end]),
    search.end,
  ];

  const freeGaps = [];
  for (let i = 0; i < boundaryPoints.length - 1; i += 2) {
    const start = boundaryPoints[i];
    const end = boundaryPoints[i + 1];
    if (end.isAfter(start)) {
      freeGaps.push({ start, end });
    }
  }

  const availableSlots = [];
  const [workStartH, workStartM] = workHours.start.split(':').map(Number);
  const [workEndH, workEndM] = workHours.end.split(':').map(Number);

  for (const gap of freeGaps) {
    let cursor = gap.start.startOf('day');
    while (cursor.isBefore(gap.end)) {
      const workWindowStart = cursor.hour(workStartH).minute(workStartM);
      const workWindowEnd = cursor.hour(workEndH).minute(workEndM);

      let effectiveStart = dayjs.max(gap.start, workWindowStart);
      const effectiveEnd = dayjs.min(gap.end, workWindowEnd);

      while (effectiveStart.add(durationMinutes, 'minute').valueOf() <= effectiveEnd.valueOf()) {
        const slotEnd = effectiveStart.add(durationMinutes, 'minute');
        availableSlots.push({ start: effectiveStart, end: slotEnd });
        effectiveStart = slotEnd;
      }
      cursor = cursor.add(1, 'day');
    }
  }

  return availableSlots.map(({ start, end }) => ({
    start: start.toISOString(),
    end: end.toISOString(),
  }));
};
export default findAvailableSlots;