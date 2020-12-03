import { isLeapYear } from 'date-fns';

export default function validateDateArgs(year: number, month: number, day: number): Date | false {
  const normalisedMonth = month - 1;
  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
   
  // check month doesn't exceed 12
  if (month > 11) return false; 

  // if leap year give Feb 29 days
  if (isLeapYear(new Date(year, normalisedMonth, monthDays[normalisedMonth]))) {
    monthDays[1] = 29;
  }

  // check day doesn't exceed days permitted in that month
  if (day > monthDays[normalisedMonth]) return false;

  return new Date(year, normalisedMonth, day);
}