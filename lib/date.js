export function isSameMinute(date1, date2) {
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();

  const ONE_MINUTE = 60 * 1000;

  return Math.abs(d2 - d1) < ONE_MINUTE;
}
