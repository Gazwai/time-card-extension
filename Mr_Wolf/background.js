// Listen for a message to set default values in storage
chrome.runtime.onMessage.addListener(setDefaultValues);

// Listen for a message to send default values to the active tab
chrome.runtime.onMessage.addListener(sendDefaultValuesIfOnSmaregi);

function setDefaultValues(request, sender, sendResponse) {
  if (request.action === "default_values") {
    const { hours, start } = request;
    chrome.storage.sync.set({ hours, start }, () => {
      console.log("Setting values");
    });
    return true;
  }
}

function sendDefaultValuesIfOnSmaregi(request, sender, sendResponse) {
  if (request.action === "on_smaregi") {
    console.log("Connected");
    sendDefaultValues();
    return true;
  }
}

function sendDefaultValues() {
  chrome.storage.sync.get(["hours", "start"], ({ hours, start }) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs.find((tab) =>
        tab.url?.match("https://timecard1.smaregi.jp/staffs/dashboard/*")
      );
      if (tab) {
        const { id } = tab;
        chrome.tabs.sendMessage(id, {
          hours,
          start,
          action: "back_default_values",
        });
      }
    });
    console.log("Getting values");
  });
}
