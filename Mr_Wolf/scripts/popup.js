// Send a message to the active tab to 'toggleDarkify'
function sendtoggleDarkifyMsg() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // Finds tabs that are active in the current window
    chrome.tabs.sendMessage(tabs[0].id, { action: "toggleDarkify" }); // Sends a message (object) to the first tab (tabs[0])
  });
}

// Trigger the function above when clicking the 'toggleDarkify' button
document
  .querySelector("[data-target-darkify='toggleDarkify']")
  .addEventListener("change", () => sendtoggleDarkifyMsg());

window.onload = (event) => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    if (!tabs[0].url.includes("myshopify.com")) {
      document.querySelector(
        "[data-target-darkify='toggleDarkify']"
      ).disabled = true;

      return;
    }

    onloadDarkifyStatusMsg();
  });
};

function onloadDarkifyStatusMsg() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // Finds tabs that are active in the current window
    const response = chrome.tabs.sendMessage(tabs[0].id, {
      action: "onloadDarkifyStatus",
    }); // Sends a message (object) to the first tab (tabs[0])

    response.then((res) => {
      window.localStorage.setItem("darkify_status", res.darkify_status);
      if (res.darkify_status == "on") {
        document.querySelector(
          "[data-target-darkify='toggleDarkify']"
        ).checked = true;
      }
    });
  });
}
