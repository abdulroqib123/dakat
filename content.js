(function () {
  const domain = location.hostname;

  chrome.storage.sync.get([domain], (data) => {
    if (data[domain]) {
      chrome.runtime.sendMessage({ action: "injectCSS" });
    }
  });
})();
