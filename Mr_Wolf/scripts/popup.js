window.onload = () => {
  const hours = document.querySelector("#hours");
  const start = document.querySelector("#start-time");

  hours.value = window.localStorage.getItem("hours") || 40;
  start.value = window.localStorage.getItem("start") || 8;

  document.querySelector("#submit").addEventListener("click", (event) => {
    event.preventDefault();
    setDefaultValues();
    sendValuesToBackground();
  });

  // function to get user input and save it in local storage
  function setDefaultValues() {
    window.localStorage.setItem("hours", hours.value);
    window.localStorage.setItem("start", start.value);
  }

  // Wrote a function to send stored default values to the service worker(listens to browser action)
  function sendValuesToBackground() {
    let hour = window.localStorage.getItem("hours");
    let start = window.localStorage.getItem("start");
    chrome.runtime.sendMessage({
      hours: hour,
      start: start,
      action: "default_values",
    });
  }
};
