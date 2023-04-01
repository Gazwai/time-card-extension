/**
 * Sets default values for hours and start time input fields and sends them to a background service worker.
 * @function
 * @returns {void}
 */
window.onload = () => {
  // Get references to the input fields for hours and start time
  const hoursInput = document.querySelector("#hours");
  const startInput = document.querySelector("#start-time");

  // Set default values for input fields if not already set by user
  hoursInput.value = localStorage.getItem("hours") || 40;
  startInput.value = localStorage.getItem("start") || 8;

  // Get reference to the submit button and add an event listener
  const submitButton = document.querySelector("#submit");
  submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    // Save default values to local storage
    saveDefaultValues();
    // Send default values to the background service worker
    sendValuesToBackground();
  });

  /**
   * Saves default values for hours and start time to local storage.
   * @function
   * @returns {void}
   */
  function saveDefaultValues() {
    localStorage.setItem("hours", hoursInput.value);
    localStorage.setItem("start", startInput.value);
  }

  /**
   * Sends default values for hours and start time to the background service worker.
   * @function
   * @returns {void}
   */
  function sendValuesToBackground() {
    const hours = localStorage.getItem("hours");
    const start = localStorage.getItem("start");
    const clicked = Date.now();
    // Send message to the background service worker with default values and action type
    chrome.runtime.sendMessage({
      hours,
      start,
      clicked,
      action: "default_values",
    });
  }
};

document.getElementById("submit").addEventListener("click", function () {
  const spinner = document.getElementById("spinner");
  const submit = document.getElementById("submit");
  submit.style.display = "none";
  spinner.style.display = "inline-block";

  setTimeout(() => {
    spinner.style.display = "none";
    submit.style.display = "inline-block";
    window.close();
  }, 1000); // Set the duration for which the spinner will be displayed (e.g., 1 seconds)
});
