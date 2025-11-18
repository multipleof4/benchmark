const findAvailableSlots = async (calendar1, calendar2, constraints) => {
  const { startOfDay, addMinutes, parseISO, formatISO } = await import('https://cdn.jsdelivr.net/npm/date-fns@3.0.0/+esm');
  
  const { durationMinutes, searchRange, workHours } = constraints;
  const searchStart = parseISO(searchRange.start);
  const searchEnd = parseISO(searchRange.end);
  
  const [workStartHour, workStartMin] = workHours.start.split(':').map(Number);
  const [workEndHour, workEndMin] = workHours.end.split(':').map(Number);
  const workStartMs = (workStartHour * 60 + workStartMin) * 60000;
  const workEndMs = (workEndHour * 60 + workEndMin) * 60000;
  
  const allBusy = [...calendar1, ...calendar2]
    .map(({ start, end }) => ({ start: parseISO(start), end: parseISO(end) }))
    .sort((a, b) => a.start - b.start);
  
  const merged = [];
  for (const slot of allBusy) {
    if (merged.length && slot.start <= merged[merged.length - 1].end) {
      merged[merged.length - 1].end = new Date(Math.max(merged[merged.length - 1].end, slot.end));
    } else {
      merged.push({ start: slot.start, end: slot.end });
    }
  }
  
  const free = [];
  let current = searchStart;
  for (const busy of merged) {
    if (current < busy.start) {
      free.push({ start: current, end: busy.start });
    }
    current = new Date(Math.max(current, busy.end));
  }
  if (current < searchEnd) {
    free.push({ start: current, end: searchEnd });
  }
  
  const slots = [];
  for (const period of free) {
    let slotStart = period.start;
    
    while (slotStart < period.end) {
      const dayStart = startOfDay(slotStart);
      const slotStartMs = slotStart - dayStart;
      const slotEnd = addMinutes(slotStart, durationMinutes);
      const slotEndMs = slotEnd - dayStart;
      
      if (slotEnd > period.end) break;
      
      const endsNextDay = slotEnd - startOfDay(slotEnd) < slotEndMs % 86400000;
      
      if (!endsNextDay && 
          slotStartMs >= workStartMs && 
          slotEndMs <= workEndMs &&
          slotStart >= searchStart &&
          slotEnd <= searchEnd) {
        slots.push({
          start: formatISO(slotStart),
          end: formatISO(slotEnd)
        });
      }
      
      slotStart = slotEnd;
    }
  }
  
  return slots;
};
export default findAvailableSlots;