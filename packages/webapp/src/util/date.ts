import { isNil } from 'lodash';

export const formatDateYyyyMmDd = (date: Date): string =>
  date.toISOString().split('T')[0];

export const addDays = (days: number, date?: Date): Date => {
  const curr = isNil(date) ? new Date() : new Date(date);
  curr.setDate(curr.getDate() + days);
  return curr;
};
