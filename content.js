// Listen for the window to gain focus
window.addEventListener('focus', function() {
    // Send a message to the background script to check the current tab
    chrome.runtime.sendMessage({ type: 'checkTab' });
  });
  
  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'redirect') {
      // Redirect to the allowed site if necessary
      window.location.href = "https://www.google.com";
    }
  });
  