export function degreeToRadian(degree: number) {
  return (degree * Math.PI) / 180.0;
}

export function radianToDegree(radian: number) {
  return (radian * 180.0) / Math.PI;
}

export function sin(degree: number) {
  return Math.sin(degreeToRadian(degree));
}

export function cos(degree: number) {
  return Math.cos(degreeToRadian(degree));
}

export function tan(degree: number) {
  return Math.tan(degreeToRadian(degree));
}

export function arcsin(degree: number) {
  return radianToDegree(Math.asin(degree));
}

export function arccos(degree: number) {
  return radianToDegree(Math.acos(degree));
}

export function arctan(degree: number) {
  return radianToDegree(Math.atan(degree));
}

export function arccot(x: number) {
  return radianToDegree(Math.atan(1 / x));
}

export function arctan2(y: number, x: number) {
  return radianToDegree(Math.atan2(y, x));
}

export function fix(a: number, b: number) {
  let x = a;
  x -= b * Math.floor(a / b);
  return x < 0 ? x + b : x;
}

export function fixAngle(a: number) {
  return fix(a, 360);
}

export function fixHour(a: number) {
  return fix(a, 24);
}
