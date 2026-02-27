<template>
  <div class="theme-preferences">
    <div class="current-theme">
      <div class="theme-display">
        <div class="theme-icon" :data-theme="selectedTheme">
          <div class="icon-inner"></div>
        </div>
        <div class="theme-info">
          <span class="theme-label">Current Theme</span>
          <h3 class="theme-name">{{ currentThemeName }}</h3>
        </div>
      </div>
    </div>

    <div class="theme-grid">
      <button
        v-for="theme in themes"
        :key="theme.value"
        :class="[
          'theme-card',
          { 'theme-card--active': selectedTheme === theme.value }
        ]"
        @click="selectTheme(theme.value)"
      >
        <div class="theme-card__preview" :data-theme="theme.value">
          <div class="preview-circle"></div>
        </div>
        <span class="theme-card__name">{{ theme.label }}</span>
        <div v-if="selectedTheme === theme.value" class="theme-card__badge">
          Active
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from "vue";

  interface Theme {
    value: string;
    label: string;
  }

  const themes: Theme[] = [
    { value: "auto", label: "Auto" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "ocean", label: "Ocean" },
    { value: "nordic", label: "Nordic" },
    { value: "halloween", label: "Halloween" }
  ];

  const selectedTheme = ref("auto");

  const currentThemeName = computed(() => {
    const theme = themes.find(t => t.value === selectedTheme.value);
    return theme ? theme.label : "Auto";
  });

  function systemDarkModeEnabled() {
    const computedStyle = window.getComputedStyle(document.body);
    if (computedStyle?.colorScheme != null) {
      return computedStyle.colorScheme.includes("dark");
    }
    return false;
  }

  function selectTheme(theme: string) {
    selectedTheme.value = theme;

    if (theme === "auto") {
      // Use system preference
      const systemDark = systemDarkModeEnabled();
      document.body.className = systemDark ? "dark" : "light";

      // Listen for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", e => {
        if (selectedTheme.value === "auto") {
          document.body.className = e.matches ? "dark" : "light";
        }
      });
    } else {
      // Manual theme selection
      document.body.className = theme;
    }

    // Save preference to localStorage
    localStorage.setItem("theme-preference", theme);
  }

  onMounted(() => {
    // Load saved preference or default to auto
    const savedTheme = localStorage.getItem("theme-preference") || "auto";
    selectTheme(savedTheme);
  });
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .current-theme {
    margin-bottom: 2rem;
    padding: 1rem 2rem;
    background-color: var(--background-ui);
    border-radius: 1rem;
    border: 2px solid var(--background-40);

    @include mobile-only {
      margin-bottom: 1.5rem;
      padding: 1.5rem;
      border-radius: 0.75rem;
    }
  }

  .theme-display {
    display: flex;
    align-items: center;
    gap: 1.5rem;

    @include mobile-only {
      gap: 1.25rem;
    }
  }

  .theme-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    @include mobile-only {
      width: 70px;
      height: 70px;
    }

    .icon-inner {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }

    &[data-theme="light"] .icon-inner {
      background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%);
      border: 3px solid #01d277;
    }

    &[data-theme="dark"] .icon-inner {
      background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
      border: 3px solid #01d277;
    }

    &[data-theme="ocean"] .icon-inner {
      background: linear-gradient(135deg, #0f2027 0%, #2c5364 100%);
      border: 3px solid #00d4ff;
    }

    &[data-theme="nordic"] .icon-inner {
      background: linear-gradient(135deg, #f5f0e8 0%, #d8cdb9 100%);
      border: 3px solid #3d6e4e;
    }

    &[data-theme="halloween"] .icon-inner {
      background: linear-gradient(135deg, #1a0e2e 0%, #2d1b3d 100%);
      border: 3px solid #ff6600;
    }

    &[data-theme="auto"] .icon-inner {
      background: conic-gradient(
        from 0deg,
        #f8f8f8 0deg 180deg,
        #1a1a1a 180deg 360deg
      );
      border: 3px solid #01d277;
    }
  }

  .theme-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .theme-label {
    font-size: 0.85rem;
    color: $text-color-70;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 500;

    @include mobile-only {
      font-size: 0.75rem;
    }
  }

  .theme-name {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1;

    @include mobile-only {
      font-size: 1.4rem;
    }
  }

  .theme-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;

    @include mobile-only {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }

  .theme-card {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
    background-color: var(--background-ui);
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    border: 2px solid transparent;
    text-align: center;

    @include mobile-only {
      padding: 0.85rem;
      border-radius: 0.5rem;
    }

    &:hover {
      border-color: var(--highlight-color);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    }

    &--active {
      border-color: var(--highlight-color);
      background-color: var(--background-40);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    @include mobile-only {
      &:hover {
        transform: none;
      }

      &:active {
        transform: scale(0.97);
      }
    }

    &__preview {
      width: 100%;
      height: 120px;
      border-radius: 0.5rem;
      overflow: hidden;
      margin-bottom: 0.75rem;
      position: relative;
      border: 1px solid var(--background-40);

      @include mobile-only {
        height: 100px;
        margin-bottom: 0.6rem;
      }

      .preview-circle {
        position: absolute;
        border-radius: 50%;
      }
    }

    // Light Theme Preview
    &__preview[data-theme="light"] {
      background: #f8f8f8;

      .preview-circle {
        bottom: 8px;
        left: 8px;
        width: 30px;
        height: 30px;
        background: #01d277;
      }

      &::before {
        content: "";
        position: absolute;
        top: 8px;
        left: 8px;
        right: 8px;
        height: 20px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid rgba(8, 28, 36, 0.1);
      }
    }

    // Dark Theme Preview
    &__preview[data-theme="dark"] {
      background: #111111;

      .preview-circle {
        bottom: 8px;
        left: 8px;
        width: 30px;
        height: 30px;
        background: #01d277;
      }

      &::before {
        content: "";
        position: absolute;
        top: 8px;
        left: 8px;
        right: 8px;
        height: 20px;
        background: rgba(6, 7, 8, 1);
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
    }

    // Ocean Theme Preview
    &__preview[data-theme="ocean"] {
      background: #0f2027;

      .preview-circle {
        bottom: 8px;
        left: 8px;
        width: 30px;
        height: 30px;
        background: #00d4ff;
      }

      &::before {
        content: "";
        position: absolute;
        top: 8px;
        left: 8px;
        right: 8px;
        height: 20px;
        background: #203a43;
        border-radius: 4px;
        border: 1px solid rgba(0, 212, 255, 0.2);
      }
    }

    // Nordic Theme Preview
    &__preview[data-theme="nordic"] {
      background: #f5f0e8;

      .preview-circle {
        bottom: 8px;
        left: 8px;
        width: 30px;
        height: 30px;
        background: #3d6e4e;
      }

      &::before {
        content: "";
        position: absolute;
        top: 8px;
        left: 8px;
        right: 8px;
        height: 20px;
        background: #fffef9;
        border-radius: 4px;
        border: 1px solid rgba(61, 110, 78, 0.2);
      }
    }

    // Halloween Theme Preview
    &__preview[data-theme="halloween"] {
      background: #1a0e2e;

      .preview-circle {
        bottom: 8px;
        left: 8px;
        width: 30px;
        height: 30px;
        background: #ff6600;
      }

      &::before {
        content: "";
        position: absolute;
        top: 8px;
        left: 8px;
        right: 8px;
        height: 20px;
        background: #2d1b3d;
        border-radius: 4px;
        border: 1px solid rgba(255, 102, 0, 0.2);
      }
    }

    // Auto Theme Preview (split)
    &__preview[data-theme="auto"] {
      background: linear-gradient(
        135deg,
        #f8f8f8 0%,
        #f8f8f8 50%,
        #111111 50%,
        #111111 100%
      );

      .preview-circle {
        bottom: 8px;
        right: 8px;
        width: 30px;
        height: 30px;
        background: #01d277;
      }

      &::before {
        content: "";
        position: absolute;
        top: 8px;
        left: 8px;
        width: calc(50% - 10px);
        height: 20px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid rgba(8, 28, 36, 0.1);
      }
    }

    &__name {
      font-size: 0.9rem;
      font-weight: 600;
      line-height: 1;
      color: var(--text-color);

      @include mobile-only {
        font-size: 0.85rem;
      }
    }

    &__badge {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      padding: 0.25rem 0.5rem;
      background-color: var(--highlight-color);
      color: $white;
      border-radius: 1rem;
      font-size: 0.65rem;
      font-weight: 600;
      text-transform: uppercase;

      @include mobile-only {
        top: 0.4rem;
        right: 0.4rem;
        padding: 0.2rem 0.4rem;
        font-size: 0.6rem;
      }
    }
  }
</style>
