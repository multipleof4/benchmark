const findAvailableSlots = async (calendar1, calendar2, constraints) => {
  const { DateTime, Interval } = await import('https://cdn.skypack.dev/luxon@3.0.1')

  const { durationMinutes, searchRange, workHours } = constraints
  const workStart = DateTime.fromISO(`${searchRange.start.split('T')[0]}T${workHours.start}:00Z`)
  const workEnd = DateTime.fromISO(`${searchRange.start.split('T')[0]}T${workHours.end}:00Z`)
  const searchStart = DateTime.fromISO(searchRange.start)
  const searchEnd = DateTime.fromISO(searchRange.end)

  const mergeCalendars = (cal1, cal2) => {
    const allSlots = [...cal1, ...cal2].map(slot => ({
      start: DateTime.fromISO(slot.start),
      end: DateTime.fromISO(slot.end)
    })).sort((a, b) => a.start - b.start)

    return allSlots.reduce((merged, current) => {
      if (merged.length === 0) return [current]

      const last = merged[merged.length - 1]
      if (current.start <= last.end) {
        last.end = current.end > last.end ? current.end : last.end
        return merged
      }

      return [...merged, current]
    }, [])
  }

  const mergedBusy = mergeCalendars(calendar1, calendar2)
  const freeIntervals = []

  let currentStart = searchStart
  for (const busy of mergedBusy) {
    if (busy.start > currentStart) {
      freeIntervals.push(Interval.fromDateTimes(currentStart, busy.start))
    }
    currentStart = busy.end > currentStart ? busy.end : currentStart
  }

  if (currentStart < searchEnd) {
    freeIntervals.push(Interval.fromDateTimes(currentStart, searchEnd))
  }

  const availableSlots = freeIntervals.flatMap(interval => {
    const slots = []
    let slotStart = interval.start

    while (slotStart.plus({ minutes: durationMinutes }) <= interval.end) {
      const slotEnd = slotStart.plus({ minutes: durationMinutes })
      const slotInterval = Interval.fromDateTimes(slotStart, slotEnd)

      if (slotInterval.engulfs(workStart) && slotInterval.engulfs(workEnd)) {
        slots.push({
          start: slotStart.toISO(),
          end: slotEnd.toISO()
        })
      }

      slotStart = slotEnd
    }

    return slots
  })

  return availableSlots.filter(slot => {
    const slotStart = DateTime.fromISO(slot.start)
    const slotEnd = DateTime.fromISO(slot.end)
    return slotStart >= workStart && slotEnd <= workEnd
  })
}
export default findAvailableSlots;