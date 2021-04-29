import computePrayerTimes from './computePrayerTimes';
import {
  calculationMethods,
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

function getByDay({
  long,
  lat,
  timezone,
  dst,
  elv = 0,
  date = new Date(),
  timeFormat = '24h',
  method = 'MWL',
  config = {},
}) {
  if (!isDate(date)) {
    throw new Error('Invalid date');
  }

  const dateParts = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  const daylightSaving = dst || getDst(dateParts);
  const settings = {
    ...defaultSettings,
    ...calculationMethods[method].params,
    ...config,
  };
  const jDate =
    getJulianDate(dateParts[0], dateParts[1], dateParts[2]) - long / (15 * 24);
  let timeZone = timezone || getTimeZone(dateParts);

  let times = {
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
    settings.midnight === 'Jafari'
      ? times.sunset + timeDiff(times.sunset, times.fajr) / 2
      : times.sunset + timeDiff(times.sunset, times.sunrise) / 2;

  times = tuneTimes(times, offset);

  times = modifyFormats({
    times,
    timeFormat,
  });

  return { date, method, ...times };
}

export default getByDay;
