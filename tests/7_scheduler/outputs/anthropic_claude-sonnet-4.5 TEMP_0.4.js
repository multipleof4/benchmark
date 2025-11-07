const findAvailableSlots = async (cal1, cal2, constraints) => {
  const { default: dayjs } = await import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/+esm');
  const [{ default: utc }, { default: customParseFormat }, { default: isBetween }] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/utc.js/+esm'),
    import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/customParseFormat.js/+esm'),
    import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/isBetween.js/+esm')
  ]);
  
  dayjs.extend(utc);
  dayjs.extend(customParseFormat);
  dayjs.extend(isBetween);

  const { durationMinutes, searchRange, workHours } = constraints;
  const [whStart, whEnd] = [workHours.start.split(':'), workHours.end.split(':')];
  
  const allBusy = [...cal1, ...cal2]
    .map(({ start, end }) => ({ start: dayjs(start), end: dayjs(end) }))
    .sort((a, b) => a.start - b.start);

  const merged = allBusy.reduce((acc, curr) => {
    if (!acc.length || acc[acc.length - 1].end < curr.start) {
      acc.push(curr);
    } else {
      acc[acc.length - 1].end = dayjs.max(acc[acc.length - 1].end, curr.end);
    }
    return acc;
  }, []);

  const slots = [];
  let current = dayjs(searchRange.start);
  const searchEnd = dayjs(searchRange.end);

  while (current < searchEnd) {
    const dayStart = current.hour(+whStart[0]).minute(+whStart[1]).second(0);
    const dayEnd = current.hour(+whEnd[0]).minute(+whEnd[1]).second(0);
    
    let pointer = dayStart > current ? dayStart : current;
    
    for (const busy of merged) {
      if (busy.start >= dayEnd) break;
      if (busy.end <= pointer) continue;
      
      while (pointer.add(durationMinutes, 'minute') <= dayjs.min(busy.start, dayEnd)) {
        const slotEnd = pointer.add(durationMinutes, 'minute');
        if (pointer >= dayStart && slotEnd <= dayEnd && pointer >= dayjs(searchRange.start)) {
          slots.push({
            start: pointer.toISOString(),
            end: slotEnd.toISOString()
          });
        }
        pointer = pointer.add(durationMinutes, 'minute');
      }
      pointer = dayjs.max(pointer, busy.end);
    }
    
    while (pointer.add(durationMinutes, 'minute') <= dayEnd) {
      const slotEnd = pointer.add(durationMinutes, 'minute');
      if (pointer >= dayStart && slotEnd <= searchEnd) {
        slots.push({
          start: pointer.toISOString(),
          end: slotEnd.toISOString()
        });
      }
      pointer = pointer.add(durationMinutes, 'minute');
    }
    
    current = current.add(1, 'day').startOf('day');
  }

  return slots;
};
export default findAvailableSlots;