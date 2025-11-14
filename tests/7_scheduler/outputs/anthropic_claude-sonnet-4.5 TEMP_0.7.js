async function findAvailableSlots(cal1, cal2, constraints) {
  const { parse, format, addMinutes, isWithinInterval, isBefore, isAfter, startOfDay, setHours, setMinutes } = await import('https://cdn.jsdelivr.net/npm/date-fns@3.0.0/+esm');
  
  const { durationMinutes, searchRange, workHours } = constraints;
  const duration = durationMinutes;
  
  const parseTime = (dateStr) => parse(dateStr, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", new Date());
  const toISO = (date) => format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
  
  const rangeStart = parseTime(searchRange.start);
  const rangeEnd = parseTime(searchRange.end);
  
  const [whStart, whEnd] = workHours.start.split(':').map(Number);
  const [whEndH, whEndM] = workHours.end.split(':').map(Number);
  
  const allBusy = [...cal1, ...cal2].map(slot => ({
    start: parseTime(slot.start),
    end: parseTime(slot.end)
  })).sort((a, b) => a.start - b.start);
  
  const merged = [];
  for (const slot of allBusy) {
    if (!merged.length || isBefore(merged[merged.length - 1].end, slot.start)) {
      merged.push({ ...slot });
    } else {
      merged[merged.length - 1].end = isAfter(slot.end, merged[merged.length - 1].end) 
        ? slot.end 
        : merged[merged.length - 1].end;
    }
  }
  
  const freePeriods = [];
  let current = rangeStart;
  
  for (const busy of merged) {
    if (isBefore(current, busy.start)) {
      freePeriods.push({ start: current, end: busy.start });
    }
    current = isAfter(busy.end, current) ? busy.end : current;
  }
  
  if (isBefore(current, rangeEnd)) {
    freePeriods.push({ start: current, end: rangeEnd });
  }
  
  const isInWorkHours = (date) => {
    const day = startOfDay(date);
    const workStart = setMinutes(setHours(day, whStart), whEnd > 0 ? 0 : 0);
    const workEnd = setMinutes(setHours(day, whEndH), whEndM);
    return isWithinInterval(date, { start: workStart, end: workEnd });
  };
  
  const slots = [];
  
  for (const period of freePeriods) {
    let slotStart = period.start;
    
    while (true) {
      const slotEnd = addMinutes(slotStart, duration);
      
      if (isAfter(slotEnd, period.end)) break;
      
      if (isInWorkHours(slotStart) && isInWorkHours(slotEnd)) {
        const day1 = startOfDay(slotStart);
        const day2 = startOfDay(slotEnd);
        
        if (day1.getTime() === day2.getTime()) {
          slots.push({
            start: toISO(slotStart),
            end: toISO(slotEnd)
          });
        }
      }
      
      slotStart = slotEnd;
    }
  }
  
  return slots;
}
export default findAvailableSlots;