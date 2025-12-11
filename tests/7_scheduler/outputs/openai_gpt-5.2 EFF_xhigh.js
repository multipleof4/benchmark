let _lx;
const _loadLuxon = () =>
  _lx || (_lx = import("https://cdn.jsdelivr.net/npm/luxon@3.4.4/build/es6/luxon.js"));

async function findAvailableSlots(calendarA, calendarB, constraints) {
  const { DateTime } = await _loadLuxon();
  const M = 6e4, DAY = 1440, Z = { zone: "utc" };

  const a = Array.isArray(calendarA) ? calendarA : [];
  const b = Array.isArray(calendarB) ? calendarB : [];
  const o = constraints && typeof constraints === "object" ? constraints : {};

  const durMin = Number(o.durationMinutes);
  if (!(durMin > 0)) return [];
  const dur = durMin * M;

  const sr = o.searchRange || {};
  const rs = DateTime.fromISO(sr.start || "", Z);
  const re = DateTime.fromISO(sr.end || "", Z);
  if (!rs.isValid || !re.isValid) return [];
  const r0 = rs.toMillis(), r1 = re.toMillis();
  if (r0 >= r1) return [];

  const wh = o.workHours || {};
  const toMin = t => {
    const [h, m] = String(t).split(":").map(Number);
    if (!Number.isFinite(h) || !Number.isFinite(m)) return NaN;
    if (h === 24 && m === 0) return DAY;
    if (h < 0 || h > 23 || m < 0 || m > 59) return NaN;
    return h * 60 + m;
  };
  const ws = toMin(wh.start), we = toMin(wh.end);
  if (!Number.isFinite(ws) || !Number.isFinite(we)) return [];

  const clamp = (s, e) => {
    s = Math.max(s, r0);
    e = Math.min(e, r1);
    return s < e ? [s, e] : null;
  };

  const busy = [];
  const add = (s, e) => {
    const c = clamp(s, e);
    if (c) busy.push(c);
  };

  const addEvent = ev => {
    const s = DateTime.fromISO(ev?.start || "", Z);
    const e = DateTime.fromISO(ev?.end || "", Z);
    if (!s.isValid || !e.isValid) return;
    const x = s.toMillis(), y = e.toMillis();
    if (x < y) add(x, y);
  };

  a.forEach(addEvent);
  b.forEach(addEvent);

  for (let d = rs.startOf("day"); d.toMillis() < r1; d = d.plus({ days: 1 })) {
    const base = d.toMillis();
    const off = (x, y) => add(base + x * M, base + y * M);

    if (ws === we) off(0, DAY);
    else if (ws < we) {
      if (ws) off(0, ws);
      if (we < DAY) off(we, DAY);
    } else off(we, ws);
  }

  busy.sort((x, y) => x[0] - y[0] || x[1] - y[1]);

  const merged = [];
  for (const [s, e] of busy) {
    const last = merged[merged.length - 1];
    if (!last || s > last[1]) merged.push([s, e]);
    else last[1] = Math.max(last[1], e);
  }

  const out = [];
  const iso = ms => new Date(ms).toISOString();
  const pushSlot = (s, e) => out.push({ start: iso(s), end: iso(e) });

  let cur = r0;
  for (const [s, e] of merged) {
    if (cur < s) {
      for (let t = cur; t + dur <= s; t += dur) pushSlot(t, t + dur);
    }
    if (e > cur) cur = e;
    if (cur >= r1) return out;
  }

  for (let t = cur; t + dur <= r1; t += dur) pushSlot(t, t + dur);
  return out;
}
export default findAvailableSlots;
// Generation time: 822.838s
// Result: PASS