import { createApp } from "vue";
import router from "./routes";
import store from "./store";
import Toast from "./plugins/Toast";

import App from "./App.vue";

// Initialize theme from localStorage
function initTheme() {
  const savedTheme = localStorage.getItem("theme-preference") || "auto";

  function systemDarkModeEnabled() {
    const computedStyle = window.getComputedStyle(document.body);
    if (computedStyle?.colorScheme != null) {
      return computedStyle.colorScheme.includes("dark");
    }
    return false;
  }

  if (savedTheme === "auto") {
    const systemDark = systemDarkModeEnabled();
    document.body.className = systemDark ? "dark" : "light";

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", e => {
      const currentTheme = localStorage.getItem("theme-preference");
      if (currentTheme === "auto") {
        document.body.className = e.matches ? "dark" : "light";
      }
    });
  } else {
    document.body.className = savedTheme;
  }
}

// Initialize theme before mounting
initTheme();

store.dispatch("darkmodeModule/findAndSetDarkmodeSupported");
store.dispatch("user/initUserFromCookie");

const app = createApp(App);

app.use(router);
app.use(store);
app.use(Toast);

app.mount("#app");
