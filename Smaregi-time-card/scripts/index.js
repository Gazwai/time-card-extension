window.onload = (event) => {
  //Works out time remaining for the week
  var timeLeft = 0

  var timeWorked = parseFloat(document.querySelector("span.data").innerText.match(/\d\d.\d\d/)[0]);
  var timeLeft = 40 - timeWorked;

  const newDiv = document.createElement("span");
  newDiv.innerHTML = `残り時間: ${timeLeft}時間`;
  newDiv.style.margin = "1rem";

  document.getElementById("btn_cal_check_show_summary_mode").insertAdjacentElement('afterend', newDiv);
  // ---------------------------------------------

  // Works out time remaining for the day
  // First we get the day of the week and use it to get the div with todays time.
  const date = new Date();
  const today = date.getDay()

  // We then get the time worked today and subtract it from the 8 hours we work a day.
  var todayHrAndMin = document
    .querySelectorAll("div.cal_day div.inner")[4]
    .innerText.match(/\d\d.\d\d/)[0].split(":");

  // Time would convert 9:10 to 9.16666666
  var startTimeInFloat = parseFloat(todayHrAndMin[0]) + parseFloat(todayHrAndMin[1] / 60);




  // 👇️ Get the time now and convert it to a float similar to the above
  date.toLocaleString("ja-JA", {
    timeStyle: "short",
    hour12: false,
  });

  const newTime = date.getHours() + date.getMinutes() / 60;
};
