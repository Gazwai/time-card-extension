// uncomment the following line to use Jest testing
// import { chrome } from "jest-chrome";

window.onload = () => {
  run();
};

function run() {
  const today = new Date().getDay();

  const weeklyHours = parseInt(window.localStorage.getItem("hours")) || 40;
  const defaultStart = parseInt(window.localStorage.getItem("start")) || 8;

  // returns an array of start and end time. (2) ["09:27", "17:52"]. If empty returns undefined.
  const startAndEndTime = document
    .querySelectorAll("div.cal_day div.inner")
    [today]?.innerText.match(/\d\d.\d\d/gi);

  const timeWorked = parseFloat(
    document.querySelector("span.data").innerText.match(/.\d.\d\d/)[0]
  );

  const timeLeftThisWeek = timeLeft(weeklyHours, timeWorked);

  // If the day is over we return the default start time for the next morning.
  const daysLeftThisWeek =
    startAndEndTime?.length % 2 === 0 ? 5 - today : 6 - today;

var weeklyHoursDividedByDays = timeLeftThisWeek / daysLeftThisWeek;

// At the start of the week the time is 0 so 40 /0 = infinity. This fixes that.
if (weeklyHoursDividedByDays == Infinity) {
  weeklyHoursDividedByDays = weeklyHours / 5;
}

if (weeklyHoursDividedByDays == -Infinity || isNaN(weeklyHoursDividedByDays)) {
  weeklyHoursDividedByDays = 0;
}

if (!weeklyHoursDividedByDays) {
  weeklyHoursDividedByDays = 0;
}

  // We have the day of the week at the top and use it to get the div with todays time.
  const startTimeInFloat = startTime(startAndEndTime, defaultStart);

  // ---------------------------------------------------------------------------

  // Get break time in an Array and calculate the break
  var breakDuration = 1;

  var breakArray = Array.from(
    document
      .querySelectorAll(".cal_table_detail")
      [today].querySelectorAll(".rest.text-middle")
  )
    .flatMap((e) => e.innerText.match(/\d\d.\d\d/g) || [])
    .filter((e) => e !== null);

  breakDuration = calculateBreak(breakArray);

  // Calculate the end time and put times into div
  var endTimeInString = endTime(
    weeklyHoursDividedByDays,
    breakDuration,
    startTimeInFloat
  );

  insertDisplay(timeLeftThisWeek, weeklyHoursDividedByDays, endTimeInString);
}

// Helper Functions ----------------------------------------------------------

function insertDisplay(
  timeLeftThisWeek,
  weeklyHoursDividedByDays,
  endTimeInString
) {
  if (document.getElementById("mr-wolf-summary")) {
    document.getElementById(
      "mr-wolf-summary"
    ).innerHTML = `Hours left: ${timeLeftThisWeek}/${weeklyHoursDividedByDays.toFixed(
      2
    )} : ${endTimeInString}`;
  } else {
    const newDiv = document.createElement("span");
    newDiv.innerHTML = `Hours left: ${timeLeftThisWeek}/${weeklyHoursDividedByDays.toFixed(
      2
    )} : ${endTimeInString}`;
    newDiv.style.margin = "1rem";
    newDiv.setAttribute("id", "mr-wolf-summary");

    document
      .getElementById("btn_cal_check_show_summary_mode")
      .insertAdjacentElement("afterend", newDiv);
  }
}

//Works out time remaining for the week. Returns a float
function timeLeft(weeklyHours, timeWorked) {
  const calculatedTime = weeklyHours - timeWorked.toFixed(2);
  if (calculatedTime < 0) {
    return "0.00";
  }

  return (weeklyHours - timeWorked).toFixed(2);
}

function startTime(startAndEndTime, defaultStart) {
  // If day hasn't started or day is over we return the default start time.
  if (startAndEndTime == undefined) {
    return defaultStart;
  }

  // We then get the start time of today.
  let start = startAndEndTime[0];

  return isValidTime(start) ? timeToNumber(start) : defaultStart;
}

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

function isValidTime(timeStr) {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeStr);
}

function timeToNumber(time) {
  const [hours, minutes] = time.split(":");
  return parseInt(hours, 10) + parseInt(minutes, 10) / 60;
}

function timeToString(time) {
  const hours = Math.floor(time);
  const minutes = Math.round((time - hours) * 60);

  return `${hours}:${singleDigits(minutes)}`;
}

function endTime(
  weeklyHoursDividedByDays,
  breakDuration,
  startTimeInFloat,
  startAndEndTime
) {
  if (startAndEndTime?.length > 2) {
    return "I can't work out when clocking in twice 🙇‍♂️";
  }

  if (startAndEndTime?.length == 2) {
    return "Have a Nice Evening 🦉";
  }

  if (weeklyHoursDividedByDays <= 0) {
    return "Have a Nice Weekend 🚀";
  }

  var endTimeInFloat =
    weeklyHoursDividedByDays + breakDuration + startTimeInFloat;

  var endTimeInString = timeToString(endTimeInFloat);

  return `Ending Time: ${endTimeInString}`;
}

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

// uncomment the following line to use Jest testing

// module.exports = {
//   timeLeft: timeLeft,
//   startTime: startTime,
//   calculateBreak: calculateBreak,
//   endTime: endTime,
//   singleDigits: singleDigits,
// };
