window.onload = (event) => {
  let darkify_local_status = window.localStorage.getItem("darkify");

  if (darkify_local_status === "on") {
    onloadDarkify();
  }
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "onloadURI") {
    let onShopifyAdmin = location.host.includes("myshopify.com");
    sendResponse({ onShopifyAdmin: onShopifyAdmin });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "onloadDarkifyStatus") {
    let darkify_local_status = window.localStorage.getItem("darkify");
    sendResponse({ darkify_status: darkify_local_status });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "toggleDarkify") toggleDarkify();
});

function toggleDarkify() {
  let darkMode = window.localStorage.getItem("darkify");
  let media = document.querySelectorAll("img, picture, video");
  let iframes = document.querySelectorAll("iframe");


  if (darkMode === "on") {
    document.querySelector("html").style.filter = "";

    media.forEach((element) => {
      element.style.filter = "";
    });

    anyIframes(iframes, false);
    window.localStorage.setItem("darkify", "off");
    return;
  }

  document.querySelector("html").style.filter = "invert(1) hue-rotate(180deg)";

  media.forEach((element) => {
    element.style.filter = "invert(1) hue-rotate(180deg)";
    element.style.opacity = "1";
  });

  anyIframes(iframes, true);

  window.localStorage.setItem("darkify", "on");
}

function onloadDarkify() {
  let media = document.querySelectorAll("img, picture, video");
  let iframes = document.querySelectorAll("iframe");

  document.querySelector("html").style.filter = "invert(1) hue-rotate(180deg)";

  media.forEach((element) => {
    element.style.filter = "invert(1) hue-rotate(180deg)";
    element.style.opacity = "1";
  });

  anyIframes(iframes, true);
}

function anyIframes(iframes, status) {
  if (iframes.length === 0) return;

  iframes.forEach((element) => {
    element.style.filter = status ? "invert(1) hue-rotate(180deg)" : "";
    element.style.opacity = status ? "1" : "";
  });
}

// Select the node that will be observed for mutations
const targetNode = document.querySelector("body");

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: false, subtree: true };

var url = location.href;

// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (
      mutation.type === "attributes" &&
      url != location.href &&
      window.localStorage.getItem("darkify") == "on"
    ) {
      onloadDarkify();
      var url = window.location.href;
      return;
    }
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
