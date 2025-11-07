async function findAvailableSlots(calA, calB, c) {
  const { DateTime, Interval } = await import('https://cdn.skypack.dev/luxon').then(m => m);
  const d = c.durationMinutes;
  const z = DateTime.utc().zoneName;
  const parseIso = s => DateTime.fromISO(s, { zone: 'utc' });
  const parseHm = (hm, base) => {
    const [H, M] = hm.split(':').map(Number);
    return base.set({ hour: H, minute: M, second: 0, millisecond: 0 });
  };
  const toIso = dt => dt.toUTC().toISO();

  const rStart = parseIso(c.searchRange.start);
  const rEnd = parseIso(c.searchRange.end);

  const dayRange = [];
  for (let d0 = rStart.startOf('day'); d0 < rEnd; d0 = d0.plus({ days: 1 })) {
    const ws = parseHm(c.workHours.start, d0);
    const we = parseHm(c.workHours.end, d0);
    const s = ws < rStart ? rStart : ws;
    const e = we > rEnd ? rEnd : we;
    if (e > s) dayRange.push(Interval.fromDateTimes(s, e));
  }

  const normalizeBusy = cal =>
    cal
      .map(({ start, end }) => {
        const s = parseIso(start), e = parseIso(end);
        return e > s ? Interval.fromDateTimes(s, e) : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.start - b.start);

  const mergeBusy = busy => {
    const m = [];
    for (const i of busy) {
      const last = m[m.length - 1];
      if (!last || i.start > last.end) m.push(i);
      else if (i.end > last.end) last.end = i.end;
    }
    return m;
  };

  const intersectWithRange = (busy, ranges) => {
    const res = [];
    let j = 0;
    for (const r of ranges) {
      while (j < busy.length && busy[j].end <= r.start) j++;
      let k = j;
      while (k < busy.length && busy[k].start < r.end) {
        const s = busy[k].start < r.start ? r.start : busy[k].start;
        const e = busy[k].end > r.end ? r.end : busy[k].end;
        if (e > s) res.push(Interval.fromDateTimes(s, e));
        k++;
      }
    }
    return mergeBusy(res);
  };

  const invertBusy = (busy, ranges) => {
    const free = [];
    for (const r of ranges) {
      let cur = r.start;
      for (const b of busy) {
        if (b.end <= r.start || b.start >= r.end) continue;
        if (b.start > cur) free.push(Interval.fromDateTimes(cur, b.start));
        if (b.end > cur) cur = b.end;
        if (cur >= r.end) break;
      }
      if (cur < r.end) free.push(Interval.fromDateTimes(cur, r.end));
    }
    return free;
  };

  const intersectFree = (fa, fb) => {
    const res = [];
    let i = 0, j = 0;
    while (i < fa.length && j < fb.length) {
      const a = fa[i], b = fb[j];
      const s = a.start > b.start ? a.start : b.start;
      const e = a.end < b.end ? a.end : b.end;
      if (e > s) res.push(Interval.fromDateTimes(s, e));
      if (a.end < b.end) i++;
      else j++;
    }
    return res;
  };

  const filterByDuration = (slots, minutes) => {
    const out = [];
    const dur = { minutes };
    for (const s of slots) {
      let cur = s.start;
      while (cur.plus(dur) <= s.end) {
        const end = cur.plus(dur);
        out.push({ start: toIso(cur), end: toIso(end) });
        cur = end;
      }
    }
    return out;
  };

  const busyA = mergeBusy(normalizeBusy(calA));
  const busyB = mergeBusy(normalizeBusy(calB));

  const busyAIn = intersectWithRange(busyA, dayRange);
  const busyBIn = intersectWithRange(busyB, dayRange);

  const freeA = invertBusy(busyAIn, dayRange);
  const freeB = invertBusy(busyBIn, dayRange);

  const mutualFree = intersectFree(freeA, freeB);

  return filterByDuration(mutualFree, d);
}
export default findAvailableSlots;