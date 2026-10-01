importScripts("themes.js");

const CSS_FILE = "dark.css";

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.action !== "injectCSS") return;
  const target = { tabId: sender.tab.id };

  chrome.storage.sync.get(THEME_KEY, async (data) => {
    await chrome.scripting.insertCSS({ target, files: [CSS_FILE] });
    const css = themeCss(data[THEME_KEY] || DEFAULT_THEME);
    if (css) await chrome.scripting.insertCSS({ target, css });
  });
});
