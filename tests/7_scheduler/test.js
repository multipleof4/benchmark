export default {
  functionName: 'findAvailableSlots',
  prompt: `// Write an async JavaScript function 'findAvailableSlots' to find mutual available meeting times for two people.
// - The function must accept two calendars (arrays of busy slots) and a constraints object.
// - Calendar format: [{ start: 'ISODateString', end: 'ISODateString' }, ...]
// - Constraints format: { durationMinutes: number, searchRange: { start: 'ISODateString', end: 'ISODateString' }, workHours: { start: 'HH:mm', end: 'HH:mm' } }
// - You MUST use a dynamic import() to load one or more libraries from a CDN for date/time manipulation (e.g., date-fns, luxon, dayjs).
// - Merge overlapping busy times from both calendars. Find all free time periods where both are available.
// - Within each free period, generate ALL possible non-overlapping consecutive time slots of exactly 'durationMinutes' length.
// - Only include slots that fall completely within work hours (workHours.start to workHours.end) and the search range.
// - CRITICAL: Perform ALL calculations in UTC. Treat workHours as UTC times (e.g. 09:00 is 09:00Z). Do not convert to local system time.
// - Return an array of available slots in chronological order, each as: { start: 'ISODateString', end: 'ISODateString' }
// - Each slot must be exactly durationMinutes long. Slots must not overlap. Slots should be consecutive.`,
  runTest: async (findAvailableSlots) => {
    const assert = {
      deepStrictEqual: (a, e, m) => { if (JSON.stringify(a) !== JSON.stringify(e)) throw new Error(m || `FAIL: ${JSON.stringify(a)} !== ${JSON.stringify(e)}`) },
    };
    const today = new Date().toISOString().split('T')[0];
    const calendar1 = [
      { start: `${today}T09:00:00.000Z`, end: `${today}T10:30:00.000Z` },
      { start: `${today}T12:00:00.000Z`, end: `${today}T13:00:00.000Z` },
    ];
    const calendar2 = [
      { start: `${today}T10:00:00.000Z`, end: `${today}T11:00:00.000Z` },
      { start: `${today}T14:00:00.000Z`, end: `${today}T14:30:00.000Z` },
    ];
    const constraints = {
      durationMinutes: 60,
      searchRange: { start: `${today}T00:00:00.000Z`, end: `${today}T23:59:59.999Z` },
      workHours: { start: '09:00', end: '17:00' }
    };
    const expected = [
      { start: `${today}T11:00:00.000Z`, end: `${today}T12:00:00.000Z` },
      { start: `${today}T13:00:00.000Z`, end: `${today}T14:00:00.000Z` },
      { start: `${today}T14:30:00.000Z`, end: `${today}T15:30:00.000Z` },
      { start: `${today}T15:30:00.000Z`, end: `${today}T16:30:00.000Z` },
    ];

    const result = await findAvailableSlots(calendar1, calendar2, constraints);
    assert.deepStrictEqual(result, expected, 'Test Failed: Incorrect slots found.');
  }
};
