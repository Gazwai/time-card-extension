window.onload = () => {
  const hoursInput = document.querySelector("#hours");
  const startInput = document.querySelector("#start-time");

  hoursInput.value = localStorage.getItem("hours") || 40;
  startInput.value = localStorage.getItem("start") || 8;

  const submitButton = document.querySelector("#submit");
  submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    saveDefaultValues();
    sendValuesToBackground();
  });

  function saveDefaultValues() {
    localStorage.setItem("hours", hoursInput.value);
    localStorage.setItem("start", startInput.value);
  }

  function sendValuesToBackground() {
    const hours = localStorage.getItem("hours");
    const start = localStorage.getItem("start");
    chrome.runtime.sendMessage({ hours, start, action: "default_values" });
  }
};
