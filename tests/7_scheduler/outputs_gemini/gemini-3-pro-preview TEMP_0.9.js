const findAvailableSlots = async (calA, calB, { durationMinutes, searchRange, workHours }) => {
    const { DateTime, Interval } = await import('https://cdn.jsdelivr.net/npm/luxon@3/+esm');
    const z = { zone: 'utc' };
    const parse = t => DateTime.fromISO(t, z);
    const range = Interval.fromDateTimes(parse(searchRange.start), parse(searchRange.end));
    const [wsH, wsM] = workHours.start.split(':');
    const [weH, weM] = workHours.end.split(':');

    const busy = [...calA, ...calB]
        .map(s => Interval.fromDateTimes(parse(s.start), parse(s.end)))
        .filter(i => i.isValid)
        .sort((a, b) => a.start - b.start)
        .reduce((acc, cur) => {
            const last = acc[acc.length - 1];
            return last && last.end >= cur.start ? (acc[acc.length - 1] = last.union(cur), acc) : [...acc, cur];
        }, []);

    const slots = [];
    for (const free of range.difference(...busy)) {
        let cur = free.start;
        while (cur < free.end) {
            const next = cur.plus({ minutes: durationMinutes });
            if (next > free.end) break;
            const ws = cur.set({ hour: wsH, minute: wsM, second: 0, millisecond: 0 });
            const we = cur.set({ hour: weH, minute: weM, second: 0, millisecond: 0 });
            if (cur >= ws && next <= we) slots.push({ start: cur.toISO(), end: next.toISO() });
            cur = next;
        }
    }
    return slots;
};
export default findAvailableSlots;