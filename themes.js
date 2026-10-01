const THEME_KEY = "__theme"; // can't collide with hostname keys
const DEFAULT_THEME = "classic";

// core: 7 base colors, the rest are derived in themeVars()
const THEMES = {
  classic:  { name: "Classic",  preview: ["#000000", "#7fb4ff"], core: null },
  midnight: { name: "Midnight", preview: ["#0f1115", "#6ea8fe"], core: { base: "#0f1115", raised: "#171a21", sidebar: "#1c2029", text: "#e6e8ec", border: "#2a2f3a", link: "#6ea8fe", focus: "#3b82f6" } },
  warm:     { name: "Warm",     preview: ["#1b1612", "#e8a35c"], core: { base: "#1b1612", raised: "#241d17", sidebar: "#2b221b", text: "#efe6da", border: "#3a2f26", link: "#e8a35c", focus: "#d9822b" } },
  forest:   { name: "Forest",   preview: ["#0f1512", "#5fd38d"], core: { base: "#0f1512", raised: "#161e1a", sidebar: "#1b2621", text: "#e2ece6", border: "#25332b", link: "#5fd38d", focus: "#2fb36a" } },
  nord:     { name: "Nord",     preview: ["#2e3440", "#88c0d0"], core: { base: "#2e3440", raised: "#3b4252", sidebar: "#434c5e", text: "#eceff4", border: "#4c566a", link: "#88c0d0", focus: "#81a1c1" } }
};

function themeVars(c) {
  const mix = (a, pct, b) => `color-mix(in srgb, ${a} ${pct}%, ${b})`;
  return {
    "--bg-base": c.base,
    "--bg-raised": c.raised,
    "--bg-elevated": c.raised,
    "--bg-sidebar": c.sidebar,
    "--bg-input": c.raised,
    "--bg-btn": c.raised,
    "--bg-btn-hover": mix(c.raised, 85, "white"),
    "--bg-btn-active": mix(c.raised, 85, "black"),
    "--text-primary": c.text,
    "--text-input": mix(c.text, 90, "white"),
    "--border-default": c.border,
    "--border-input": mix(c.border, 80, "white"),
    "--border-btn": c.border,
    "--border-btn-hover": mix(c.border, 85, "white"),
    "--border-btn-active": mix(c.border, 70, "white"),
    "--color-link": c.link,
    "--color-focus": c.focus
  };
}

const THEME_VAR_NAMES = Object.keys(themeVars(THEMES.midnight.core));


// Builds one :root rule for insertCSS
function themeCss(id) {
  const core = (THEMES[id] || THEMES[DEFAULT_THEME]).core;
  if (!core) return "";
  const body = Object.entries(themeVars(core))
    .map(([k, v]) => `${k}:${v} !important;`)
    .join("");
  return `:root{${body}}`;
}