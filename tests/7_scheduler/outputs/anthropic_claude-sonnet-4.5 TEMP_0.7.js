const findAvailableSlots = async (calendar1, calendar2, constraints) => {
  const { parseISO, addMinutes, isWithinInterval, isBefore, isAfter, isEqual } = await import('https://cdn.jsdelivr.net/npm/date-fns@3.0.0/+esm');
  
  const { durationMinutes, searchRange, workHours } = constraints;
  const searchStart = parseISO(searchRange.start);
  const searchEnd = parseISO(searchRange.end);
  
  const parseTime = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };
  
  const workStartMinutes = parseTime(workHours.start);
  const workEndMinutes = parseTime(workHours.end);
  
  const getUTCMinutes = (date) => date.getUTCHours() * 60 + date.getUTCMinutes();
  
  const isInWorkHours = (date) => {
    const minutes = getUTCMinutes(date);
    return minutes >= workStartMinutes && minutes < workEndMinutes;
  };
  
  const setUTCTime = (date, minutes) => {
    const d = new Date(date);
    d.setUTCHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
    return d;
  };
  
  const allBusy = [...calendar1, ...calendar2]
    .map(slot => ({ start: parseISO(slot.start), end: parseISO(slot.end) }))
    .sort((a, b) => a.start - b.start);
  
  const merged = [];
  for (const slot of allBusy) {
    if (merged.length === 0) {
      merged.push({ ...slot });
    } else {
      const last = merged[merged.length - 1];
      if (isBefore(slot.start, last.end) || isEqual(slot.start, last.end)) {
        last.end = isAfter(slot.end, last.end) ? slot.end : last.end;
      } else {
        merged.push({ ...slot });
      }
    }
  }
  
  const freePeriods = [];
  let currentStart = searchStart;
  
  for (const busy of merged) {
    if (isBefore(currentStart, busy.start)) {
      freePeriods.push({ start: currentStart, end: busy.start });
    }
    currentStart = isAfter(busy.end, currentStart) ? busy.end : currentStart;
  }
  
  if (isBefore(currentStart, searchEnd)) {
    freePeriods.push({ start: currentStart, end: searchEnd });
  }
  
  const slots = [];
  
  for (const period of freePeriods) {
    let current = new Date(period.start);
    const periodEnd = period.end;
    
    while (isBefore(current, periodEnd)) {
      const currentDay = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate()));
      const workStart = setUTCTime(currentDay, workStartMinutes);
      const workEnd = setUTCTime(currentDay, workEndMinutes);
      
      let slotStart = isAfter(current, workStart) ? current : workStart;
      
      if (!isBefore(slotStart, workEnd) || !isBefore(slotStart, periodEnd)) {
        const nextDay = new Date(currentDay);
        nextDay.setUTCDate(nextDay.getUTCDate() + 1);
        current = nextDay;
        continue;
      }
      
      const slotEnd = addMinutes(slotStart, durationMinutes);
      
      if ((isInWorkHours(slotStart) && isInWorkHours(new Date(slotEnd.getTime() - 1))) &&
          (isBefore(slotEnd, periodEnd) || isEqual(slotEnd, periodEnd)) &&
          (isBefore(slotEnd, workEnd) || isEqual(slotEnd, workEnd))) {
        slots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString()
        });
        current = slotEnd;
      } else {
        const nextDay = new Date(currentDay);
        nextDay.setUTCDate(nextDay.getUTCDate() + 1);
        current = nextDay;
      }
    }
  }
  
  return slots;
};
export default findAvailableSlots;
// Generation time: 14.710s
// Result: PASS