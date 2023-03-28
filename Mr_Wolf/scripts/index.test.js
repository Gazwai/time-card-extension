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

test("Beginning of the week: 40hrs - 0hr", () => {
  expect(timeLeft(40, 0)).toBe("40.00");
});

test("End of the week: 40hrs - 40hr", () => {
  expect(timeLeft(40, 40)).toBe("0.00");
});

test("Overtime: 40hrs - 41hr", () => {
  expect(timeLeft(40, 41)).toBe("0.00");
});

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

test("No break", () => {
  expect(calculateBreak(undefined, 0)).toBe(1);
});

test("One break", () => {
  expect(calculateBreak(["12:00", "13:00"], 0)).toBe(1);
});

test("Multiple breaks, odd", () => {
  expect(calculateBreak(["12:00", "13:00", "17:00"], 0)).toBe(1);
});

test("Multiple breaks, even", () => {
  expect(calculateBreak(["12:00", "13:00", "17:00", "18:00"], 0)).toBe(2.00);
});

test("Still at work: endTime, weeklyhr-break-start-time", () => {
  expect(endTime(8, 1, 8, ["08:00"])).toBe("Ending Time: 17:00");
});

test("endTime", () => {
  expect(endTime(8, 1, 9, ["08:00", "17:00"])).toBe("Have a Nice Evening 🦉");
});

test("endTime", () => {
  expect(endTime(-1, 1, 9, undefined)).toBe("Have a Nice Weekend 🚀");
});

test("endTime", () => {
  expect(endTime(8, 1, 9, ["08:00", "17:00", "18:00"])).toBe(
    "I can't work out when clocking in twice 🙇‍♂️"
  );
});

test("returns 24hrs for single digits", () => {
  expect(singleDigits(8)).toBe("08");
});

test("returns 24hrs for double digits", () => {
  expect(singleDigits(12)).toBe(12);
});
