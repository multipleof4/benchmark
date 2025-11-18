const findAvailableSlots = async (cal1, cal2, constraints) => {
  const { default: dayjs } = await import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/+esm');
  const { default: isBetween } = await import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/isBetween.js/+esm');
  const { default: customParseFormat } = await import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/customParseFormat.js/+esm');
  
  dayjs.extend(isBetween);
  dayjs.extend(customParseFormat);

  const { durationMinutes, searchRange, workHours } = constraints;
  const searchStart = dayjs(searchRange.start);
  const searchEnd = dayjs(searchRange.end);

  const allBusy = [...cal1, ...cal2]
    .map(({ start, end }) => ({ start: dayjs(start), end: dayjs(end) }))
    .sort((a, b) => a.start.valueOf() - b.start.valueOf());

  const merged = [];
  for (const slot of allBusy) {
    if (!merged.length || merged[merged.length - 1].end.isBefore(slot.start)) {
      merged.push({ start: slot.start, end: slot.end });
    } else {
      merged[merged.length - 1].end = dayjs.max(merged[merged.length - 1].end, slot.end);
    }
  }

  const freePeriods = [];
  let current = searchStart;
  
  for (const busy of merged) {
    if (current.isBefore(busy.start)) {
      freePeriods.push({ start: current, end: busy.start });
    }
    current = dayjs.max(current, busy.end);
  }
  
  if (current.isBefore(searchEnd)) {
    freePeriods.push({ start: current, end: searchEnd });
  }

  const isWithinWorkHours = (slotStart, slotEnd) => {
    const date = slotStart.format('YYYY-MM-DD');
    const workStart = dayjs(`${date} ${workHours.start}`, 'YYYY-MM-DD HH:mm');
    const workEnd = dayjs(`${date} ${workHours.end}`, 'YYYY-MM-DD HH:mm');
    
    return !slotStart.isBefore(workStart) && !slotEnd.isAfter(workEnd);
  };

  const slots = [];
  
  for (const period of freePeriods) {
    let slotStart = period.start;
    
    while (slotStart.add(durationMinutes, 'minute').isSameOrBefore(period.end)) {
      const slotEnd = slotStart.add(durationMinutes, 'minute');
      
      if (isWithinWorkHours(slotStart, slotEnd) &&
          !slotStart.isBefore(searchStart) &&
          !slotEnd.isAfter(searchEnd)) {
        slots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString()
        });
      }
      
      slotStart = slotEnd;
    }
  }

  return slots;
};
export default findAvailableSlots;