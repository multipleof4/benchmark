const findAvailableSlots = async (cal1, cal2, constraints) => {
  const { DateTime, Interval } = await import('https://cdn.skypack.dev/luxon');
  
  const { durationMinutes: dur, searchRange: range, workHours: wh } = constraints;
  const [rangeStart, rangeEnd] = [DateTime.fromISO(range.start), DateTime.fromISO(range.end)];
  const [whStart, whEnd] = wh.start.split(':').map(Number);
  const [whStartMin, whEndMin] = [whStart * 60 + (wh.start.split(':')[1] || 0), 
                                    whEnd.split(':').map(Number).reduce((h, m) => h * 60 + m)];
  
  const mergeIntervals = (intervals) => {
    if (!intervals.length) return [];
    const sorted = intervals.sort((a, b) => a.start - b.start);
    const merged = [sorted[0]];
    for (let i = 1; i < sorted.length; i++) {
      const last = merged[merged.length - 1];
      if (sorted[i].start <= last.end) {
        last.end = last.end > sorted[i].end ? last.end : sorted[i].end;
      } else {
        merged.push(sorted[i]);
      }
    }
    return merged;
  };
  
  const toBusy = (cal) => cal.map(({ start, end }) => ({
    start: DateTime.fromISO(start),
    end: DateTime.fromISO(end)
  }));
  
  const allBusy = mergeIntervals([...toBusy(cal1), ...toBusy(cal2)]);
  
  const isWorkHour = (dt) => {
    const min = dt.hour * 60 + dt.minute;
    return min >= whStartMin && min < whEndMin;
  };
  
  const slots = [];
  let cursor = rangeStart;
  
  while (cursor < rangeEnd) {
    if (!isWorkHour(cursor)) {
      cursor = cursor.plus({ minutes: 1 });
      continue;
    }
    
    const slotEnd = cursor.plus({ minutes: dur });
    
    if (slotEnd > rangeEnd) break;
    
    let validSlot = true;
    let tempCursor = cursor;
    while (tempCursor < slotEnd) {
      if (!isWorkHour(tempCursor)) {
        validSlot = false;
        break;
      }
      tempCursor = tempCursor.plus({ minutes: 1 });
    }
    
    if (!validSlot) {
      cursor = cursor.plus({ minutes: 1 });
      continue;
    }
    
    const overlaps = allBusy.some(busy => 
      (cursor >= busy.start && cursor < busy.end) || 
      (slotEnd > busy.start && slotEnd <= busy.end) ||
      (cursor <= busy.start && slotEnd >= busy.end)
    );
    
    if (!overlaps) {
      slots.push({
        start: cursor.toISO(),
        end: slotEnd.toISO()
      });
      cursor = slotEnd;
    } else {
      const nextBusy = allBusy.find(b => b.end > cursor && b.start <= cursor);
      cursor = nextBusy ? nextBusy.end : cursor.plus({ minutes: 1 });
    }
  }
  
  return slots;
};
export default findAvailableSlots;