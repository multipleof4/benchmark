const findAvailableSlots = async (cal1, cal2, { durationMinutes: dur, searchRange: range, workHours: work }) => {
    const { parseISO } = await import('https://cdn.jsdelivr.net/npm/date-fns@3.6.0/+esm');
    
    const toMs = (d) => parseISO(d).getTime();
    const [wsH, wsM] = work.start.split(':').map(Number);
    const [weH, weM] = work.end.split(':').map(Number);
    const rangeStart = toMs(range.start);
    const rangeEnd = toMs(range.end);
    const durMs = dur * 60000;

    const busy = [...cal1, ...cal2]
        .map(x => ({ s: toMs(x.start), e: toMs(x.end) }))
        .sort((a, b) => a.s - b.s);

    const merged = [];
    for (const b of busy) {
        const last = merged[merged.length - 1];
        if (last && b.s < last.e) last.e = Math.max(last.e, b.e);
        else merged.push(b);
    }

    const slots = [];
    let currDate = parseISO(range.start);
    currDate.setUTCHours(0, 0, 0, 0);

    while (currDate.getTime() < rangeEnd) {
        const wStart = new Date(currDate).setUTCHours(wsH, wsM, 0, 0);
        const wEnd = new Date(currDate).setUTCHours(weH, weM, 0, 0);
        
        let t = Math.max(wStart, rangeStart);
        const limit = Math.min(wEnd, rangeEnd);

        while (t + durMs <= limit) {
            const tEnd = t + durMs;
            const clash = merged.find(b => t < b.e && tEnd > b.s);
            
            if (clash) {
                t = clash.e;
            } else {
                slots.push({ 
                    start: new Date(t).toISOString(), 
                    end: new Date(tEnd).toISOString() 
                });
                t += durMs;
            }
        }
        currDate.setUTCDate(currDate.getUTCDate() + 1);
    }

    return slots;
};
export default findAvailableSlots;