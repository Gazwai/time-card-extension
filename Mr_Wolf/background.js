/**
 * Listen for a message to set default values in storage
 * @function
 * @param {Object} request - The message payload
 * @param {Object} sender - Details about the sender of the message
 * @param {Function} sendResponse - A function to send a response back to the sender
 * @returns {boolean} true if the message was handled
 */
chrome.runtime.onMessage.addListener(setDefaultValues);

/**
 * Listen for a message to send default values to the active tab
 * @function
 * @param {Object} request - The message payload
 * @param {Object} sender - Details about the sender of the message
 * @param {Function} sendResponse - A function to send a response back to the sender
 * @returns {boolean} true if the message was handled
 */
chrome.runtime.onMessage.addListener(sendDefaultValuesIfOnSmaregi);

/**
 * Handles the "default_values" message to set default values in storage
 * @function
 * @param {Object} request - The message payload
 * @param {Object} sender - Details about the sender of the message
 * @param {Function} sendResponse - A function to send a response back to the sender
 * @returns {boolean} true if the message was handled
 */
function setDefaultValues(request, sender, sendResponse) {
  if (request.action === "default_values") {
    const { hours, start } = request;
    chrome.storage.sync.set({ hours, start }, () => {
    });
    return true;
  }
}

/**
 * Handles the "on_smaregi" message to send default values to the active tab
 * @function
 * @param {Object} request - The message payload
 * @param {Object} sender - Details about the sender of the message
 * @param {Function} sendResponse - A function to send a response back to the sender
 * @returns {boolean} true if the message was handled
 */
function sendDefaultValuesIfOnSmaregi(request, sender, sendResponse) {
  if (request.action === "on_smaregi") {
    sendDefaultValues();
    return true;
  }
}

/**
 * Sends default values to the active tab if it matches the smaregi URL pattern
 * @function
 */
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
  });
}
