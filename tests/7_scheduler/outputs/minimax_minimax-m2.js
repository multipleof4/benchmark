'use strict';

export async function findAvailableSlots(busyA, busyB, constraints) {
  const {
    addMinutes,
    compareAsc,
    eachMinuteOfInterval,
    isBefore,
    isEqual,
    isValid,
    parseISO,
    startOfDay,
  } = await import('https://cdn.skypack.dev/date-fns@2.30.0');

  const c = constraints || {};
  const durationMinutes = (c && c.durationMinutes) || 30;
  if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) throw new Error('durationMinutes must be a positive integer');
  const range = c && c.searchRange || {};
  const rangeStart = parseISO(range.start);
  const rangeEnd = parseISO(range.end);
  if (!isValid(rangeStart) || !isValid(rangeEnd) || !isBefore(rangeStart, rangeEnd)) throw new Error('Invalid searchRange');
  const wh = c && c.workHours || {};
  const [whStartH, whStartM] = String(wh.start || '09:00').split(':').map(n => parseInt(n, 10));
  const [whEndH, whEndM] = String(wh.end || '17:00').split(':').split(':').map(n => parseInt(n, 10));
  const WH_ST = whStartH * 60 + (isNaN(whStartM) ? 0 : whStartM);
  const WH_ET = whEndH * 60 + (isNaN(whEndM) ? 0 : whEndM);
  if (!(0 <= WH_ST && WH_ST < WH_ET && WH_ET <= 1440)) throw new Error('Invalid workHours');

  const toEpoch = d => d.getTime();
  const fmtTime = d => {
    const t = d.getUTCHours().toString().padStart(2, '0') + ':' + d.getUTCMinutes().toString().padStart(2, '0');
    return t;
  };

  const parseBusy = slot => {
    const s = parseISO(slot.start);
    const e = parseISO(slot.end);
    if (!isValid(s) || !isValid(e) || !isBefore(s, e) && !isEqual(s, e)) throw new Error('Invalid busy slot');
    return { s, e };
  };

  const busy = [...busyA, ...busyB].map(parseBusy)
    .filter(({ s, e }) => isBefore(rangeStart, e) && !isBefore(s, rangeEnd))
    .map(({ s, e }) => ({ s: isBefore(s, rangeStart) ? rangeStart : s, e: isBefore(rangeEnd, e) ? rangeEnd : e }))
    .sort((a, b) => compareAsc(a.s, b.s));

  const merged = [];
  for (const cur of busy) {
    if (merged.length === 0) {
      merged.push({ ...cur });
      continue;
    }
    const last = merged[merged.length - 1];
    if (isBefore(last.e, cur.s) || isEqual(last.e, cur.s)) {
      merged.push({ ...cur });
    } else {
      if (isBefore(cur.e, last.e)) continue;
      last.e = cur.e;
    }
  }

  const findNext = (t, arr, lo, hi) => {
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (isBefore(arr[mid].e, t) || isEqual(arr[mid].e, t)) lo = mid + 1;
      else hi = mid - 1;
    }
    return lo < arr.length ? lo : -1;
  };

  const available = [];
  let cursor = rangeStart;
  let idx = 0;
  while (idx < merged.length && !isBefore(rangeEnd, merged[idx].s)) {
    const blockStart = merged[idx].s;
    const blockEnd = merged[idx].e;
    if (isBefore(cursor, blockStart)) {
      available.push({ start: cursor, end: blockStart });
    }
    if (isBefore(blockEnd, cursor)) {
      idx = findNext(cursor, merged, idx + 1, merged.length - 1);
      if (idx === -1) break;
      continue;
    }
    cursor = blockEnd;
    idx = idx + 1;
  }
  if (isBefore(cursor, rangeEnd)) available.push({ start: cursor, end: rangeEnd });

  const isSameUTCDay = (a, b) =>
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate();

  const startOfNextDayUTC = d => addMinutes(startOfDay(d), 24 * 60);

  const clipSegmentToWorkHours = (segStart, segEnd) => {
    const out = [];
    let day = startOfDay(segStart);
    while (isBefore(day, segEnd)) {
      const dayStart = isBefore(day, segStart) ? segStart : day;
      const dayNext = startOfNextDayUTC(day);
      const dayEnd = isBefore(segEnd, dayNext) ? segEnd : dayNext;
      const segST = (dayStart.getUTCHours() * 60 + dayStart.getUTCMinutes()) | 0;
      const segET = (dayEnd.getUTCHours() * 60 + dayEnd.getUTCMinutes()) | 0;
      const st = Math.max(segST, WH_ST);
      const et = Math.min(segET, WH_ET);
      if (st < et) {
        const clipStart = addMinutes(day, st);
        const clipEnd = addMinutes(day, et);
        out.push({ start: clipStart, end: clipEnd });
      }
      day = dayNext;
    }
    return out;
  };

  const slots = [];
  for (const seg of available) {
    const clips = clipSegmentToWorkHours(seg.start, seg.end);
    for (const clip of clips) {
      const clipLen = Math.floor((toEpoch(clip.end) - toEpoch(clip.start)) / 60000);
      const count = Math.floor(clipLen / durationMinutes);
      if (count <= 0) continue;
      let cur = clip.start;
      for (let i = 0; i < count; i++) {
        const s = cur;
        const e = addMinutes(s, durationMinutes);
        if (isBefore(e, clip.end) || isEqual(e, clip.end)) {
          if (isBefore(rangeStart, s) && !isBefore(rangeEnd, e)) {
            slots.push({ start: s.toISOString(), end: e.toISOString() });
          }
        }
        cur = e;
      }
    }
  }
  return slots;
}
export default findAvailableSlots;
// Generation time: 36.069s
// Result: FAIL