<template>
  <div class="storage-manager">
    <StorageSectionBrowser
      :sections="storageSections"
      @clear-item="clearItem"
    />

    <DangerZoneAction
      title="Clear All Browser Data"
      description="Remove all locally stored data at once. This includes preferences, history, and cached information."
      button-text="Clear All Data"
      @action="clearAllData"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, inject } from "vue";
  import IconCookie from "@/icons/IconCookie.vue";
  import IconDatabase from "@/icons/IconDatabase.vue";
  import IconTimer from "@/icons/IconTimer.vue";
  import StorageSectionBrowser from "./StorageSectionBrowser.vue";
  import DangerZoneAction from "./DangerZoneAction.vue";
  import { formatBytes } from "../../utils";

  interface StorageItem {
    key: string;
    description: string;
    size: string;
    type: "local" | "session" | "cookie";
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

  const dict = {
    commandPalette_stats: "Usage statistics for command palette navigation",
    "theme-preference": "Your selected color theme",
    plex_user_data: "Cached Plex account information",
    plex_library_data: "Cached Plex library details per section",
    plex_server_data: "Cached Plex server information",
    plex_library_last_sync: "UTC time string for last synced Plex data",
    plex_auth_token: "Authorized token from Plex.tv",
    authorization: "This sites user login token"
  };

  const storageItems = computed<StorageItem[]>(() => {
    const items: StorageItem[] = [];

    // local storage
    Object.keys(localStorage).map(key => {
      items.push({
        key,
        description: dict[key] ?? "",
        size: formatBytes(localStorage[key]?.length || 0),
        type: "local"
      });
    });

    // session storage
    Object.keys(sessionStorage).map(key => {
      items.push({
        key,
        description: dict[key] ?? "",
        size: formatBytes(sessionStorage[key]?.length || 0),
        type: "session"
      });
    });

    // cookies
    if (document.cookie) {
      document.cookie.split(";").forEach(cookie => {
        const [key, _] = cookie.trim().split("=");
        if (key) {
          items.push({
            key,
            description: dict[key] ?? "",
            size: formatBytes(cookie.length || 0),
            type: "cookie"
          });
        }
      });
    }

    return items;
  });

  const getTotalSize = (items: StorageItem[]) => {
    const totalBytes = items.reduce((acc, item) => {
      const match = item.size.match(/^([\d.]+)\s*(\w+)$/);
      if (!match) return acc;
      const value = parseFloat(match[1]);
      const unit = match[2];
      return (
        acc +
        (unit === "KB"
          ? value * 1024
          : unit === "MB"
            ? value * 1024 * 1024
            : value)
      );
    }, 0);
    return formatBytes(totalBytes);
  };

  const storageSections = computed(() => [
    {
      type: "local" as const,
      title: "LocalStorage",
      iconComponent: IconDatabase,
      description:
        "LocalStorage keeps data permanently on your device, even after closing your browser. It's used to remember your preferences and settings between visits.",
      items: storageItems.value.filter(item => item.type === "local"),
      get totalSize() {
        return getTotalSize(this.items);
      }
    },
    {
      type: "session" as const,
      title: "SessionStorage",
      iconComponent: IconTimer,
      description:
        "SessionStorage keeps data temporarily while you browse. It's automatically cleared when you close your browser tab or window.",
      items: storageItems.value.filter(item => item.type === "session"),
      get totalSize() {
        return getTotalSize(this.items);
      }
    },
    {
      type: "cookie" as const,
      title: "Cookies",
      iconComponent: IconCookie,
      description:
        "Cookies are small text files stored by your browser. They can be temporary (session cookies) or persistent, and are often used for authentication and tracking your activity.",
      items: storageItems.value.filter(item => item.type === "cookie"),
      get totalSize() {
        return getTotalSize(this.items);
      }
    }
  ]);

  function clearItem(key: string, type: "local" | "session" | "cookie") {
    try {
      if (type === "local") {
        localStorage.removeItem(key);
      } else if (type === "session") {
        sessionStorage.removeItem(key);
      } else if (type === "cookie") {
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }

      notifications.success({
        title: "Data Cleared",
        description: `${key} has been cleared`,
        timeout: 3000
      });

      // Force re-render
      storageItems.value;
    } catch (error) {
      notifications.error({
        title: "Error",
        description: `Failed to clear ${key}`,
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
      sessionStorage.clear();
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      });

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
  .storage-manager {
    display: flex;
    flex-direction: column;
  }
</style>
