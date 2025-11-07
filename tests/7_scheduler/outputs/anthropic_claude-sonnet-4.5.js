const findAvailableSlots = async (cal1, cal2, constraints) => {
  const { DateTime, Interval } = await import('https://cdn.skypack.dev/luxon');
  
  const { durationMinutes: dur, searchRange: sr, workHours: wh } = constraints;
  const [srStart, srEnd] = [DateTime.fromISO(sr.start), DateTime.fromISO(sr.end)];
  const [whStart, whEnd] = wh.start.split(':').map(Number);
  
  const toInterval = ({ start, end }) => 
    Interval.fromDateTimes(DateTime.fromISO(start), DateTime.fromISO(end));
  
  const busySlots = [...cal1, ...cal2]
    .map(toInterval)
    .sort((a, b) => a.start - b.start);
  
  const merged = busySlots.reduce((acc, curr) => {
    if (!acc.length) return [curr];
    const last = acc[acc.length - 1];
    return last.overlaps(curr) || last.abutsStart(curr)
      ? [...acc.slice(0, -1), last.union(curr)]
      : [...acc, curr];
  }, []);
  
  const isWorkHours = dt => {
    const h = dt.hour, m = dt.minute;
    const mins = h * 60 + m;
    const whStartMins = whStart[0] * 60 + whStart[1];
    const whEndMins = whEnd[0] * 60 + whEnd[1];
    return mins >= whStartMins && mins < whEndMins;
  };
  
  const slots = [];
  let curr = srStart;
  
  while (curr < srEnd) {
    const dayStart = curr.set({ hour: whStart[0], minute: whStart[1], second: 0 });
    const dayEnd = curr.set({ hour: whEnd[0], minute: whEnd[1], second: 0 });
    
    if (dayStart >= srEnd) break;
    
    const effectiveStart = dayStart > srStart ? dayStart : srStart;
    const effectiveEnd = dayEnd < srEnd ? dayEnd : srEnd;
    
    let pointer = effectiveStart;
    
    while (pointer.plus({ minutes: dur }) <= effectiveEnd) {
      const slotEnd = pointer.plus({ minutes: dur });
      const slotInterval = Interval.fromDateTimes(pointer, slotEnd);
      
      const isFree = !merged.some(busy => 
        busy.overlaps(slotInterval) || slotInterval.overlaps(busy)
      );
      
      if (isFree && isWorkHours(pointer) && isWorkHours(slotEnd.minus({ minutes: 1 }))) {
        slots.push({
          start: pointer.toISO(),
          end: slotEnd.toISO()
        });
        pointer = slotEnd;
      } else {
        const nextBusy = merged.find(busy => busy.start > pointer);
        if (nextBusy && nextBusy.start < effectiveEnd) {
          pointer = nextBusy.end > pointer ? nextBusy.end : pointer.plus({ minutes: 1 });
        } else {
          pointer = pointer.plus({ minutes: 1 });
        }
      }
    }
    
    curr = curr.plus({ days: 1 }).startOf('day');
  }
  
  return slots;
};
export default findAvailableSlots;