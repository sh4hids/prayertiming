# prayertimes

A muslim prayer times calculation node library based on coordinates.

## Installation

```bash
$ npm i prayertimes
```

## Usage

```javascript
const { getByDay, getByMonth } = require('prayertimes');
```

or

```javascript
import { getByDay, getByMonth } from 'prayertimes';
```

```javascript
const date = new Date('2021-04-24T05:16:54.442Z');

getByDay({
  date,
  long: 90.38,
  lat: 23.75,
  method: 'Karachi',
  timeFormat: '12h',
}); // returns and object

getByMonth({
  month: 3,
  year: 2021,
  long: 90.38,
  lat: 23.75,
  method: 'Karachi',
  timeFormat: '12h',
}); // returns an array of object
```

## Methods

### getByDay

This method takes latitude, longitude, date and some other configs and returns an object containing the prayer times.

#### inputs

| Parameter  | Type                   | Description                                                         |
| ---------- | ---------------------- | ------------------------------------------------------------------- |
| date       | JavaScript date object | A valid JavaScript date object. [default `new Date()`]              |
| lat        | Number                 | Latitude                                                            |
| long       | Number                 | Longitude                                                           |
| timezone   | Number                 | [default `collects from system`]                                    |
| dst        | Number                 | Daylight savings time [default `collects from system`]              |
| elv        | Number                 | Elevation [default `0`]                                             |
| timeFormat | String                 | '24h' or '12h' format [default `24h`]                               |
| method     | String                 | [Calculation method](README.md#calculation-methods) [default `MWL`] |
| config     | Object                 | Custom calculation [configuration](README.md#config) [default `{}`] |

#### output

```javascript
{
  date: '2021-04-24T05:16:54.442Z',
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
}
```

### getByMonth

This method takes latitude, longitude, month, year and some other configs and returns an array of object containing the prayer times.

#### inputs

| Parameter  | Type   | Description                                                            |
| ---------- | ------ | ---------------------------------------------------------------------- |
| month      | Number | JavaScript month number from 0 to 11 [default `new Date().getMonth()`] |
| year       | Number | Valid year value [default `new Date().getFullYear()`]                  |
| lat        | Number | Latitude                                                               |
| long       | Number | Longitude                                                              |
| timezone   | Number | [default `collects from system`]                                       |
| dst        | Number | Daylight savings time [default `collects from system`]                 |
| elv        | Number | Elevation [default `0`]                                                |
| timeFormat | String | '24h' or '12h' format [default `24h`]                                  |
| method     | String | [Calculation method](README.md#calculation-methods) [default `MWL`]    |
| config     | Object | Custom calculation [configuration](README.md#config) [default `{}`]    |

#### output

```javascript
[
  {
    date: '2021-04-01T00:00:00.000Z',
    method: 'Karachi',
    imsak: '4:25 am',
    fajr: '4:35 am',
    sunrise: '5:51 am',
    dhuhr: '12:02 pm',
    asr: '3:30 pm',
    asrHanafi: '4:30 pm',
    sunset: '6:14 pm',
    maghrib: '6:14 pm',
    isha: '7:30 pm',
    midnight: '12:03 am',
  },
  {
    date: '2021-04-02T00:00:00.000Z',
    method: 'Karachi',
    imsak: '4:24 am',
    fajr: '4:34 am',
    sunrise: '5:50 am',
    dhuhr: '12:02 pm',
    asr: '3:29 pm',
    asrHanafi: '4:30 pm',
    sunset: '6:15 pm',
    maghrib: '6:15 pm',
    isha: '7:31 pm',
    midnight: '12:02 am',
  },
  ...
  ...
]
```

### config

| Parameter | Type   | Description                                                                                            |
| --------- | ------ | ------------------------------------------------------------------------------------------------------ |
| imsak     | String | Time difference between fajr and suhoor [default `10 min`]                                             |
| dhuhr     | String | Time difference between midday and dhuhr [default `0 min`]                                             |
| maghrib   | String | Time difference between sunset and maghrib [default `0 min`]                                           |
| midnight  | String | Midnight calculation method (`Standard` or `Jafari`) [default `Standard`]                              |
| highLats  | String | Night portion calculation method (`AngleBased`, `OneSeventh` or `NightMiddle`) [default `NightMiddle`] |

### Calculation Methods

| Name    | Authority                                     | Config                                                   |
| ------- | --------------------------------------------- | -------------------------------------------------------- |
| Egypt   | Egyptian General Authority of Survey          | `fajr: 19.5, isha: 17.5`                                 |
| ISNA    | Islamic Society of North America (ISNA)       | `fajr: 15, isha: 15`                                     |
| Jafari  | Shia Ithna-Ashari, Leva Institute, Qum        | `fajr: 16, isha: 14, maghrib: 4, midnight: 'Jafari'`     |
| JAKIM   | Jabatan Kemajuan Islam Malaysia               | `fajr: 20, isha: 18`                                     |
| Karachi | University of Islamic Sciences, Karachi       | `fajr: 18, isha: 18`                                     |
| Makkah  | Umm Al-Qura University, Makkah                | `fajr: 18.5, isha: '90 min'`                             |
| MF      | Muslims of France (MF)                        | `fajr: 12, isha: 12`                                     |
| MWL     | Muslim World League                           | `fajr: 18, isha: 17`                                     |
| Tehran  | Institute of Geophysics, University of Tehran | `fajr: 17.7, isha: 14, maghrib: 4.5, midnight: 'Jafari'` |

- _For Makkah fajr was 19 degrees before 1430 hijri_
