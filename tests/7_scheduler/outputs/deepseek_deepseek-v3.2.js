const findAvailableSlots = async (calendar1, calendar2, constraints) => {
    const { DateTime, Interval } = await import('https://cdn.jsdelivr.net/npm/luxon@3.4.4/+esm');
    
    const parse = s => DateTime.fromISO(s, { zone: 'utc' });
    const workStart = constraints.workHours.start;
    const workEnd = constraints.workHours.end;
    const rangeStart = parse(constraints.searchRange.start);
    const rangeEnd = parse(constraints.searchRange.end);
    const duration = constraints.durationMinutes;
    
    const allBusy = [...calendar1, ...calendar2]
        .map(b => Interval.fromDateTimes(parse(b.start), parse(b.end)))
        .sort((a, b) => a.s - b.s);
    
    const merged = [];
    allBusy.forEach(busy => {
        const last = merged[merged.length - 1];
        last && last.overlaps(busy) || last?.abutsStart(busy) ? 
            merged[merged.length - 1] = last.union(busy) : merged.push(busy);
    });
    
    const free = [];
    let current = rangeStart;
    merged.forEach(busy => {
        if (current < busy.s) free.push(Interval.fromDateTimes(current, busy.s));
        current = busy.e > current ? busy.e : current;
    });
    if (current < rangeEnd) free.push(Interval.fromDateTimes(current, rangeEnd));
    
    const slots = [];
    free.forEach(interval => {
        let slotStart = interval.s;
        const workStartToday = slotStart.set({ hour: workStart.slice(0, 2), minute: workStart.slice(3), second: 0, millisecond: 0 });
        const workEndToday = slotStart.set({ hour: workEnd.slice(0, 2), minute: workEnd.slice(3), second: 0, millisecond: 0 });
        const workInterval = Interval.fromDateTimes(workStartToday, workEndToday);
        const available = interval.intersection(workInterval);
        
        if (available) {
            let start = available.s > slotStart ? available.s : slotStart;
            while (start.plus({ minutes: duration }) <= available.e && start.plus({ minutes: duration }) <= rangeEnd) {
                const end = start.plus({ minutes: duration });
                slots.push({ start: start.toISO(), end: end.toISO() });
                start = end;
            }
        }
    });
    
    return slots;
};
export default findAvailableSlots;
// Generation time: 19.693s
// Result: PASS