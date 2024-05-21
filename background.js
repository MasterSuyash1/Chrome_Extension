const allowedSite = "https://www.google.com";

// Ensure notifications permission is granted
chrome.runtime.onInstalled.addListener(() => {
  chrome.notifications.getPermissionLevel((level) => {
    if (level !== 'granted') {
      alert('Please enable notifications for this extension to work correctly.');
    }
  });
});

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (!details.url.startsWith(allowedSite)) {
      return { cancel: true };
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (!tab.url.startsWith(allowedSite)) {
      chrome.tabs.update(tab.id, { url: allowedSite }, () => {
        showNotification();
      });
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && !tab.url.startsWith(allowedSite)) {
    chrome.tabs.update(tab.id, { url: allowedSite }, () => {
      showNotification();
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'checkTab') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let currentTab = tabs[0];
      if (!currentTab.url.startsWith(allowedSite)) {
        chrome.tabs.update(currentTab.id, { url: allowedSite }, () => {
          showNotification();
        });
      }
    });
  }
});

function showNotification() {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon48.png', // Ensure this file exists in your extension directory
    title: 'Action Not Allowed',
    message: 'Switching tabs is not allowed.',
    priority: 2
  });
}
