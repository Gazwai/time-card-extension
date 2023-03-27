window.onload = () => {
  run();
};

function run() {
  if (document.querySelector(".week.cf.show_shift") == undefined) {
    return console.log("Change to shift view");
  }

  const today = new Date().getDay();
  const weeklyHours = parseInt(window.localStorage.getItem("hours")) || 40;
  const defaultStart = parseInt(window.localStorage.getItem("start")) || 8;

  if (document.querySelectorAll("div.cal_day div.inner")[today]) {
    var startAndEndTime = document
      .querySelectorAll("div.cal_day div.inner")
      [today].innerText.match(/\d\d.\d\d/gi);
  } else {
    console.log("No time found");
  }
  //Works out time remaining for the week
  const timeLeftThisWeek = timeLeft(weeklyHours);

  var weeklyHoursDividedByDays =
  timeLeftThisWeek / daysLeftThisWeek(today, startAndEndTime);

  // At the start of the week the time is 0
  if (weeklyHoursDividedByDays == Infinity) {
    var weeklyHoursDividedByDays = weeklyHours / 5;
  }

  if (weeklyHoursDividedByDays == -Infinity || NaN) {
    var weeklyHoursDividedByDays = 0;
  }

  // We have the day of the week at the top and use it to get the div with todays time.
  const startTimeInFloat = todayHrAndMin(startAndEndTime);

  // ---------------------------------------------------------------------------

  // Get break time in an Array and calculate the break
  var breakDuration = 1;

  if (document.querySelectorAll(".rest.text-middle")[today - 1]) {
    var breakArray = document
      .querySelectorAll(".rest.text-middle")
      [today - 1].innerText.match(/\d\d.\d\d/g);
  } else {
    console.log("No break found");
  }

  if (breakArray != null && breakArray.length > 2) {
    var breakArray = [breakArray.slice(0, 2), breakArray.slice(2)];

    breakArray.forEach((ele) => {
      calculateBreak(ele);
    });

    console.log("breakDureation", breakDuration);
  }

  // Calculate the end time and put times into div

  var endTimeInString = endTime(
    weeklyHoursDividedByDays,
    breakDuration,
    startTimeInFloat
  );

  if (document.getElementById("mr-worlf-summary")) {
    document.getElementById(
      "mr-worlf-summary"
    ).innerHTML = `Hours left: ${timeLeftThisWeek}/${weeklyHoursDividedByDays.toFixed(
      2
    )} : ${endTimeInString}`;
  } else {
    const newDiv = document.createElement("span");
    newDiv.innerHTML = `Hours left: ${timeLeftThisWeek}/${weeklyHoursDividedByDays.toFixed(
      2
    )} : ${endTimeInString}`;
    newDiv.style.margin = "1rem";
    newDiv.setAttribute("id", "mr-worlf-summary");

    document
      .getElementById("btn_cal_check_show_summary_mode")
      .insertAdjacentElement("afterend", newDiv);
  }

  // Helper Functions ----------------------------------------------------------

  function daysLeftThisWeek(today, startAndEndTime) {
    if (startAndEndTime == undefined) {
      return console.log("No time found");
    }

    if (startAndEndTime.length == 2) {
      return 5 - today;
    }

    return 6 - today;
  }

  function timeLeft(weeklyHours) {
    const timeWorked = parseFloat(
      document.querySelector("span.data").innerText.match(/.\d.\d\d/)[0]
    );
    return (weeklyHours - timeWorked).toFixed(2);
  }

  function todayHrAndMin(startAndEndTime) {
    // If the day is over we return the default start time for the next morning

    if (startAndEndTime == undefined) {
      return console.log("No time found");
    }

    if (startAndEndTime.length == 2) {
      return defaultStart;
    }

    // We then get the time worked today and subtract it from the 8 hours we work a day plus a 1 hour lunch break.
    let start = startAndEndTime[0].split(":");

    return start
      ? parseFloat(start[0]) + parseFloat(start[1] / 60)
      : defaultStart;
  }

  function calculateBreak(time) {
    var todayBreakStart = time[0].split(":");
    var startBreakStartInFloat =
      parseFloat(todayBreakStart[0]) + parseFloat(todayBreakStart[1] / 60);

    var todayBreakEnd = time[1].split(":");
    var startBreakEndInFloat =
      parseFloat(todayBreakEnd[0]) + parseFloat(todayBreakEnd[1] / 60);

    breakDuration += parseFloat(
      (startBreakEndInFloat - startBreakStartInFloat).toFixed(2)
    );
  }

  function endTime(weeklyHoursDividedByDays, breakDuration, startTimeInFloat) {
    if (weeklyHoursDividedByDays <= 0) {
      return "Have a Nice Weekend 🚀";
    }

    var endTimeInFloat =
      weeklyHoursDividedByDays + breakDuration + startTimeInFloat;

    var endTimeInArray = endTimeInFloat.toFixed(2).split(".");

    return typeof endTimeInArray === "string"
      ? "Day Off 🚀"
      : `Ending Time: ${endTimeInArray[0]}:${singleDigits(
          Math.round(endTimeInArray[1] * 0.6)
        )}`;
  }

  function singleDigits(params) {
    if (params < 10) {
      return "0" + params;
    }
    return params;
  }
}

// -----------------------------------------------------------------------------

// Checks if the user is on smaregi timecard and sends a message to background.js to run sendDefaultValues()
const check_url = setInterval(function () {
  if (window.location.href.includes("timecard1.smaregi.jp/staffs/dashboard")) {
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
