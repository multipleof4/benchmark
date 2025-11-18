async function findAvailableSlots(cal1, cal2, cons) {
  const { DateTime: DT, Interval: IV, Duration: D } = await import('https://esm.sh/luxon@3.4.4');
  const dur = D.fromObject({ minutes: cons.durationMinutes });
  const sr = IV.fromISO(`${cons.searchRange.start}/${cons.searchRange.end}`);
  const [h1, m1] = cons.workHours.start.split(':').map(Number);
  const [h2, m2] = cons.workHours.end.split(':').map(Number);
  let busies = [...cal1, ...cal2].map(e => IV.fromISO(`${e.start}/${e.end}`))
    .filter(iv => iv?.overlaps(sr))
    .map(iv => iv.intersection(sr))
    .filter(iv => iv && !iv.isEmpty)
    .sort((a, b) => a.start.toMillis() - b.start.toMillis());
  let merged = [];
  for (let iv of busies) {
    if (!merged.length) {
      merged.push(iv);
      continue;
    }
    let last = merged[merged.length - 1];
    if (last.end >= iv.start) {
      const newEnd = last.end.toMillis() > iv.end.toMillis() ? last.end : iv.end;
      merged[merged.length - 1] = IV.fromDateTimes(last.start, newEnd);
    } else {
      merged.push(iv);
    }
  }
  let frees = [];
  let prevEnd = sr.start;
  for (let busy of merged) {
    if (prevEnd < busy.start) {
      frees.push(IV.fromDateTimes(prevEnd, busy.start));
    }
    prevEnd = busy.end;
  }
  if (prevEnd < sr.end) {
    frees.push(IV.fromDateTimes(prevEnd, sr.end));
  }
  let workFrees = [];
  for (let free of frees) {
    let cur = free.start;
    while (cur < free.end) {
      let dayS = cur.startOf('day');
      let dayE = dayS.plus({ days: 1 });
      let dInt = IV.fromDateTimes(dayS, dayE);
      let dayFree = free.intersection(dInt);
      if (dayFree && !dayFree.isEmpty) {
        let wS = dayS.plus({ hours: h1, minutes: m1 });
        let wE = dayS.plus({ hours: h2, minutes: m2 });
        let wInt = IV.fromDateTimes(wS, wE);
        let wf = dayFree.intersection(wInt);
        if (wf && !wf.isEmpty) {
          workFrees.push(wf);
        }
      }
      cur = dayE;
    }
  }
  let slots = [];
  const dMs = dur.toMillis();
  for (let wf of workFrees) {
    let remMs = wf.end.toMillis() - wf.start.toMillis();
    let n = Math.floor(remMs / dMs);
    let fs = wf.start;
    for (let i = 0; i < n; i++) {
      let ss = fs.plus(D.fromMillis(i * dMs));
      let se = ss.plus(dur);
      slots.push({ start: ss.toISO(), end: se.toISO() });
    }
  }
  return slots;
}
export default findAvailableSlots;