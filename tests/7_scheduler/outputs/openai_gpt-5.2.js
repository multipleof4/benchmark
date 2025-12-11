const _luxon = import("https://cdn.jsdelivr.net/npm/luxon@3.5.0/+esm");

const findAvailableSlots = async (calA = [], calB = [], c = {}) => {
  const { DateTime } = await _luxon;

  const durMin = c?.durationMinutes;
  const sr = c?.searchRange;
  const wh = c?.workHours;

  if (!Number.isFinite(durMin) || durMin <= 0) throw new TypeError("Invalid durationMinutes");
  if (!sr?.start || !sr?.end) throw new TypeError("Invalid searchRange");
  if (!wh?.start || !wh?.end) throw new TypeError("Invalid workHours");

  const parseHm = s => {
    const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(String(s).trim());
    if (!m) throw new TypeError("Invalid workHours time");
    return { h: +m[1], m: +m[2] };
  };

  const rs = DateTime.fromISO(sr.start, { zone: "utc" });
  const re = DateTime.fromISO(sr.end, { zone: "utc" });
  if (!rs.isValid || !re.isValid) throw new TypeError("Invalid searchRange ISO");
  const rS = rs.toMillis(), rE = re.toMillis();
  if (!(rE > rS)) return [];

  const ws = parseHm(wh.start), we = parseHm(wh.end);
  if (we.h * 60 + we.m <= ws.h * 60 + ws.m) throw new TypeError("workHours.end must be after workHours.start");

  const durMs = Math.round(durMin * 60000);
  if (durMs <= 0) throw new TypeError("Invalid durationMinutes");

  const norm = x => {
    const s = DateTime.fromISO(x.start, { zone: "utc" });
    const e = DateTime.fromISO(x.end, { zone: "utc" });
    if (!s.isValid || !e.isValid) return null;
    let a = s.toMillis(), b = e.toMillis();
    if (!(b > a)) return null;
    if (b <= rS || a >= rE) return null;
    a = Math.max(a, rS);
    b = Math.min(b, rE);
    return b > a ? [a, b] : null;
  };

  const mergedBusy = (() => {
    const xs = [...calA, ...calB].map(norm).filter(Boolean).sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    if (!xs.length) return [];
    const out = [];
    let [cs, ce] = xs[0];
    for (let i = 1; i < xs.length; i++) {
      const [s, e] = xs[i];
      if (s <= ce) ce = Math.max(ce, e);
      else out.push([cs, ce]), (cs = s), (ce = e);
    }
    out.push([cs, ce]);
    return out;
  })();

  const free = (() => {
    const out = [];
    let cur = rS;
    for (const [s, e] of mergedBusy) {
      if (s > cur) out.push([cur, s]);
      cur = Math.max(cur, e);
      if (cur >= rE) break;
    }
    if (cur < rE) out.push([cur, rE]);
    return out;
  })();

  const iso = ms => DateTime.fromMillis(ms, { zone: "utc" }).toISO({ suppressMilliseconds: true });

  const out = [];
  const dayMs = 86400000;

  for (const [fs, fe] of free) {
    let d0 = DateTime.fromMillis(fs, { zone: "utc" }).startOf("day").toMillis();
    const d1 = DateTime.fromMillis(fe - 1, { zone: "utc" }).startOf("day").toMillis();

    for (let d = d0; d <= d1; d += dayMs) {
      const base = DateTime.fromMillis(d, { zone: "utc" });
      const wS = base.set({ hour: ws.h, minute: ws.m, second: 0, millisecond: 0 }).toMillis();
      const wE = base.set({ hour: we.h, minute: we.m, second: 0, millisecond: 0 }).toMillis();

      const a = Math.max(fs, wS);
      const b = Math.min(fe, wE);
      for (let t = a; t + durMs <= b; t += durMs) out.push({ start: iso(t), end: iso(t + durMs) });
    }
  }

  return out;
};
export default findAvailableSlots;
// Generation time: 32.586s
// Result: PASS