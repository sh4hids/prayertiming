import getByDay from './getByDay';
import { getDaysInMonthUTC } from './utils';

function getByMonth({
  long,
  lat,
  timezone,
  dst,
  elv = 0,
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
  timeFormat = '24h',
  method = 'MWL',
  config = {},
}) {
  if (month < 0 || month > 11) {
    throw new Error('Invalid month');
  }

  const days = getDaysInMonthUTC(month, year);
  const times = [];

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

export default getByMonth;
