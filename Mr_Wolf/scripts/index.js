// uncomment the following line to use Jest testing
// import { chrome } from "jest-chrome";
const testing = false;

function debug(name, value) {
  if (testing) {
    return console.log(`${name}: `, value);
  }
}

window.onload = () => {
  run();
};

/**
 * Runs the main function for calculating and displaying time-related information
 */
function run() {
  const today = new Date().getDay();

  const weeklyHours = parseInt(window.localStorage.getItem("hours")) || 40;
  const defaultStart = parseInt(window.localStorage.getItem("start")) || 8;

  const startAndEndTime = document
    .querySelectorAll("div.cal_day div.inner")
    [today]?.innerText.match(/\d\d.\d\d/gi);
  debug("startAndEndTime", startAndEndTime);

  const timeWorked = parseFloat(
    document.querySelector("span.data").innerText.match(/.\d.\d\d/)[0]
  );
  debug("timeWorked", timeWorked);

  const daysWorking = Array.from(
    document.querySelectorAll(".daily_summary")
  ).filter((e) => /\d+\.\d{2}/.test(e.innerText)).length;

  const daysLeftThisWeek = 5 - daysWorking < 0 ? 0 : 5 - daysWorking;
  debug("daysLeftThisWeek", daysLeftThisWeek);

  const timeLeftThisWeek = timeLeft(weeklyHours, timeWorked);
  debug("timeLeftThisWeek", timeLeftThisWeek);

  var weeklyHoursDividedByDays = timeLeftThisWeek / daysLeftThisWeek;
  debug("weeklyHoursDividedByDays Before", weeklyHoursDividedByDays);

  if (weeklyHoursDividedByDays == Infinity) {
    weeklyHoursDividedByDays = timeLeftThisWeek;
  }

  if (
    weeklyHoursDividedByDays == -Infinity ||
    isNaN(weeklyHoursDividedByDays)
  ) {
    weeklyHoursDividedByDays = 0;
  }

  if (!weeklyHoursDividedByDays) {
    weeklyHoursDividedByDays = 0;
  }

  debug("weeklyHoursDividedByDays After", weeklyHoursDividedByDays);

  // We have the day of the week at the top and use it to get the div with todays time.
  const startTimeInFloat = startTime(startAndEndTime, defaultStart);
  debug("startTimeInFloat", startTimeInFloat);

  // ---------------------------------------------------------------------------

  var breakDuration = 1;
  const breakElements = document.querySelectorAll(".cal_table_detail")[today];

  if (breakElements) {
    var breakArray = Array.from(
      document
        .querySelectorAll(".cal_table_detail")
        [today].querySelectorAll(".rest.text-middle")
    )
      .flatMap((e) => e.innerText.match(/\d\d.\d\d/g) || [])
      .filter((e) => e !== null);
  } else {
    var breakArray = [];
  }

  breakDuration = calculateBreak(breakArray);
  debug("breakDuration", breakDuration);

  let breakDurationString = "";
  if (breakDuration != 1) {
    breakDurationString = `: <strong>Break:</strong> ${numberToTime(
      breakDuration
    )}`;
  }

  var endTimeInString = endTime(
    weeklyHoursDividedByDays,
    breakDuration,
    startTimeInFloat,
    startAndEndTime,
    daysLeftThisWeek
  );
  debug("endTimeInString", endTimeInString);

  /**
   * Helper function to insert the display of time-related information into the HTML
   * @param {number} timeLeftThisWeek - the amount of time left to work this week
   * @param {number} weeklyHoursDividedByDays - the number of hours divided by days left this week
   * @param {string} endTimeInString - the calculated end time for the day
   * @param {string} breakDurationString - the formatted string for the break duration (if applicable)
   */
  insertDisplay(
    timeLeftThisWeek,
    weeklyHoursDividedByDays,
    endTimeInString,
    breakDurationString
  );
}

// Helper Functions ----------------------------------------------------------

function insertDisplay(
  timeLeftThisWeek,
  weeklyHoursDividedByDays,
  endTimeInString,
  breakDurationString
) {
  if (document.getElementById("mr-wolf-summary")) {
    document.getElementById(
      "mr-wolf-summary"
    ).innerHTML = `<strong>Hours left:</strong> ${numberToTime(
      timeLeftThisWeek
    )}/${numberToTime(
      weeklyHoursDividedByDays
    )} : <strong>Ending Time: </strong>${endTimeInString} ${breakDurationString}`;
  } else {
    const newSpan = document.createElement("span");
    newSpan.innerHTML = `<strong>Hours left:</strong> ${numberToTime(
      timeLeftThisWeek
    )}/${numberToTime(
      weeklyHoursDividedByDays
    )} : <strong>Ending Time:</strong> ${endTimeInString} ${breakDurationString}`;
    newSpan.style = "margin: 0 0 0 1rem; cursor: default;";
    newSpan.setAttribute("id", "mr-wolf-summary");

    const newStyle = document.createElement("style");
    newStyle.innerHTML = `@media screen and (max-width: 675px) {
      #mr-wolf-summary {
          display: block;
          margin: 1rem 0 0 0 !important;
      }
    }`;

    document
      .getElementById("btn_cal_check_show_summary_mode")
      .insertAdjacentElement("afterend", newSpan);
    document
      .getElementById("btn_cal_check_show_summary_mode")
      .insertAdjacentElement("afterend", newStyle);
  }
}

/**
 * Calculates the time left to work this week
 * @param {number} weeklyHours - the total number of hours to work in a week
 * @param {number} timeWorked - the amount of time already worked this week
 * @returns {number} - the time left to work this week
 */
function timeLeft(weeklyHours, timeWorked) {
  const calculatedTime = weeklyHours - timeWorked.toFixed(2);
  if (calculatedTime < 0 || calculatedTime === Infinity) {
    return 0.0;
  }

  return weeklyHours - timeWorked;
}

/**
 * Calculates the start time for the current day
 * @param {array} startAndEndTime - the array of start and end times for the current day
 * @param {number} defaultStart - the default start time (in hours) for the day
 * @returns {number} - the start time for the day
 */
function startTime(startAndEndTime, defaultStart) {
  // If day hasn't started or day is over we return the default start time.
  if (startAndEndTime == undefined) {
    return defaultStart;
  }

  // We then get the start time of today.
  let start = startAndEndTime[0];

  return isValidTime(start) ? timeToNumber(start) : defaultStart;
}

/**
 * Calculates the total break duration for the day
 * @param {array} breakArray - the array of break start and end times for the day
 * @returns {number} - the total break duration for the day
 */
function calculateBreak(breakArray) {
  if (!breakArray || breakArray.length % 2 !== 0) return 1;

  const breaks = [];
  for (let i = 0; i < breakArray.length; i += 2) {
    const startBreak = breakArray[i];
    const endBreak = breakArray[i + 1];

    if (isValidTime(startBreak) && isValidTime(endBreak)) {
      const start = timeToNumber(startBreak);
      const end = timeToNumber(endBreak);
      breaks.push(end - start);
    }
  }

  return breaks.length > 0 ? breaks.reduce((a, b) => a + b) : 1;
}

/**
 * Checks if a given time string is valid
 * @param {string} timeStr - the time string to check
 * @returns {boolean} - true if the time string is valid, false otherwise
 */
function isValidTime(timeStr) {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeStr);
}

/**
 * Converts a time string to a decimal number
 * @param {string} time - the time string to convert
 * @returns {number} - the decimal representation of the time string
 */
function timeToNumber(time) {
  const [hours, minutes] = time.split(":");
  return parseInt(hours, 10) + parseInt(minutes, 10) / 60;
}

/**
 * Converts a decimal number to a time string
 * @param {number} time - the decimal number to convert
 * @returns {string} - the time string representation of the decimal number
 */
function numberToTime(time) {
  const hours = Math.floor(time);
  const minutes = Math.round((time - hours) * 60);

  return `${hours}:${singleDigits(minutes)}`;
}

/**
 * Calculates the end time for the day
 * @param {number} weeklyHoursDividedByDays - the number of hours divided by days left this week
 * @param {number} breakDuration - the total break duration for the day
 * @param {number} startTimeInFloat - the start time for the day (in decimal form)
 * @param {array} startAndEndTime - the array of start and end times for the day
 * @param {number} daysLeftThisWeek - the number of days left to work this week
 * @returns {string} - the formatted end time for the day
 */
function endTime(
  weeklyHoursDividedByDays,
  breakDuration,
  startTimeInFloat,
  startAndEndTime,
  daysLeftThisWeek
) {
  if (startAndEndTime?.length > 2) {
    return "I can't work out when clocking in twice 🙇‍♂️";
  }

  if (startAndEndTime?.length == 2) {
    return "Have a Nice Evening 🦉";
  }

  if (weeklyHoursDividedByDays <= 0 || daysLeftThisWeek == 0) {
    breakDuration = "";
    return "Have a Nice Weekend 🚀";
  }

  var endTimeInFloat =
    weeklyHoursDividedByDays + breakDuration + startTimeInFloat;

  var endTimeInString = numberToTime(endTimeInFloat);

  return endTimeInString;
}

/**
 * Adds a leading 0 to a single-digit number
 * @param {number} params - the number to add a leading 0 to
 * @returns {string} - the number with a leading 0 (if applicable)
 */
function singleDigits(params) {
  if (params < 10) {
    return "0" + params;
  }
  return params;
}

// -----------------------------------------------------------------------------

// Checks if the user is on smaregi timecard and sends a message to background.js to run sendDefaultValues()
const check_url = setInterval(function () {
  if (window.location.href.includes("timecard1.smaregi.jp/staffs/dashboard")) {

    if (document.querySelectorAll(".week.cf.show_shift").length !== 1) {
      if (document.getElementById("mr-wolf-summary")) {
        document.getElementById("mr-wolf-summary").innerHTML =
          "Change to shift view to view summary";
      } else {
        const newDiv = document.createElement("span");
        newDiv.innerHTML = "Change to shift view to view summary";
        newDiv.style.margin = "1rem";
        newDiv.setAttribute("id", "mr-wolf-summary");

        document
          .getElementById("btn_cal_check_show_summary_mode")
          .insertAdjacentElement("afterend", newDiv);
      }
      return;
    }

    chrome.runtime.sendMessage({
      action: "on_smaregi",
    });
  }
}, 1000);

check_url;

// Gets the credentials from service worker(background.js) and saves them in session storage
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "back_default_values") {
    let back_hours = request.hours;
    let back_start = request.start;
    let back_clicked = request.clicked;

    if (back_clicked > Date.now() - 1000) {
      window.localStorage.setItem("hours", back_hours);
      window.localStorage.setItem("start", back_start);
      run();
    }

    if (
      back_hours != window.localStorage.getItem("hours", back_hours) ||
      back_start != window.localStorage.getItem("start", back_start)
    ) {
      window.localStorage.setItem("hours", back_hours);
      window.localStorage.setItem("start", back_start);
      run();
    }
  }
});

// define the callback function to be executed when changes are detected
const observerCallback = function (mutationsList) {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList" || mutation.target.classList.contains("week")) {
      run();
      break;
    }
  }
};

// create a new mutation observer and attach it to the #cal_table element
const targetNode = document.querySelector("#cal_table");
const observer = new MutationObserver(observerCallback);
const observerOptions = { childList: true, subtree: true, attributes: true };
observer.observe(targetNode, observerOptions);

// uncomment the following line to use Jest testing

// module.exports = {
//   timeLeft: timeLeft,
//   startTime: startTime,
//   calculateBreak: calculateBreak,
//   endTime: endTime,
//   singleDigits: singleDigits,
// };
