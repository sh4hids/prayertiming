import { computePrayerTimes } from './computePrayerTimes';
import {
  CalculationMethod,
  DateParts,
  MidnightMethods,
  PrayerTimes,
  PrayerTimesResult,
  Settings,
  TimeFormat,
  TimeFormats,
  CalculationMethods,
  defaultSettings,
  defaultTimes,
  offset,
} from './config';
import {
  getTimeZone,
  getDst,
  getJulianDate,
  adjustTimes,
  timeDiff,
  tuneTimes,
  modifyFormats,
  isDate,
} from './utils';

export type GetByDayParams = {
  long: number;
  lat: number;
  timezone?: number;
  dst?: number;
  elv?: number;
  date?: Date;
  timeFormat?: TimeFormat;
  method?: CalculationMethod;
  config?: Settings;
};

export function getByDay({
  long,
  lat,
  timezone,
  dst,
  elv = 0,
  date = new Date(),
  timeFormat = TimeFormats['24h'],
  method = 'MWL',
  config = {},
}: GetByDayParams): PrayerTimesResult {
  if (!isDate(date)) {
    throw new Error('Invalid Date');
  }

  const dateParts: DateParts = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };

  const daylightSaving = dst || getDst(dateParts);
  const settings = {
    ...defaultSettings,
    ...CalculationMethods[method].params,
    ...config,
  };
  const jDate =
    getJulianDate(dateParts.year, dateParts.month, dateParts.day) -
    long / (15 * 24);
  let timeZone = timezone || getTimeZone(dateParts);

  let times: PrayerTimes = {
    ...defaultTimes,
  };

  timeZone = Number(timeZone) + (Number(daylightSaving) ? 1 : 0);

  times = computePrayerTimes({
    times,
    jDate,
    lat,
    elv,
    settings,
  });

  times = adjustTimes({
    times,
    timeZone,
    long,
    settings,
  });

  times.midnight =
    settings.midnight === MidnightMethods.Jafari
      ? times.sunset + timeDiff(times.sunset, times.fajr) / 2
      : times.sunset + timeDiff(times.sunset, times.sunrise) / 2;

  times = tuneTimes(times, offset);

  const formattedTimes = modifyFormats({
    times,
    timeFormat,
  });

  return { date, method, ...formattedTimes };
}
