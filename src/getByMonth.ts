import {
  TimeFormat,
  CalculationMethod,
  Settings,
  TimeFormats,
  PrayerTimesResult,
} from './config';
import { getByDay } from './getByDay';
import { getDaysInMonthUTC } from './utils';

export type GetByMonthParams = {
  long: number;
  lat: number;
  timezone?: number;
  dst?: number;
  elv?: number;
  month?: number;
  year?: number;
  timeFormat?: TimeFormat;
  method?: CalculationMethod;
  config?: Settings;
};

export function getByMonth({
  long,
  lat,
  timezone,
  dst,
  elv = 0,
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
  timeFormat = TimeFormats['24h'],
  method = 'MWL',
  config = {},
}: GetByMonthParams): PrayerTimesResult[] {
  if (month < 0 || month > 11) {
    throw new Error('Invalid month');
  }

  const days = getDaysInMonthUTC(month, year);
  const times: PrayerTimesResult[] = [];

  for (let i = 0, length = days.length; i < length; i++) {
    times.push(
      getByDay({
        long,
        lat,
        timezone,
        dst,
        elv,
        date: days[i],
        timeFormat,
        method,
        config,
      })
    );
  }

  return times;
}
