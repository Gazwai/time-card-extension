/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://jestjs.io/"}
 */

const {
  timeLeft,
  startTime,
  calculateBreak,
  endTime,
  singleDigits,
} = require("./index");

/**
 * Calculate the time left to work this week.
 * @param {number} weeklyHours - The number of hours the user is expected to work in a week.
 * @param {number} workedHours - The number of hours the user has already worked this week.
 * @returns {string} - The formatted time left to work this week.
 */
describe("timeLeft", () => {
  test("Beginning of the week: 40hrs - 0hr", () => {
    expect(timeLeft(40, 0)).toBe("40.00");
  });

  test("End of the week: 40hrs - 40hr", () => {
    expect(timeLeft(40, 40)).toBe("0.00");
  });

  test("Overtime: 40hrs - 41hr", () => {
    expect(timeLeft(40, 41)).toBe("0.00");
  });

  test("Custom weekly hours: 35hrs - 0hr", () => {
    expect(timeLeft(35, 0)).toBe("35.00");
  });

  test("Custom weekly hours: 45hrs - 45hr", () => {
    expect(timeLeft(45, 45)).toBe("0.00");
  });
});

/**
 * Get the start time from an array of time strings or use the default start time.
 * @param {string[]|undefined} timeArray - An array containing start time(s) as strings in the "HH:mm" format.
 * @param {number} defaultStart - A default start time as a number (e.g., 8 for 8 AM).
 * @returns {number} - The start time as a number (e.g., 9.25 for 9:15 AM).
 */
describe("startTime", () => {
  test("No Start Time", () => {
    expect(startTime(undefined, 8)).toBe(8);
  });

  test("Only Start Time", () => {
    expect(startTime(["09:00"], 8)).toBe(9);
  });

  // Cannot calculate end time if you have multiple start times. So will be handled later with message.
  test("Multiple Start Times", () => {
    expect(startTime(["09:00", "10:00", "11:00"], 8)).toBe(9);
  });

  test("Start time with leading zero", () => {
    expect(startTime(["07:30"], 8)).toBe(7.5);
  });

  test("Start time with non-zero minutes", () => {
    expect(startTime(["09:15"], 8)).toBe(9.25);
  });

  test("Custom default start time: 7", () => {
    expect(startTime(undefined, 7)).toBe(7);
  });

  test("Custom default start time: 9", () => {
    expect(startTime(undefined, 9)).toBe(9);
  });
});

/**
 * Calculate the total duration of breaks in hours.
 * @param {string[]|undefined} breakArray - An array containing break time(s) as strings in the "HH:mm" format.
 * @returns {number} - The total duration of breaks in hours.
 */
describe("calculateBreak", () => {
  test("No break", () => {
    expect(calculateBreak(undefined)).toBe(1);
  });

  test("One break", () => {
    expect(calculateBreak(["12:00", "13:00"])).toBe(1);
  });

  test("Multiple breaks, odd", () => {
    expect(calculateBreak(["12:00", "13:00", "17:00"])).toBe(1);
  });

  test("Multiple breaks, even", () => {
    expect(calculateBreak(["12:00", "13:00", "17:00", "18:00"])).toBe(2.0);
  });
  test("Multiple breaks, even", () => {
    expect(
      calculateBreak(["12:00", "13:00", "17:00", "18:00", "18:30", "19:00"])
    ).toBe(2.5);
  });

  test("Invalid break array input", () => {
    expect(calculateBreak(["12:00", "invalid"])).toBe(1); // Assuming 1 is the default break duration
  });
});

/**
 * Calculate the end time based on hours left, break duration, start time, and clock in/out times.
 * @param {number} hoursLeft - The number of hours left for the user to work this week.
 * @param {number} breakDuration - The total duration of breaks in hours.
 * @param {number} start - The start time as a number (e.g., 9.25 for 9:15 AM).
 * @param {string[]|undefined} timeArray - An array containing clock in/out times as strings in the "HH:mm" format.
 * @returns {string} - A message with the end time or an appropriate status message.
 */
describe("endTime", () => {
  test("Still at work: endTime, weeklyhr-break-start-time", () => {
    expect(endTime(8, 1, 8, ["08:00"])).toBe("Ending Time: 17:00");
  });

  test("Finished Work", () => {
    expect(endTime(8, 1, 9, ["08:00", "17:00"])).toBe("Have a Nice Evening 🦉");
  });

  test("When on the end of the week", () => {
    expect(endTime(-1, 1, 9, undefined)).toBe("Have a Nice Weekend 🚀");
  });

  test("When clocked in twice in one day", () => {
    expect(endTime(8, 1, 9, ["08:00", "17:00", "18:00"])).toBe(
      "I can't work out when clocking in twice 🙇‍♂️"
    );
  });

  test("Negative hours", () => {
    expect(endTime(-2, 1, 9, undefined)).toBe("Have a Nice Weekend 🚀");
  });
});

/**
 * Format a number to ensure it has two digits (e.g., 8 -> "08").
 * @param {number} number - A number to format.
 * @returns {string|number} - The formatted number as a string or the original number if it has two or more digits.
 */
describe("singleDigits", () => {
  test("returns 24hrs for single digits", () => {
    expect(singleDigits(8)).toBe("08");
  });

  test("returns 24hrs for double digits", () => {
    expect(singleDigits(12)).toBe(12);
  });

  test("returns 00 for 0", () => {
    expect(singleDigits(0)).toBe("00");
  });

  test("returns 59 for 59", () => {
    expect(singleDigits(59)).toBe(59);
  });
});

describe("Performance tests", () => {
  test("startTime performance", () => {
    const startTimeArray = ["09:15"];
    const defaultStart = 8;

    const startTimeBefore = performance.now();
    startTime(startTimeArray, defaultStart);
    const startTimeAfter = performance.now();

    const elapsedTime = startTimeAfter - startTimeBefore;
    expect(elapsedTime).toBeLessThan(50); // Make sure the function executes in less than 50 milliseconds
  });
});
