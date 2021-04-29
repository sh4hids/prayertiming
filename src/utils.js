import * as DMath from './degreeMath';

export function isDate(date) {
  return (
    date &&
    Object.prototype.toString.call(date) === '[object Date]' &&
    !isNaN(date)
  );
}

export function getDaysInMonthUTC(month, year) {
  var date = new Date(Date.UTC(year, month, 1));
  var days = [];
  while (date.getUTCMonth() === month) {
    days.push(new Date(date));
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return days;
}

export function gmtOffset(date) {
  const localDate = new Date(date[0], date[1] - 1, date[2], 12, 0, 0, 0);
  const GMTString = localDate.toGMTString();
  const GMTDate = new Date(
    GMTString.substring(0, GMTString.lastIndexOf(' ') - 1)
  );
  const hoursDiff = (localDate - GMTDate) / (1000 * 60 * 60);
  return hoursDiff;
}

export function getTimeZone(date) {
  const year = date[0];
  const t1 = gmtOffset([year, 0, 1]);
  const t2 = gmtOffset([year, 6, 1]);
  return Math.min(t1, t2);
}

export function getDst(date) {
  return Number(gmtOffset(date) !== getTimeZone(date));
}

export function getJulianDate(year, month, day) {
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

export function dayPortion(times) {
  const portionedTimes = { ...times };

  Object.keys(portionedTimes).forEach((key) => {
    portionedTimes[key] /= 24;
  });

  return portionedTimes;
}

export function getNumValue(str) {
  return Number(String(str).split(/[^0-9.+-]/)[0]);
}

export function sunPosition(jd) {
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

export function midDay(time, jDate) {
  const eqt = sunPosition(jDate + time).equation;
  const noon = DMath.fixHour(12 - eqt);
  return noon;
}

export function sunAngleTime({ angle, time, direction, jDate, lat }) {
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

export function riseSetAngle(elv) {
  const angle = 0.0347 * Math.sqrt(elv); // an approximation
  return 0.833 + angle;
}

export function getAsrTime({ factor, time, jDate, lat, direction }) {
  const decl = sunPosition(jDate + time).declination;
  const angle = -DMath.arccot(factor + DMath.tan(Math.abs(lat - decl)));
  return sunAngleTime({ angle, time, direction, jDate, lat });
}

export function asrFactor(asrParam) {
  return { Standard: 1, Hanafi: 2 }[asrParam] || getNumValue(asrParam);
}

export function isMin(arg) {
  return String(arg).indexOf('min') !== -1;
}

export function timeDiff(time1, time2) {
  return DMath.fixHour(time2 - time1);
}

export function nightPortion({ angle, night, settings }) {
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

export function adjustHighLats({ times, settings }) {
  const params = { ...settings };
  const adjustedTimes = { ...times };
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

export function adjustTimes({ times, settings, timeZone, long }) {
  const params = { ...settings };
  let adjustedTimes = { ...times };

  Object.keys(adjustedTimes).forEach((key) => {
    adjustedTimes[key] += timeZone - long / 15;
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

export function tuneTimes(times, offset) {
  const tunedTimes = { ...times };

  Object.keys(tunedTimes).forEach((key) => {
    tunedTimes[key] += offset[key] / 60;
  });

  return tunedTimes;
}

export function twoDigitsFormat(num) {
  return num < 10 ? `0${num}` : num;
}

export function getFormattedTime(time, format, suffixes) {
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

export function modifyFormats({ date, method, times, timeFormat }) {
  const prayers = {};

  const formattedTimes = { ...times };

  Object.keys(formattedTimes).forEach((key) => {
    const formatted = getFormattedTime(formattedTimes[key], timeFormat);
    prayers[key] = formatted;
  });

  return prayers;
}
