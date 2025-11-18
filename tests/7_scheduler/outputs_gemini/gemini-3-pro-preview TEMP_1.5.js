const findAvailableSlots = async (cal1, cal2, constraints) => {
  const { parseISO, formatISO } = await import('https://cdn.jsdelivr.net/npm/date-fns@3.6.0/+esm');

  const D = constraints.durationMinutes;
  const MS = D * 60000;
  const sDate = parseISO(constraints.searchRange.start).getTime();
  const eDate = parseISO(constraints.searchRange.end).getTime();

  const [wsH, wsM] = constraints.workHours.start.split(':').map(Number);
  const [weH, weM] = constraints.workHours.end.split(':').map(Number);
  const wsMin = wsH * 60 + wsM;
  const weMin = weH * 60 + weM;

  const busy = [...cal1, ...cal2]
    .map(x => ({ s: parseISO(x.start).getTime(), e: parseISO(x.end).getTime() }))
    .filter(x => x.e > sDate && x.s < eDate)
    .sort((a, b) => a.s - b.s);

  const res = [];
  let curr = sDate;
  let bIdx = 0;

  while (curr + MS <= eDate) {
    // 1. Jump overlapping busy slots
    let collision = false;
    while (bIdx < busy.length && busy[bIdx].e <= curr) bIdx++; // Fast forward past busy
    
    for (let i = bIdx; i < busy.length; i++) {
      if (busy[i].s >= curr + MS) break; // Future busy slot
      if (curr < busy[i].e && (curr + MS) > busy[i].s) { // Overlap
        curr = busy[i].e;
        collision = true;
        break; 
      }
    }
    if (collision) continue;

    // 2. Validate/Adjust Work Hours (UTC)
    const d = new Date(curr);
    const dMin = d.getUTCHours() * 60 + d.getUTCMinutes();
    
    // Calc end time min (handling day boundaries carefully)
    const endD = new Date(curr + MS);
    const endMin = endD.getUTCHours() * 60 + endD.getUTCMinutes();
    const diffDays = endD.getUTCDate() !== d.getUTCDate();

    if (dMin < wsMin) {
      // Too early: Jump to start of work day
      d.setUTCHours(wsH, wsM, 0, 0);
      curr = d.getTime();
    } else if (diffDays || endMin > weMin || (endMin === 0 && diffDays)) { // endMin 0 is midnight next day
      // Too late: Jump to start of next work day
      d.setUTCDate(d.getUTCDate() + 1);
      d.setUTCHours(wsH, wsM, 0, 0);
      curr = d.getTime();
    } else {
      // Valid slot
      res.push({ start: formatISO(curr), end: formatISO(curr + MS) });
      curr += MS;
    }
  }
  
  return res;
};
export default findAvailableSlots;