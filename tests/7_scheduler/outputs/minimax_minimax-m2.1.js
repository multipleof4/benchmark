export async function findAvailableSlots(calendarA, calendarB, constraints) {
  const { durationMinutes, searchRange, workHours } = constraints;
  const { parseISO, addMinutes, differenceInMinutes, min, max, formatISO, isAfter, isBefore, isEqual, parse } = await import('https://cdn.jsdelivr.net/npm/date-fns@3.6.0/+esm');

  const searchStart = parseISO(searchRange.start);
  const searchEnd = parseISO(searchRange.end);
  const workStart = parse(workHours.start, 'HH:mm', searchStart);
  const workEnd = parse(workHours.end, 'HH:mm', searchStart);

  const allBusy = [...calendarA, ...calendarB].map(slot => ({
    start: parseISO(slot.start),
    end: parseISO(slot.end)
  })).sort((a, b) => a.start - b.start);

  const mergedBusy = [];
  for (const slot of allBusy) {
    if (!mergedBusy.length || isAfter(slot.start, mergedBusy[mergedBusy.length - 1].end)) {
      mergedBusy.push({ start: slot.start, end: slot.end });
    } else {
      mergedBusy[mergedBusy.length - 1].end = max([mergedBusy[mergedBusy.length - 1].end, slot.end]);
    }
  }

  const freePeriods = [];
  let currentStart = searchStart;

  for (const busy of mergedBusy) {
    if (isBefore(currentStart, busy.start)) {
      freePeriods.push({ start: currentStart, end: busy.start });
    }
    currentStart = max([currentStart, busy.end]);
  }

  if (isBefore(currentStart, searchEnd)) {
    freePeriods.push({ start: currentStart, end: searchEnd });
  }

  const slots = [];

  for (const period of freePeriods) {
    const periodStart = max([period.start, searchStart]);
    const periodEnd = min([period.end, searchEnd]);

    let slotStart = periodStart;

    while (true) {
      const slotEnd = addMinutes(slotStart, durationMinutes);

      if (isAfter(slotEnd, periodEnd) || isAfter(slotEnd, searchEnd)) {
        break;
      }

      const slotWorkStart = new Date(slotStart);
      const slotWorkEnd = new Date(slotStart);
      slotWorkStart.setUTCHours(workStart.getUTCHours(), workStart.getUTCMinutes(), 0, 0);
      slotWorkEnd.setUTCHours(workEnd.getUTCHours(), workEnd.getUTCMinutes(), 0, 0);

      const adjustedSlotStart = max([slotStart, slotWorkStart]);

      if (differenceInMinutes(slotEnd, adjustedSlotStart) >= durationMinutes) {
        const finalSlotStart = adjustedSlotStart;
        const finalSlotEnd = addMinutes(finalSlotStart, durationMinutes);

        if (!isAfter(finalSlotEnd, periodEnd) && !isAfter(finalSlotEnd, searchEnd) && !isAfter(finalSlotEnd, slotWorkEnd)) {
          slots.push({ start: formatISO(finalSlotStart), end: formatISO(finalSlotEnd) });
        }
      }

      slotStart = addMinutes(slotStart, durationMinutes);
    }
  }

  const sortedSlots = slots.sort((a, b) => parseISO(a.start) - parseISO(b.start));

  const nonOverlappingSlots = [];
  let lastEnd = null;

  for (const slot of sortedSlots) {
    const slotStart = parseISO(slot.start);
    const slotEnd = parseISO(slot.end);

    if (!lastEnd || !isBefore(slotStart, lastEnd)) {
      if (!lastEnd || isAfter(slotStart, lastEnd)) {
        nonOverlappingSlots.push(slot);
        lastEnd = slotEnd;
      }
    }
  }

  return nonOverlappingSlots;
}
export default findAvailableSlots;
// Generation time: 14.885s
// Result: FAIL