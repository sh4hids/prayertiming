export const calculationMethods = {
  MWL: {
    name: 'Muslim World League',
    params: { fajr: 18, isha: 17 },
  },
  ISNA: {
    name: 'Islamic Society of North America (ISNA)',
    params: { fajr: 15, isha: 15 },
  },
  MF: {
    name: 'Muslims of France (MF)',
    params: { fajr: 12, isha: 12 },
  },
  Egypt: {
    name: 'Egyptian General Authority of Survey',
    params: { fajr: 19.5, isha: 17.5 },
  },
  Makkah: {
    name: 'Umm Al-Qura University, Makkah',
    params: { fajr: 18.5, isha: '90 min' },
  }, // fajr was 19 degrees before 1430 hijri
  Karachi: {
    name: 'University of Islamic Sciences, Karachi',
    params: { fajr: 18, isha: 18 },
  },
  Tehran: {
    name: 'Institute of Geophysics, University of Tehran',
    params: { fajr: 17.7, isha: 14, maghrib: 4.5, midnight: 'Jafari' },
  }, // isha is not explicitly specified in this method
  Jafari: {
    name: 'Shia Ithna-Ashari, Leva Institute, Qum',
    params: { fajr: 16, isha: 14, maghrib: 4, midnight: 'Jafari' },
  },
  JAKIM: {
    name: 'Jabatan Kemajuan Islam Malaysia',
    params: { fajr: 20, isha: 18 },
  },
};

export const defaultTimes = {
  imsak: 5,
  fajr: 5,
  sunrise: 6,
  dhuhr: 12,
  asr: 13,
  asrHanafi: 14,
  sunset: 18,
  maghrib: 18,
  isha: 18,
};

export const defaultSettings = {
  imsak: '10 min',
  dhuhr: '0 min',
  maghrib: '0 min',
  midnight: 'Standard',
  highLats: 'NightMiddle',
};

export const offset = {
  imsak: 0,
  fajr: 0,
  sunrise: 0,
  dhuhr: 0,
  asr: 0,
  asrHanafi: 0,
  sunset: 0,
  maghrib: 0,
  isha: 0,
  midnight: 0,
};
