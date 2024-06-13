import {
  DateParts,
  PrayerTimes,
  AsrFactorType,
  AsrFactor,
  TimeFormat,
  Settings,
  FormattedPrayerTimes,
} from './config';
import * as DMath from './degreeMath';

export function isDate(date: unknown) {
  if (!date || date === 'Invalid Date') {
    return false;
  }

  return (
    date instanceof Date &&
    Object.prototype.toString.call(date) === '[object Date]' &&
    !Number.isNaN(date.getMonth())
  );
}

export function getDaysInMonthUTC(month: number, year: number) {
  const date = new Date(Date.UTC(year, month, 1));
  const days: Date[] = [];
  while (date.getUTCMonth() === month) {
    days.push(new Date(date));
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return days;
}

export function gmtOffset(date: DateParts) {
  const localDate = new Date(date.year, date.month - 1, date.day, 12, 0, 0, 0);
  const GMTString = localDate.toUTCString();
  const GMTDate = new Date(
    GMTString.substring(0, GMTString.lastIndexOf(' ') - 1)
  );
  const hoursDiff =
    (localDate.getTime() - GMTDate.getTime()) / (1000 * 60 * 60);
  return hoursDiff;
}

export function getTimeZone({ year }: DateParts) {
  const t1 = gmtOffset({ year, month: 0, day: 1 });
  const t2 = gmtOffset({ year, month: 6, day: 1 });
  return Math.min(t1, t2);
}

export function getDst(date: DateParts) {
  return Number(gmtOffset(date) !== getTimeZone(date));
}

export function getJulianDate(year: number, month: number, day: number) {
  let y = year;
  let m = month;
  if (month <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  const JD =
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    B -
    1524.5;

  return JD;
}

export function dayPortion(times: PrayerTimes): PrayerTimes {
  const portionedTimes: PrayerTimes = { ...times };

  Object.keys(portionedTimes).forEach((key) => {
    portionedTimes[key as keyof typeof portionedTimes] /= 24;
  });

  return portionedTimes;
}

export function getNumValue(str?: number | string) {
  return Number(String(str || '').split(/[^0-9.+-]/)[0]);
}

export function sunPosition(jd: number) {
  const D = jd - 2451545.0 + 0.0008;
  const g = DMath.fixAngle(357.529 + 0.98560028 * D);
  const q = DMath.fixAngle(280.459 + 0.98564736 * D);
  const L = DMath.fixAngle(q + 1.915 * DMath.sin(g) + 0.02 * DMath.sin(2 * g));

  const e = 23.439 - 0.00000036 * D;

  const RA = DMath.arctan2(DMath.cos(e) * DMath.sin(L), DMath.cos(L)) / 15;
  const equation = q / 15 - DMath.fixHour(RA);
  const declination = DMath.arcsin(DMath.sin(e) * DMath.sin(L));

  return { declination, equation };
}

export function midDay(time: number, jDate: number) {
  const eqt = sunPosition(jDate + time).equation;
  const noon = DMath.fixHour(12 - eqt);
  return noon;
}

export function sunAngleTime({
  angle,
  time,
  direction,
  jDate,
  lat,
}: {
  angle: number;
  time: number;
  direction?: string;
  jDate: number;
  lat: number;
}) {
  const decl = sunPosition(jDate + time).declination;
  const noon = midDay(time, jDate);
  const t =
    (1 / 15) *
    DMath.arccos(
      (-DMath.sin(angle) - DMath.sin(decl) * DMath.sin(lat)) /
        (DMath.cos(decl) * DMath.cos(lat))
    );
  return noon + (direction === 'ccw' ? -t : t);
}

export function riseSetAngle(elv: number) {
  const angle = 0.0347 * Math.sqrt(elv); // an approximation
  return 0.833 + angle;
}

export function getAsrTime({
  factor,
  time,
  jDate,
  lat,
  direction,
}: {
  factor: number;
  time: number;
  jDate: number;
  lat: number;
  direction?: string;
}) {
  const decl = sunPosition(jDate + time).declination;
  const angle = -DMath.arccot(factor + DMath.tan(Math.abs(lat - decl)));
  return sunAngleTime({ angle, time, direction, jDate, lat });
}

export function asrFactor(asrParam: AsrFactorType) {
  return AsrFactor[asrParam] || getNumValue(asrParam);
}

export function isMin(arg?: number | string) {
  return String(arg || '').indexOf('min') !== -1;
}

export function timeDiff(time1: number, time2: number) {
  return DMath.fixHour(time2 - time1);
}

export function nightPortion({
  angle,
  night,
  settings,
}: {
  angle: number;
  night: number;
  settings: Settings;
}) {
  const method = settings.highLats;
  let portion = 1 / 2; // MidNight
  if (method === 'AngleBased') portion = (1 / 60) * angle;
  if (method === 'OneSeventh') portion = 1 / 7;
  return portion * night;
}

export function adjustHLTime({
  time,
  base,
  angle,
  night,
  direction,
  settings,
}: {
  time: number;
  base: number;
  angle: number;
  night: number;
  direction?: string;
  settings: Settings;
}) {
  let HLTime = time;
  const portion = nightPortion({ angle, night, settings });
  const timeDiffs =
    direction === 'ccw' ? timeDiff(time, base) : timeDiff(base, time);
  if (Number.isNaN(time) || timeDiffs > portion) {
    HLTime = base + (direction === 'ccw' ? -portion : portion);
  }
  return HLTime;
}

export function adjustHighLats({
  times,
  settings,
}: {
  times: PrayerTimes;
  settings: Settings;
}) {
  const params = { ...settings };
  const adjustedTimes: PrayerTimes = { ...times };
  const nightTime = timeDiff(times.sunset, times.sunrise);

  adjustedTimes.imsak = adjustHLTime({
    settings,
    time: times.imsak,
    base: times.sunrise,
    angle: getNumValue(params.imsak),
    night: nightTime,
    direction: 'ccw',
  });

  adjustedTimes.fajr = adjustHLTime({
    settings,
    time: times.fajr,
    base: times.sunrise,
    angle: getNumValue(params.fajr),
    night: nightTime,
    direction: 'ccw',
  });

  adjustedTimes.isha = adjustHLTime({
    settings,
    time: times.isha,
    base: times.sunset,
    angle: getNumValue(params.isha),
    night: nightTime,
  });

  adjustedTimes.maghrib = adjustHLTime({
    settings,
    time: times.maghrib,
    base: times.sunset,
    angle: getNumValue(params.maghrib),
    night: nightTime,
  });

  return adjustedTimes;
}

export function adjustTimes({
  times,
  settings,
  timeZone,
  long,
}: {
  times: PrayerTimes;
  settings: Settings;
  timeZone: number;
  long: number;
}) {
  const params: Settings = { ...settings };
  let adjustedTimes: PrayerTimes = { ...times };

  Object.keys(adjustedTimes).forEach((key) => {
    adjustedTimes[key as keyof typeof adjustedTimes] += timeZone - long / 15;
  });

  if (params.highLats !== 'None') {
    adjustedTimes = adjustHighLats({ times: adjustedTimes, settings });
  }

  if (isMin(params.imsak)) {
    adjustedTimes.imsak = adjustedTimes.fajr - getNumValue(params.imsak) / 60;
  }

  if (isMin(params.maghrib)) {
    adjustedTimes.maghrib =
      adjustedTimes.sunset + getNumValue(params.maghrib) / 60;
  }

  if (isMin(params.isha)) {
    adjustedTimes.isha = adjustedTimes.maghrib + getNumValue(params.isha) / 60;
  }

  adjustedTimes.dhuhr += getNumValue(params.dhuhr) / 60;

  return adjustedTimes;
}

export function tuneTimes(times: PrayerTimes, offset: PrayerTimes) {
  const tunedTimes: PrayerTimes = { ...times };

  Object.keys(tunedTimes).forEach((key) => {
    tunedTimes[key as keyof typeof tunedTimes] +=
      (offset[key as keyof typeof offset] || 0) / 60;
  });

  return tunedTimes;
}

export function twoDigitsFormat(num: number) {
  return num < 10 ? `0${num}` : num;
}

export function getFormattedTime(
  time: number,
  format: TimeFormat,
  suffixes?: string[]
) {
  const invalidTime = '--:--';
  const timeSuffixes = suffixes || ['am', 'pm'];
  let formattedTime = time;

  if (Number.isNaN(time)) return invalidTime;

  if (format === 'Float') return time;

  formattedTime = DMath.fixHour(formattedTime + 0.5 / 60); // add 0.5 minutes to round

  const hours = Math.floor(formattedTime);
  const minutes = Math.floor((formattedTime - hours) * 60);
  const suffix = format === '12h' ? timeSuffixes[hours < 12 ? 0 : 1] : '';
  const hour =
    format === '24h' ? twoDigitsFormat(hours) : ((hours + 12 - 1) % 12) + 1;
  return `${hour}:${twoDigitsFormat(minutes)}${suffix ? ` ${suffix}` : ''}`;
}

export function modifyFormats({
  times,
  timeFormat,
}: {
  times: PrayerTimes;
  timeFormat: TimeFormat;
}) {
  const prayers: FormattedPrayerTimes = {
    ...times,
  };

  Object.keys(times).forEach((key) => {
    const formatted = getFormattedTime(
      times[key as keyof typeof times] || 0,
      timeFormat
    );
    prayers[key as keyof typeof prayers] = formatted;
  });

  return prayers;
}
