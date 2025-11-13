const findAvailableSlots = async (cal1, cal2, constraints) => {
  const { default: dayjs } = await import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/+esm');
  const [{ default: utc }, { default: customParseFormat }, { default: isBetween }] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/utc.js'),
    import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/customParseFormat.js'),
    import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/isBetween.js')
  ]);
  
  dayjs.extend(utc);
  dayjs.extend(customParseFormat);
  dayjs.extend(isBetween);

  const { durationMinutes, searchRange, workHours } = constraints;
  const allBusy = [...cal1, ...cal2].map(s => ({
    start: dayjs(s.start),
    end: dayjs(s.end)
  })).sort((a, b) => a.start - b.start);

  const merged = allBusy.reduce((acc, curr) => {
    if (!acc.length || acc[acc.length - 1].end < curr.start) {
      acc.push(curr);
    } else {
      acc[acc.length - 1].end = dayjs.max(acc[acc.length - 1].end, curr.end);
    }
    return acc;
  }, []);

  const slots = [];
  const searchStart = dayjs(searchRange.start);
  const searchEnd = dayjs(searchRange.end);
  const [whStart, whEnd] = [
    dayjs(workHours.start, 'HH:mm'),
    dayjs(workHours.end, 'HH:mm')
  ];

  const isInWorkHours = (dt) => {
    const time = dayjs().hour(dt.hour()).minute(dt.minute());
    return time.isBetween(whStart, whEnd, null, '[)');
  };

  const addSlot = (start, end) => {
    let curr = start;
    while (curr.add(durationMinutes, 'minute') <= end) {
      if (isInWorkHours(curr) && isInWorkHours(curr.add(durationMinutes, 'minute').subtract(1, 'second'))) {
        const slotEnd = curr.add(durationMinutes, 'minute');
        const dayEnd = curr.hour(whEnd.hour()).minute(whEnd.minute());
        if (slotEnd <= dayEnd) {
          slots.push({
            start: curr.toISOString(),
            end: slotEnd.toISOString()
          });
        }
      }
      curr = curr.add(15, 'minute');
    }
  };

  let prevEnd = searchStart.hour(whStart.hour()).minute(whStart.minute());
  if (prevEnd < searchStart) prevEnd = searchStart;

  merged.forEach(busy => {
    if (busy.start > prevEnd) {
      let gapStart = prevEnd;
      let gapEnd = busy.start;
      
      let day = gapStart.startOf('day');
      while (day <= gapEnd) {
        const dayStart = dayjs.max(
          gapStart,
          day.hour(whStart.hour()).minute(whStart.minute())
        );
        const dayEnd = dayjs.min(
          gapEnd,
          day.hour(whEnd.hour()).minute(whEnd.minute())
        );
        
        if (dayStart < dayEnd && dayStart >= searchStart && dayEnd <= searchEnd) {
          addSlot(dayStart, dayEnd);
        }
        day = day.add(1, 'day');
      }
    }
    prevEnd = dayjs.max(prevEnd, busy.end);
  });

  const finalEnd = searchEnd.hour(whEnd.hour()).minute(whEnd.minute());
  if (prevEnd < finalEnd) {
    let day = prevEnd.startOf('day');
    while (day <= finalEnd) {
      const dayStart = dayjs.max(
        prevEnd,
        day.hour(whStart.hour()).minute(whStart.minute())
      );
      const dayEnd = dayjs.min(
        finalEnd,
        day.hour(whEnd.hour()).minute(whEnd.minute())
      );
      
      if (dayStart < dayEnd && dayStart >= searchStart && dayEnd <= searchEnd) {
        addSlot(dayStart, dayEnd);
      }
      day = day.add(1, 'day');
    }
  }

  return slots;
};
export default findAvailableSlots;