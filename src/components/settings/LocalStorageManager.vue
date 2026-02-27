<template>
  <div class="storage-manager">
    <div class="storage-manager__header">
      <p class="storage-manager__description">
        Full transparency and control over your data. Everything listed here is
        stored locally on your device—no servers, no tracking. You own your
        data.
      </p>
      <div class="storage-manager__info">
        <IconInfo class="info-icon" />
        <span
          >Your browser stores this data to improve your experience. Clear
          individual items or wipe everything—it's your choice.</span
        >
      </div>
    </div>

    <div class="storage-items">
      <div v-for="item in storageItems" :key="item.key" class="storage-item">
        <div class="storage-item__info">
          <h4 class="storage-item__title">{{ item.title }}</h4>
          <p class="storage-item__description">
            {{ item.description }} ·
            <span class="storage-item__size">{{ item.size }}</span>
          </p>
        </div>
        <button
          class="storage-item__delete"
          @click="clearItem(item.key, item.title)"
          :title="`Clear ${item.title}`"
        >
          <IconClose />
        </button>
      </div>
    </div>

    <DangerZoneAction
      title="Clear Everything"
      description="Remove all locally stored data at once. This includes preferences, history, and cached information."
      button-text="Clear All Data"
      @action="clearAllData"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, inject } from "vue";
  import { clearCommandHistory } from "@/utils/commandTracking";
  import IconInfo from "@/icons/IconInfo.vue";
  import IconClose from "@/icons/IconClose.vue";
  import DangerZoneAction from "./DangerZoneAction.vue";

  interface StorageItem {
    key: string;
    title: string;
    description: string;
    size: string;
  }

  const notifications: {
    success: (options: {
      title: string;
      description?: string;
      timeout?: number;
    }) => void;
    error: (options: {
      title: string;
      description?: string;
      timeout?: number;
    }) => void;
  } = inject("notifications");

  const storageItems = computed<StorageItem[]>(() => {
    const items: StorageItem[] = [];

    // Command palette stats
    const commandStats = localStorage.getItem("commandPalette_stats");
    if (commandStats) {
      items.push({
        key: "commandPalette_stats",
        title: "Command Palette History",
        description: "Usage statistics for command palette navigation",
        size: formatBytes(commandStats.length)
      });
    }

    // Plex user data
    const plexData = localStorage.getItem("plex_user_data");
    if (plexData) {
      items.push({
        key: "plex_user_data",
        title: "Plex User Data",
        description: "Cached Plex account information",
        size: formatBytes(plexData.length)
      });
    }

    // Theme preference
    const theme = localStorage.getItem("theme");
    if (theme) {
      items.push({
        key: "theme",
        title: "Theme Preference",
        description: "Your selected color theme",
        size: formatBytes(theme.length)
      });
    }

    // Color scheme
    const colorScheme = localStorage.getItem("color-scheme");
    if (colorScheme) {
      items.push({
        key: "color-scheme",
        title: "Color Scheme",
        description: "Light or dark mode preference",
        size: formatBytes(colorScheme.length)
      });
    }

    return items;
  });

  function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }

  function clearItem(key: string, title: string) {
    try {
      // Special handling for command history
      if (key === "commandPalette_stats") {
        clearCommandHistory();
      } else {
        localStorage.removeItem(key);
      }

      notifications.success({
        title: "Data Cleared",
        description: `${title} has been cleared`,
        timeout: 3000
      });

      // Force re-render
      storageItems.value;
    } catch (error) {
      notifications.error({
        title: "Error",
        description: `Failed to clear ${title}`,
        timeout: 5000
      });
    }
  }

  function clearAllData() {
    const confirmed = confirm(
      "Are you sure you want to clear all locally stored data? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      localStorage.clear();
      clearCommandHistory();

      notifications.success({
        title: "All Data Cleared",
        description: "All locally stored data has been removed",
        timeout: 3000
      });
    } catch (error) {
      notifications.error({
        title: "Error",
        description: "Failed to clear all data",
        timeout: 5000
      });
    }
  }
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .storage-manager {
    &__header {
      margin-bottom: 1.5rem;
    }

    &__description {
      margin: 0 0 0.75rem 0;
      color: var(--text-color);
      font-size: 0.95rem;
      line-height: 1.6;
      font-weight: 500;
    }

    &__info {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 0.75rem;
      background: var(--background-ui);
      border-radius: 0.375rem;
      border-left: 3px solid var(--highlight-color);

      .info-icon {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        fill: var(--highlight-color);
        margin-top: 2px;
      }

      span {
        font-size: 0.85rem;
        color: var(--text-color-70);
        line-height: 1.5;
      }
    }
  }

  .storage-items {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .storage-item {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: 0;
    background: var(--background-ui);
    border-radius: 0.25rem;
    overflow: hidden;
    transition: all 0.2s ease;

    &:hover {
      .storage-item__delete {
        background: var(--color-error-highlight);
      }
    }

    &__info {
      flex: 1;
      min-width: 0;
      padding: 0.85rem;

      @include mobile-only {
        padding: 0.75rem;
      }
    }

    &__title {
      margin: 0 0 0.3rem 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-color);

      @include mobile-only {
        font-size: 1rem;
      }
    }

    &__description {
      margin: 0;
      font-size: 0.8rem;
      color: var(--text-color-70);
      line-height: 1.4;

      @include mobile-only {
        font-size: 0.75rem;
      }
    }

    &__size {
      color: var(--text-color-50);
      font-family: monospace;
    }

    &__delete {
      flex-shrink: 0;
      width: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-error);
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;

      @include mobile-only {
        width: 60px;
      }

      svg {
        width: 20px;
        height: 20px;
        fill: white;
        transition: transform 0.2s ease;

        @include mobile-only {
          width: 18px;
          height: 18px;
        }
      }

      &:hover {
        background: var(--color-error-highlight);

        svg {
          transform: scale(1.1);
        }
      }

      &:active {
        svg {
          transform: scale(0.9);
        }
      }
    }
  }
</style>
