async function findAvailableSlots(cal1, cal2, {durationMinutes, searchRange, workHours}) {
  const {luxon: {DateTime, Interval}} = await import('https://cdn.skypack.dev/luxon');
  
  const workStart = DateTime.fromFormat(workHours.start, 'HH:mm');
  const workEnd = DateTime.fromFormat(workHours.end, 'HH:mm');
  const searchStart = DateTime.fromISO(searchRange.start);
  const searchEnd = DateTime.fromISO(searchRange.end);
  const duration = Duration.fromObject({minutes: durationMinutes});
  
  const parseCal = cal => cal.map(s => ({
    start: DateTime.fromISO(s.start),
    end: DateTime.fromISO(s.end)
  })).filter(s => s.start < s.end);
  
  const mergeOverlaps = slots => slots
    .sort((a,b) => a.start - b.end)
    .reduce((merged, curr) => {
      const last = merged[merged.length - 1];
      if (!last || last.end < curr.start) return [...merged, curr];
      last.end = Math.max(last.end, curr.end);
      return merged;
    }, []);
  
  const allBusy = mergeOverlaps([...parseCal(cal1), ...parseCal(cal2)]);
  const freePeriods = [
    {start: searchStart, end: allBusy[0]?.start || searchEnd},
    ...allBusy.flatMap((b,i) => 
      i < allBusy.length - 1 && b.end < allBusy[i+1].start
        ? [{start: b.end, end: allBusy[i+1].start}]
        : []
    ),
    ...(allBusy.at(-1)?.end && allBusy.at(-1).end < searchEnd 
      ? [{start: allBusy.at(-1).end, end: searchEnd}]
      : [])
  ].filter(p => p.start < p.end);
  
  const slots = [];
  for (const period of freePeriods) {
    const int = Interval.fromDateTimes(period.start, period.end);
    let curr = int.start;
    
    while (curr.plus(duration) <= int.end) {
      const slotStart = curr;
      const slotEnd = curr.plus(duration);
      
      const dayStart = slotStart.set({hour: workStart.hour, minute: workStart.minute, second: 0, millisecond: 0});
      const dayEnd = slotStart.set({hour: workEnd.hour, minute: workEnd.minute, second: 0, millisecond: 0});
      
      if (Interval.fromDateTimes(slotStart, slotEnd).containedBy(
        Interval.fromDateTimes(
          Math.max(slotStart, dayStart), 
          Math.min(slotEnd, dayEnd)
        )
      )) {
        slots.push({
          start: slotStart.toISO(),
          end: slotEnd.toISO()
        });
      }
      
      curr = slotEnd;
    }
  }
  
  return slots;
}
export default findAvailableSlots;