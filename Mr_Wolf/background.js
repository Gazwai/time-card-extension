chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "default_values") {
    let service_worker_hours = request.hours;
    let service_worker_start = request.start;
    chrome.storage.sync.set({
      hours: service_worker_hours,
      start: service_worker_start,
    });
    console.log("setting values");
    return true;
  }
});

// Wrote a function to send stored default values to the active tab if the url has smaregi timecard, checks every 1 seconds
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "on_smaregi") {
    console.log("connected");
    sendDefaultValues();
  }
  return true;
});

function sendDefaultValues() {
  chrome.storage.sync.get(["hours", "start"], function (data) {
    let back_hours = data.hours;
    let back_start = data.start;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (
        tabs[0].url?.match("https://timecard1.smaregi.jp/staffs/dashboard/*")
      ) {
        chrome.tabs.sendMessage(tabs[0]?.id, {
          hours: back_hours,
          start: back_start,
          action: "back_default_values",
        });
      }
    });
    console.log("getting values");
  });
}
