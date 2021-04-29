import {
  dayPortion,
  getNumValue,
  sunAngleTime,
  midDay,
  asrFactor,
  getAsrTime,
  riseSetAngle,
} from './utils';

export default function computePrayerTimes({
  times,
  jDate,
  lat,
  elv,
  settings,
}) {
  const dayPortionTimes = dayPortion(times);

  const imsak = sunAngleTime({
    jDate,
    lat,
    angle: getNumValue(settings.imsak),
    time: dayPortionTimes.imsak,
    direction: 'ccw',
  });

  const fajr = sunAngleTime({
    jDate,
    lat,
    angle: getNumValue(settings.fajr),
    time: dayPortionTimes.fajr,
    direction: 'ccw',
  });

  const sunrise = sunAngleTime({
    jDate,
    lat,
    angle: riseSetAngle(elv),
    time: dayPortionTimes.sunrise,
    direction: 'ccw',
  });

  const dhuhr = midDay(dayPortionTimes.dhuhr, jDate);

  const asr = getAsrTime({
    jDate,
    lat,
    factor: asrFactor('Standard'),
    time: dayPortionTimes.asr,
  });

  const asrHanafi = getAsrTime({
    jDate,
    lat,
    factor: asrFactor('Hanafi'),
    time: dayPortionTimes.asr,
  });

  const sunset = sunAngleTime({
    jDate,
    lat,
    angle: riseSetAngle(elv),
    time: dayPortionTimes.sunset,
  });

  const maghrib = sunAngleTime({
    jDate,
    lat,
    angle: getNumValue(settings.maghrib),
    time: dayPortionTimes.maghrib,
  });

  const isha = sunAngleTime({
    jDate,
    lat,
    angle: getNumValue(settings.isha),
    time: dayPortionTimes.isha,
  });

  return {
    imsak,
    fajr,
    sunrise,
    dhuhr,
    asr,
    asrHanafi,
    sunset,
    maghrib,
    isha,
  };
}
