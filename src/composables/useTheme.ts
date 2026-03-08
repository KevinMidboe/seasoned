import { ref, computed } from "vue";

type Theme = "light" | "dark" | "auto";

const currentTheme = ref<Theme>("auto");

function systemDarkModeEnabled(): boolean {
  const computedStyle = window.getComputedStyle(document.body);
  if (computedStyle?.colorScheme != null) {
    return computedStyle.colorScheme.includes("dark");
  }
  return false;
}

function applyTheme(theme: Theme) {
  if (theme === "auto") {
    const systemDark = systemDarkModeEnabled();
    document.body.className = systemDark ? "dark" : "light";
  } else {
    document.body.className = theme;
  }
}

export function useTheme() {
  const savedTheme = computed(
    () => (localStorage.getItem("theme-preference") as Theme) || "auto"
  );

  function initTheme() {
    const theme = savedTheme.value;
    currentTheme.value = theme;
    applyTheme(theme);

    // Listen for system theme changes when in auto mode
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", e => {
      const currentSetting = localStorage.getItem("theme-preference") as Theme;
      if (currentSetting === "auto") {
        document.body.className = e.matches ? "dark" : "light";
      }
    });
  }

  function setTheme(theme: Theme) {
    currentTheme.value = theme;
    localStorage.setItem("theme-preference", theme);
    applyTheme(theme);
  }

  return {
    currentTheme,
    savedTheme,
    initTheme,
    setTheme
  };
}
