import { addDays, formatDateYyyyMmDd } from './date';

test(formatDateYyyyMmDd.name, () => {
  expect(formatDateYyyyMmDd(new Date('2024-01-02T18:04:44.000Z'))).toBe(
    '2024-01-02',
  );
});

test(addDays.name, () => {
  expect(addDays(1, new Date('2024-01-02T01:02:03.000Z')).toISOString()).toBe(
    '2024-01-03T01:02:03.000Z',
  );

  expect(addDays(-6, new Date('2024-05-16T14:50:12.000Z')).toISOString()).toBe(
    '2024-05-10T14:50:12.000Z',
  );
});
