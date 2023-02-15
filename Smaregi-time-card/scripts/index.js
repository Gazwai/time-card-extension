// Have an input for default start time
// Have an input for weekly hours

window.onload = (event) => {
  const today = new Date().getDay();

  //Works out time remaining for the week
  var timeLeftThisWeek = timeLeft(40);
  var weeklyHoursDividedByDays = timeLeftThisWeek / (6 - today);

  // ---------------------------------------------

  // We have the day of the week at the top and use it to get the div with todays time.
  const startTimeInFloat = todayHrAndMin();

  // Get break time in an Array and calculate the break
  var breakDuration = 1;

  calculateBreak();

  // Calculate the end time and put times into div

  var endTimeInString = endTime();

  const newDiv = document.createElement("span");
  newDiv.innerHTML = `Time left this week: ${timeLeftThisWeek} : Time remaining today: ${endTimeInString} / ${weeklyHoursDividedByDays}`;
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
    let start = document
      .querySelectorAll("div.cal_day div.inner")
      [today]?.innerText.match(/\d\d.\d\d/)?.[0]
      .split(":");

    return start ? parseFloat(start[0]) + parseFloat(start[1] / 60) : 8;
  }

  function calculateBreak() {
    var breakArray = document
      .querySelectorAll(".rest.text-middle")
      [today - 1]?.innerText.match(/\d\d.\d\d/g);

    // If only start time of break then skip
    if (breakArray && breakArray.length > 1) {
      // If two breaks then puts the two breaks into a separate array to be iterated through
      if (breakArray.length > 2) {
        var breakArray = [breakArray.slice(0, 2), breakArray.slice(2)];
      }

      breakArray.forEach((time) => {
        var todayBreakStart = time[0].split(":");
        var todayBreakEnd = time[1].split(":");

        var startBreakStartInFloat =
          parseFloat(todayBreakStart[0]) + parseFloat(todayBreakStart[1] / 60);
        var startBreakEndInFloat =
          parseFloat(todayBreakEnd[0]) + parseFloat(todayBreakEnd[1] / 60);

        breakDuration += parseFloat(
          (startBreakEndInFloat - startBreakStartInFloat).toFixed(2)
        );
      });
    }
  }

  function endTime() {
    var endTimeInFloat =
      weeklyHoursDividedByDays + breakDuration + startTimeInFloat;

    var endTimeInArray = endTimeInFloat.toFixed(2).split(".");

    return typeof endTimeInArray === "string"
      ? "Day Off 🚀"
      : `${endTimeInArray[0]}:${(
          parseFloat(endTimeInArray[1]) * 0.6
        ).toFixed()}`;
  }
};
