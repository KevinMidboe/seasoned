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
        :class="['theme-card', { active: selectedTheme === theme.value }]"
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
  import { computed, onMounted } from "vue";
  import { useTheme } from "@/composables/useTheme";

  const themes = [
    { value: "auto", label: "Auto" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "ocean", label: "Ocean" },
    { value: "nordic", label: "Nordic" },
    { value: "halloween", label: "Halloween" }
  ] as const;

  const { currentTheme, savedTheme, setTheme } = useTheme();
  const selectedTheme = currentTheme;

  const currentThemeName = computed(
    () => themes.find(t => t.value === selectedTheme.value)?.label ?? "Auto"
  );

  function selectTheme(theme: string) {
    setTheme(theme as any);
  }

  onMounted(() => {
    selectedTheme.value = savedTheme.value;
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
        border: 3px solid;
      }

      &[data-theme="light"] .icon-inner {
        background: linear-gradient(135deg, #f8f8f8, #e8e8e8);
        border-color: #01d277;
      }
      &[data-theme="dark"] .icon-inner {
        background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
        border-color: #01d277;
      }
      &[data-theme="ocean"] .icon-inner {
        background: linear-gradient(135deg, #0f2027, #2c5364);
        border-color: #00d4ff;
      }
      &[data-theme="nordic"] .icon-inner {
        background: linear-gradient(135deg, #f5f0e8, #d8cdb9);
        border-color: #3d6e4e;
      }
      &[data-theme="halloween"] .icon-inner {
        background: linear-gradient(135deg, #1a0e2e, #2d1b3d);
        border-color: #ff6600;
      }
      &[data-theme="auto"] .icon-inner {
        background: conic-gradient(#f8f8f8 0deg 180deg, #1a1a1a 180deg);
        border-color: #01d277;
      }
    }

    .theme-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    span {
      font-size: 0.85rem;
      color: $text-color-70;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;

      @include mobile-only {
        font-size: 0.75rem;
      }
    }

    h3 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
      line-height: 1;

      @include mobile-only {
        font-size: 1.4rem;
      }
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
        &:hover {
          transform: none;
        }
        &:active {
          transform: scale(0.97);
        }
      }

      &:hover {
        border-color: var(--highlight-color);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
      }

      &.active {
        border-color: var(--highlight-color);
        background-color: var(--background-40);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
          bottom: 8px;
          left: 8px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        &::before {
          content: "";
          position: absolute;
          top: 8px;
          left: 8px;
          right: 8px;
          height: 20px;
          border-radius: 4px;
          border: 1px solid;
        }
      }

      &__preview[data-theme="light"] {
        background: #f8f8f8;
        .preview-circle {
          background: #01d277;
        }
        &::before {
          background: #fff;
          border-color: rgba(8, 28, 36, 0.1);
        }
      }

      &__preview[data-theme="dark"] {
        background: #111;
        .preview-circle {
          background: #01d277;
        }
        &::before {
          background: #060708;
          border-color: rgba(255, 255, 255, 0.1);
        }
      }

      &__preview[data-theme="ocean"] {
        background: #0f2027;
        .preview-circle {
          background: #00d4ff;
        }
        &::before {
          background: #203a43;
          border-color: rgba(0, 212, 255, 0.2);
        }
      }

      &__preview[data-theme="nordic"] {
        background: #f5f0e8;
        .preview-circle {
          background: #3d6e4e;
        }
        &::before {
          background: #fffef9;
          border-color: rgba(61, 110, 78, 0.2);
        }
      }

      &__preview[data-theme="halloween"] {
        background: #1a0e2e;
        .preview-circle {
          background: #ff6600;
        }
        &::before {
          background: #2d1b3d;
          border-color: rgba(255, 102, 0, 0.2);
        }
      }

      &__preview[data-theme="auto"] {
        border-color: black;
        background: linear-gradient(
          135deg,
          #f8f8f8 0%,
          #f8f8f8 50%,
          #111 50%,
          #111 100%
        );
        .preview-circle {
          left: auto;
          right: 8px;
          background: #01d277;
        }
        &::before {
          right: auto;
          width: calc(50% - 10px);
          background: #fff;
          border-color: rgba(8, 28, 36, 0.1);
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
        color: white;
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
  }
</style>
