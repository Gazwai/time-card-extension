window.onload = (event) => {
  //Works out time remaining for the week
  var timeLeft = 0

  var timeWorked = parseFloat(document.querySelector("span.data").innerText.match(/\d\d.\d\d/)[0]);
  var timeLeft = 40 - timeWorked;

  // ---------------------------------------------

  // Works out time remaining for the day
  // First we get the day of the week and use it to get the div with todays time.
  const date = new Date();
  const today = date.getDay()

  // We then get the time worked today and subtract it from the 8 hours we work a day plus a 1 hour lunch break.
  var todayHrAndMin = document
    .querySelectorAll("div.cal_day div.inner")[today]
    .innerText.match(/\d\d.\d\d/)[0].split(":");

  // Get break time in an Array
  var breakArray = document.querySelectorAll(".rest.text-middle")[today - 1].innerText.match(/\d\d.\d\d/g)
  var breakDuration = 1

  // If only start time of break then skip
  if (breakArray.length > 1) {
    var todayBreakStart = breakArray[0].split(":")
    var todayBreakEnd = breakArray[1].split(":")
    var startBreakStartInFloat =
      parseFloat(todayBreakStart[0]) + parseFloat(todayBreakStart[1] / 60);
    var startBreakEndInFloat =
      parseFloat(todayBreakEnd[0]) + parseFloat(todayBreakEnd[1] / 60);

    var breakDuration = parseFloat((startBreakEndInFloat - startBreakStartInFloat).toFixed(2));
  }





  // Time would convert 9:10 to 9.16666666
  var startTimeInFloat = parseFloat(todayHrAndMin[0]) + parseFloat(todayHrAndMin[1] / 60);
  var endTimeInFloat = 8 + breakDuration + startTimeInFloat;
  var endTimeInArray = endTimeInFloat.toFixed(2).split(".");
  var endTimeInString = `${endTimeInArray[0]}:${(
    parseFloat(endTimeInArray[1]) * 0.6
  ).toFixed()}`;

  const newDiv = document.createElement("span");
  newDiv.innerHTML = `残り時間: ${timeLeft}時間 : 今日の残り時間: ${endTimeInString}`;
  newDiv.style.margin = "1rem";

  document
    .getElementById("btn_cal_check_show_summary_mode")
    .insertAdjacentElement("afterend", newDiv);

  // 👇️ Get the time now and convert it to a float similar to the above
  date.toLocaleString("ja-JA", {
    timeStyle: "short",
    hour12: false,
  });

  const newTime = date.getHours() + date.getMinutes() / 60;
};
