export function degreeToRadian(degree) {
  return (degree * Math.PI) / 180.0;
}

export function radianToDegree(radian) {
  return (radian * 180.0) / Math.PI;
}

export function sin(degree) {
  return Math.sin(degreeToRadian(degree));
}

export function cos(degree) {
  return Math.cos(degreeToRadian(degree));
}

export function tan(degree) {
  return Math.tan(degreeToRadian(degree));
}

export function arcsin(degree) {
  return radianToDegree(Math.asin(degree));
}

export function arccos(degree) {
  return radianToDegree(Math.acos(degree));
}

export function arctan(degree) {
  return radianToDegree(Math.atan(degree));
}

export function arccot(x) {
  return radianToDegree(Math.atan(1 / x));
}

export function arctan2(y, x) {
  return radianToDegree(Math.atan2(y, x));
}

export function fix(a, b) {
  let x = a;
  x -= b * Math.floor(a / b);
  return x < 0 ? x + b : x;
}

export function fixAngle(a) {
  return fix(a, 360);
}

export function fixHour(a) {
  return fix(a, 24);
}
