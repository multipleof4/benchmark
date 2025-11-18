export const findAvailableSlots = async (calA, calB, { durationMinutes: dur, searchRange: range, workHours: work }) => {
    const { addMinutes, parseISO } = await import('https://cdn.jsdelivr.net/npm/date-fns@4.1.0/+esm');
    
    const toTime = d => d.getTime();
    const toISO = d => d.toISOString();

    const startLimit = parseISO(range.start);
    const endLimit = parseISO(range.end);
    
    let busy = [...calA, ...calB]
        .map(c => ({ s: toTime(parseISO(c.start)), e: toTime(parseISO(c.end)) }))
        .sort((a, b) => a.s - b.s)
        .reduce((acc, c) => {
            const last = acc[acc.length - 1];
            if (last && c.s < last.e) last.e = Math.max(last.e, c.e);
            else acc.push(c);
            return acc;
        }, []);

    const slots = [];
    let currDate = new Date(Date.UTC(startLimit.getUTCFullYear(), startLimit.getUTCMonth(), startLimit.getUTCDate()));

    while (toTime(currDate) <= toTime(endLimit)) {
        const dateStr = currDate.toISOString().split('T')[0];
        const workStart = new Date(`${dateStr}T${work.start}:00Z`);
        const workEnd = new Date(`${dateStr}T${work.end}:00Z`);

        let ptr = toTime(workStart) < toTime(startLimit) ? startLimit : workStart;
        const winEnd = toTime(workEnd) > toTime(endLimit) ? endLimit : workEnd;
        const winEndT = toTime(winEnd);

        let bIdx = 0;

        while (toTime(ptr) + (dur * 60000) <= winEndT) {
            const slotEnd = addMinutes(ptr, dur);
            const ptrT = toTime(ptr);
            const slotEndT = toTime(slotEnd);

            // Fast-forward busy index
            while (busy[bIdx] && busy[bIdx].e <= ptrT) bIdx++;
            
            const conflict = busy[bIdx];
            
            if (!conflict || conflict.s >= slotEndT) {
                slots.push({ start: toISO(ptr), end: toISO(slotEnd) });
                ptr = slotEnd;
            } else {
                // Overlap detected, jump to end of busy slot
                // Ensure we reconstruct Date from timestamp correctly
                ptr = new Date(conflict.e);
            }
        }
        currDate.setUTCDate(currDate.getUTCDate() + 1);
    }

    return slots;
};
export default findAvailableSlots;