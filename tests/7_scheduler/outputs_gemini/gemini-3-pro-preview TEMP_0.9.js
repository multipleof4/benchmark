const findAvailableSlots = async (calA, calB, { durationMinutes, searchRange, workHours }) => {
    const { parseISO, formatISO, addMinutes } = await import('https://cdn.jsdelivr.net/npm/date-fns@3.6.0/+esm');

    const rangeStart = parseISO(searchRange.start).getTime();
    const rangeEnd = parseISO(searchRange.end).getTime();
    const durationMs = durationMinutes * 60 * 1000;

    const busy = [...calA, ...calB]
        .map(s => ({ start: parseISO(s.start).getTime(), end: parseISO(s.end).getTime() }))
        .sort((a, b) => a.start - b.start);

    const merged = [];
    if (busy.length) {
        let curr = busy[0];
        for (const next of busy.slice(1)) {
            if (curr.end >= next.start) {
                curr.end = Math.max(curr.end, next.end);
            } else {
                merged.push(curr);
                curr = next;
            }
        }
        merged.push(curr);
    }

    const slots = [];
    let now = rangeStart;

    while (now + durationMs <= rangeEnd) {
        const currentDate = new Date(now);
        const dateStr = currentDate.toISOString().split('T')[0];
        const workStart = parseISO(`${dateStr}T${workHours.start}:00Z`).getTime();
        const workEnd = parseISO(`${dateStr}T${workHours.end}:00Z`).getTime();

        if (now < workStart) {
            now = workStart;
            continue;
        }

        if (now + durationMs > workEnd) {
            now = addMinutes(workStart, 24 * 60).getTime();
            continue;
        }

        const conflict = merged.find(b => now < b.end && (now + durationMs) > b.start);

        if (conflict) {
            now = conflict.end;
        } else {
            const start = new Date(now);
            const end = new Date(now + durationMs);
            slots.push({ start: formatISO(start), end: formatISO(end) });
            now += durationMs;
        }
    }

    return slots;
};
export default findAvailableSlots;