import { defaultSettings } from '../config';
import { GetByDayParams, getByDay } from '../getByDay';

const config: GetByDayParams = {
  date: new Date('2021-04-24T05:16:54.442Z'),
  long: 90.38,
  lat: 23.75,
  method: 'Karachi',
  timeFormat: '12h',
  timezone: 6,
};

const invalidConfig: GetByDayParams = {
  date: new Date('dsf'),
  long: 90.38,
  lat: 23.75,
  method: 'Karachi',
  timeFormat: '12h',
  timezone: 6,
  config: {
    ...defaultSettings,
    imsak: '7 min',
    dhuhr: '1 min',
  },
};

const expectedOutput = {
  date: new Date('2021-04-24T05:16:54.442Z'),
  method: 'Karachi',
  imsak: '4:01 am',
  fajr: '4:11 am',
  sunrise: '5:30 am',
  dhuhr: '11:57 am',
  asr: '3:23 pm',
  asrHanafi: '4:31 pm',
  sunset: '6:24 pm',
  maghrib: '6:24 pm',
  isha: '7:43 pm',
  midnight: '11:57 pm',
};

const result = getByDay(config);

test(`calculates prayer times for ${config.lat}, ${config.long}, ${config.date}`, () => {
  expect(result).toMatchObject(expectedOutput);
});

test(`should throw 'Invalid date' error`, () => {
  expect(() => getByDay(invalidConfig)).toThrow('Invalid Date');
});
