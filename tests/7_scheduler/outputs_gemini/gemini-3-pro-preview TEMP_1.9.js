export const findAvailableSlots = async (cal1, cal2, { durationMinutes, searchRange, workHours }) => {
    const { parseISO } = await import('https://cdn.jsdelivr.net/npm/date-fns@3.6.0/+esm');
    const toMs = (d) => parseISO(d).getTime();
    const toIso = (ms) => new Date(ms).toISOString();
    const rangeStart = toMs(searchRange.start);
    const rangeEnd = toMs(searchRange.end);
    const durMs = durationMinutes * 60000;

    // Merge and Sort Busy Intervals
    const busy = [...cal1, ...cal2]
        .map(({ start, end }) => ({ s: toMs(start), e: toMs(end) }))
        .sort((a, b) => a.s - b.s)
        .reduce((acc, cur) => {
            const last = acc[acc.length - 1];
            if (last && cur.s < last.e) last.e = Math.max(last.e, cur.e);
            else acc.push(cur);
            return acc;
        }, []);

    const slots = [];
    // Iterate strictly by days in UTC to determine work hours
    const cursor = new Date(rangeStart);
    cursor.setUTCHours(0, 0, 0, 0);

    while (cursor.getTime() < rangeEnd) {
        const dateIso = cursor.toISOString().slice(0, 10);
        // Determine available window for this day
        const workStart = Date.parse(`${dateIso}T${workHours.start}:00Z`);
        const workEnd = Date.parse(`${dateIso}T${workHours.end}:00Z`);
        const wStart = Math.max(rangeStart, workStart);
        const wEnd = Math.min(rangeEnd, workEnd);

        if (wStart < wEnd) {
            let ptr = wStart;
            // Subtract busy times from the day's window
            for (const b of busy) {
                if (b.e <= ptr) continue;
                if (b.s >= wEnd) break;

                // Generate slots in the free interval [ptr, b.s]
                while (ptr + durMs <= b.s) {
                    slots.push({ start: toIso(ptr), end: toIso(ptr += durMs) });
                }
                ptr = Math.max(ptr, b.e);
                if (ptr >= wEnd) break;
            }
            // Fill remaining time in the day
            while (ptr + durMs <= wEnd) {
                slots.push({ start: toIso(ptr), end: toIso(ptr += durMs) });
            }
        }
        cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    return slots;
};
export default findAvailableSlots;