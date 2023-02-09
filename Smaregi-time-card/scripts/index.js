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

  const date = new Date();

  const today = date.getDay()

  var todayHrAndMin = document
    .querySelectorAll("div.cal_day div.inner")[4]
    .innerText.match(/\d\d.\d\d/)[0].split(":");



  // 👇️ 0.31
  date.toLocaleString("ja-JA", {
    timeStyle: "short",
    hour12: false,
  });

  const newTime = date.getHours() + date.getMinutes() / 60;

  // var time = 0
  // document
  //   .querySelectorAll("div.daily_summary")
  //   .forEach((e) => {
  //   if (e.outerText == false) {
  //     return
  //   }

  //   time += parseFloat(e.outerText)
  // });

  // console.log(time)
};
