const findAvailableSlots = async (cal1, cal2, constraints) => {
  const { default: dayjs } = await import('https://cdn.skypack.dev/dayjs@1.11.10');
  const { default: utc } = await import('https://cdn.skypack.dev/dayjs@1.11.10/plugin/utc');
  const { default: customParseFormat } = await import('https://cdn.skypack.dev/dayjs@1.11.10/plugin/customParseFormat');
  
  dayjs.extend(utc);
  dayjs.extend(customParseFormat);

  const { durationMinutes, searchRange, workHours } = constraints;
  const duration = durationMinutes * 60000;
  
  const merged = [...cal1, ...cal2]
    .map(({ start, end }) => ({ start: new Date(start).getTime(), end: new Date(end).getTime() }))
    .sort((a, b) => a.start - b.start);

  const busy = merged.reduce((acc, slot) => {
    if (!acc.length) return [slot];
    const last = acc[acc.length - 1];
    if (slot.start <= last.end) {
      last.end = Math.max(last.end, slot.end);
      return acc;
    }
    acc.push(slot);
    return acc;
  }, []);

  const rangeStart = new Date(searchRange.start).getTime();
  const rangeEnd = new Date(searchRange.end).getTime();
  const [whStart, whEnd] = [workHours.start, workHours.end];

  const isWithinWorkHours = (ts) => {
    const d = dayjs(ts);
    const time = d.format('HH:mm');
    return time >= whStart && time <= whEnd;
  };

  const getWorkDayBounds = (ts) => {
    const d = dayjs(ts);
    const [h1, m1] = whStart.split(':').map(Number);
    const [h2, m2] = whEnd.split(':').map(Number);
    return {
      start: d.hour(h1).minute(m1).second(0).millisecond(0).valueOf(),
      end: d.hour(h2).minute(m2).second(0).millisecond(0).valueOf()
    };
  };

  const slots = [];
  let current = rangeStart;

  for (let ts = rangeStart; ts < rangeEnd; ts += 86400000) {
    const { start: dayStart, end: dayEnd } = getWorkDayBounds(ts);
    current = Math.max(current, dayStart);

    busy.forEach(({ start: bStart, end: bEnd }) => {
      if (bStart > current && bStart <= dayEnd) {
        let slotStart = current;
        while (slotStart + duration <= Math.min(bStart, dayEnd)) {
          const slotEnd = slotStart + duration;
          if (isWithinWorkHours(slotStart) && isWithinWorkHours(slotEnd)) {
            slots.push({
              start: new Date(slotStart).toISOString(),
              end: new Date(slotEnd).toISOString()
            });
          }
          slotStart = slotEnd;
        }
        current = Math.max(current, bEnd);
      }
      if (bEnd > current && bEnd <= dayEnd) {
        current = Math.max(current, bEnd);
      }
    });

    if (current < dayEnd) {
      let slotStart = current;
      while (slotStart + duration <= dayEnd) {
        const slotEnd = slotStart + duration;
        if (isWithinWorkHours(slotStart) && isWithinWorkHours(slotEnd)) {
          slots.push({
            start: new Date(slotStart).toISOString(),
            end: new Date(slotEnd).toISOString()
          });
        }
        slotStart = slotEnd;
      }
    }
    
    current = dayStart + 86400000;
  }

  return slots;
};
export default findAvailableSlots;