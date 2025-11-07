const findAvailableSlots = async (cal1, cal2, constraints) => {
  const { default: dayjs } = await import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/+esm');
  const [{ default: utc }, { default: customParseFormat }, { default: isBetween }] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/utc.js'),
    import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/customParseFormat.js'),
    import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/isBetween.js')
  ]);
  
  dayjs.extend(utc);
  dayjs.extend(customParseFormat);
  dayjs.extend(isBetween);

  const { durationMinutes, searchRange, workHours } = constraints;
  const duration = durationMinutes;
  
  const mergedBusy = [...cal1, ...cal2]
    .map(({ start, end }) => ({ start: dayjs(start), end: dayjs(end) }))
    .sort((a, b) => a.start - b.start)
    .reduce((acc, curr) => {
      if (!acc.length) return [curr];
      const last = acc[acc.length - 1];
      if (curr.start <= last.end) {
        last.end = dayjs.max(last.end, curr.end);
        return acc;
      }
      return [...acc, curr];
    }, []);

  const searchStart = dayjs(searchRange.start);
  const searchEnd = dayjs(searchRange.end);
  const [workStart, workEnd] = [workHours.start, workHours.end];
  
  const slots = [];
  let current = searchStart;

  while (current < searchEnd) {
    const dayStart = dayjs(`${current.format('YYYY-MM-DD')}T${workStart}`);
    const dayEnd = dayjs(`${current.format('YYYY-MM-DD')}T${workEnd}`);
    
    const workStart_ = dayjs.max(current, dayStart);
    const workEnd_ = dayjs.min(searchEnd, dayEnd);

    if (workStart_ < workEnd_) {
      const dayBusy = mergedBusy.filter(b => 
        b.start < workEnd_ && b.end > workStart_
      );

      let pointer = workStart_;
      
      for (const busy of dayBusy) {
        const gapEnd = dayjs.min(busy.start, workEnd_);
        
        while (pointer.add(duration, 'minute') <= gapEnd) {
          slots.push({
            start: pointer.toISOString(),
            end: pointer.add(duration, 'minute').toISOString()
          });
          pointer = pointer.add(duration, 'minute');
        }
        
        pointer = dayjs.max(pointer, busy.end);
      }

      while (pointer.add(duration, 'minute') <= workEnd_) {
        slots.push({
          start: pointer.toISOString(),
          end: pointer.add(duration, 'minute').toISOString()
        });
        pointer = pointer.add(duration, 'minute');
      }
    }

    current = current.add(1, 'day').startOf('day');
  }

  return slots;
};
export default findAvailableSlots;