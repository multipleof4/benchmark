export const findAvailableSlots = async (calA, calB, { durationMinutes: dur, searchRange: sRange, workHours: wh }) => {
    const { DateTime: D, Interval: I } = await import('https://cdn.skypack.dev/luxon');
    const Z = { zone: 'utc' };
    const toD = t => D.fromISO(t, Z);
    const mkI = (s, e) => I.fromDateTimes(s, e);

    const busy = I.merge([...calA, ...calB].map(x => mkI(toD(x.start), toD(x.end))));
    const search = mkI(toD(sRange.start), toD(sRange.end));
    const [hS, mS] = wh.start.split(':');
    const [hE, mE] = wh.end.split(':');
    const res = [];

    let curr = search.start.startOf('day');
    while (curr < search.end) {
        const wWin = mkI(curr.set({ hour: hS, minute: mS }), curr.set({ hour: hE, minute: mE })).intersection(search);
        if (wWin?.isValid) {
            let free = [wWin];
            busy.forEach(b => free = free.flatMap(s => s.difference(b)));
            free.forEach(s => {
                let t = s.start;
                while (t.plus({ minutes: dur }) <= s.end) {
                    const next = t.plus({ minutes: dur });
                    res.push({ start: t.toISO(), end: next.toISO() });
                    t = next;
                }
            });
        }
        curr = curr.plus({ days: 1 });
    }
    return res;
};
export default findAvailableSlots;