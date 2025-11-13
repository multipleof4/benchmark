const findAvailableSlots = async (cal1, cal2, constraints) => {
  const { default: dayjs } = await import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/+esm');
  const [{ default: utc }, { default: isBetween }] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/utc.js/+esm'),
    import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/isBetween.js/+esm')
  ]);
  
  dayjs.extend(utc);
  dayjs.extend(isBetween);

  const { durationMinutes, searchRange, workHours } = constraints;
  const [whStart, whEnd] = [workHours.start.split(':'), workHours.end.split(':')];
  
  const merged = [...cal1, ...cal2]
    .map(s => ({ start: dayjs(s.start), end: dayjs(s.end) }))
    .sort((a, b) => a.start - b.start);
  
  const busy = merged.reduce((acc, curr) => {
    if (!acc.length || curr.start > acc[acc.length - 1].end) {
      acc.push(curr);
    } else {
      acc[acc.length - 1].end = dayjs.max(acc[acc.length - 1].end, curr.end);
    }
    return acc;
  }, []);

  const slots = [];
  let current = dayjs(searchRange.start);
  const rangeEnd = dayjs(searchRange.end);

  while (current < rangeEnd) {
    const dayStart = current.hour(+whStart[0]).minute(+whStart[1]).second(0);
    const dayEnd = current.hour(+whEnd[0]).minute(+whEnd[1]).second(0);
    
    let slotStart = dayStart < current ? current : dayStart;
    
    for (const b of busy) {
      if (b.end <= slotStart || b.start >= dayEnd) continue;
      
      if (b.start > slotStart) {
        const slotEnd = dayjs.min(b.start, dayEnd);
        let probe = slotStart;
        
        while (probe.add(durationMinutes, 'minute') <= slotEnd) {
          slots.push({
            start: probe.toISOString(),
            end: probe.add(durationMinutes, 'minute').toISOString()
          });
          probe = probe.add(durationMinutes, 'minute');
        }
      }
      slotStart = dayjs.max(slotStart, b.end);
    }
    
    if (slotStart < dayEnd) {
      let probe = slotStart;
      while (probe.add(durationMinutes, 'minute') <= dayEnd) {
        slots.push({
          start: probe.toISOString(),
          end: probe.add(durationMinutes, 'minute').toISOString()
        });
        probe = probe.add(durationMinutes, 'minute');
      }
    }
    
    current = current.add(1, 'day').startOf('day');
  }

  return slots;
};
export default findAvailableSlots;