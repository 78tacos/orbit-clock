/**
 * Analog-orbit time mapping. Shared by the clock and smoke tests.
 * Angles are clockwise degrees with 12 o'clock as 0.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.OrbitTime = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function pad2(value) {
    return String(value).padStart(2, "0");
  }

  /**
   * @param {Date} date
   * @returns {{
   *   hoursDeg: number,
   *   minutesDeg: number,
   *   secondsDeg: number,
   *   hours24: number,
   *   minutes: number,
   *   seconds: number,
   *   digital: string,
   * }}
   */
  function anglesFromDate(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      throw new TypeError("anglesFromDate expects a valid Date");
    }

    const hours24 = date.getHours();
    const hours12 = hours24 % 12;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();

    const secondFraction = seconds + milliseconds / 1000;
    const minuteFraction = minutes + secondFraction / 60;
    const hourFraction = hours12 + minuteFraction / 60;

    return {
      hoursDeg: hourFraction * 30,
      minutesDeg: minuteFraction * 6,
      secondsDeg: secondFraction * 6,
      hours24,
      minutes,
      seconds,
      digital: pad2(hours24) + ":" + pad2(minutes) + ":" + pad2(seconds),
    };
  }

  return { anglesFromDate, pad2 };
});
