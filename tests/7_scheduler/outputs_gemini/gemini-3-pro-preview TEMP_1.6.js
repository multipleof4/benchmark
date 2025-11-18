export const findAvailableSlots = async (cal1, cal2, { durationMinutes: dur, searchRange: range, workHours: wh }) => {
    const { parseISO, addMinutes } = await import('https://cdn.jsdelivr.net/npm/date-fns@3.3.1/+esm');

    const toTime = (d) => parseISO(d).getTime();
    const rStart = toTime(range.start);
    const rEnd = toTime(range.end);
    
    const [wStart, wEnd] = [wh.start, wh.end].map(t => t.split(':').reduce((h, m) => h * 60 + +m, 0));
    const getMins = (d) => d.getUTCHours() * 60 + d.getUTCMinutes();

    const busy = [...cal1, ...cal2]
        .map(x => ({ s: Math.max(rStart, toTime(x.start)), e: Math.min(rEnd, toTime(x.end)) }))
        .filter(x => x.s < x.e)
        .sort((a, b) => a.s - b.s);

    const merged = [];
    if (busy.length) {
        let curr = busy[0];
        for (const b of busy) {
            if (b.s <= curr.e) curr.e = Math.max(curr.e, b.e);
            else { merged.push(curr); curr = b; }
        }
        merged.push(curr);
    }

    const slots = [];
    let cursor = rStart;
    const blocks = [...merged, { s: rEnd, e: rEnd }];

    for (const b of blocks) {
        while (cursor + dur * 60000 <= b.s) {
            const start = new Date(cursor);
            const end = addMinutes(start, dur);
            
            if (start.getUTCDay() === end.getUTCDay()) {
                const sM = getMins(start);
                const eM = getMins(end);
                if (sM >= wStart && eM <= wEnd) {
                    slots.push({ start: start.toISOString(), end: end.toISOString() });
                }
            }
            cursor = end.getTime();
        }
        cursor = Math.max(cursor, b.e);
    }

    return slots;
};
export default findAvailableSlots;