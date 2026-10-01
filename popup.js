const CSS_FILE = "dark.css";

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

// Remove old theme rule, insert new one (same string is needed to remove)
async function swapThemeCss(tabId, from, to) {
  const target = { tabId };
  const oldCss = themeCss(from);
  const newCss = themeCss(to);
  try {
    if (oldCss) await chrome.scripting.removeCSS({ target, css: oldCss });
  } catch {}
  if (newCss) await chrome.scripting.insertCSS({ target, css: newCss });
}

document.addEventListener("DOMContentLoaded", async () => {
  const toggle = document.getElementById("toggle");
  const list = document.getElementById("themes");
  const tab = await getCurrentTab();
  const domain = getDomain(tab.url);

  let current =
    (await chrome.storage.sync.get(THEME_KEY))[THEME_KEY] || DEFAULT_THEME;

  for (const [id, t] of Object.entries(THEMES)) {
    const btn = document.createElement("button");
    btn.className = "swatch";
    btn.dataset.id = id;
    btn.title = t.name;
    btn.setAttribute("aria-pressed", id === current);
    btn.style.background = `linear-gradient(135deg, ${t.preview[0]} 50%, ${t.preview[1]} 50%)`;

    btn.addEventListener("click", async () => {
      const prev = current;
      current = id;
      chrome.storage.sync.set({ [THEME_KEY]: id });
      list
        .querySelectorAll(".swatch")
        .forEach((b) => b.setAttribute("aria-pressed", b.dataset.id === id));
      if (toggle.checked) await swapThemeCss(tab.id, prev, id);
    });

    list.append(btn);
  }

  if (!domain) return;

  chrome.storage.sync.get([domain], (data) => {
    toggle.checked = !!data[domain];
  });

  toggle.addEventListener("change", async () => {
    const enabled = toggle.checked;
    const target = { tabId: tab.id };

    if (enabled) {
      await chrome.scripting.insertCSS({ target, files: [CSS_FILE] });
      const css = themeCss(current);
      if (css) await chrome.scripting.insertCSS({ target, css });
    } else {
      await chrome.scripting.removeCSS({ target, files: [CSS_FILE] });
      const css = themeCss(current);
      if (css) {
        try {
          await chrome.scripting.removeCSS({ target, css });
        } catch {}
      }
    }

    chrome.storage.sync.set({ [domain]: enabled });
  });
});
