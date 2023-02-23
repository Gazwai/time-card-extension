window.onload = (event) => {
  elem.addEventListener("click", (event) => {
    event.preventDefault();
    setEmail_Apitoken();
    authFunction();
    sendAuth_userMsg_background();
  });

  const today = new Date().getDay();

  const startAndEndTime = document
    .querySelectorAll("div.cal_day div.inner")
    [today]?.innerText.match(/\d\d.\d\d/gi);

  //Works out time remaining for the week
  var timeLeftThisWeek = timeLeft(40);
  var weeklyHoursDividedByDays = timeLeftThisWeek / daysLeftThisWeek(today);

  function daysLeftThisWeek(today) {
    if (startAndEndTime?.length == 2) {
      return 5 - today;
    }
    return 6 - today;
  }

  // ---------------------------------------------

  // We have the day of the week at the top and use it to get the div with todays time.
  const startTimeInFloat = todayHrAndMin();

  // Get break time in an Array and calculate the break
  var breakDuration = 1;

  var breakArray = document
    .querySelectorAll(".rest.text-middle")
    [today - 1]?.innerText.match(/\d\d.\d\d/g);

  if (breakArray != null && breakArray.length > 2) {
    var breakArray = [breakArray.slice(0, 2), breakArray.slice(2)];

    breakArray.forEach((ele) => {
      calculateBreak(ele);
    });
  }

  // Calculate the end time and put times into div

  var endTimeInString = endTime();

  const newDiv = document.createElement("span");
  newDiv.innerHTML = `Hours left: ${timeLeftThisWeek}/${weeklyHoursDividedByDays.toFixed(
    2
  )} : Ending Time: ${endTimeInString}pm`;
  newDiv.style.margin = "1rem";

  document
    .getElementById("btn_cal_check_show_summary_mode")
    .insertAdjacentElement("afterend", newDiv);

  // Helper Functions ---------------------------------------------

  function timeLeft(weeklyHours) {
    const timeWorked = parseFloat(
      document.querySelector("span.data").innerText.match(/.\d.\d\d/)[0]
    );
    return (weeklyHours - timeWorked).toFixed(2);
  }

  function todayHrAndMin() {
    // We then get the time worked today and subtract it from the 8 hours we work a day plus a 1 hour lunch break.
    if (startAndEndTime?.length == 2) {
      return 8;
    }

    let start = startAndEndTime?.[0].split(":");

    return start ? parseFloat(start[0]) + parseFloat(start[1] / 60) : 8;
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

  function endTime() {
    var endTimeInFloat =
      weeklyHoursDividedByDays + breakDuration + startTimeInFloat;

    var endTimeInArray = endTimeInFloat.toFixed(2).split(".");

    return typeof endTimeInArray === "string"
      ? "Day Off 🚀"
      : `${endTimeInArray[0]}:${singleDigits(
          Math.round(endTimeInArray[1] * 0.6)
        )}`;
  }

  function singleDigits(params) {
    if (params < 10) {
      return "0" + params;
    }
    return params;
  }

  // ---------------------------------------------

  // function to get user input and save it in local storage
  function setDefaultValues() {
    window.localStorage.setItem(
      "hours",
      document.getElementById("form_email").value
    );
    window.localStorage.setItem(
      "start-time",
      document.getElementById("form_api_token").value
    );
    document.getElementById("hours").value = "";
    document.getElementById("start-time").value = "";
  }

  // Wrote a function to send stored email & api token to the service worker(listens to browser action)
  function sendAuth_userMsg_background() {
    let pop_u = window.localStorage.getItem("user");
    let pop_t = window.localStorage.getItem("api_token");
    let pop_c = window.localStorage.getItem("child_user");
    chrome.runtime.sendMessage({
      name: pop_u,
      token: pop_t,
      child: pop_c,
      action: "pop_auth",
    });
  }
};
