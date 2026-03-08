<template>
  <section class="settings">
    <div class="settings__container">
      <!-- Profile Hero Card -->
      <ProfileHero />

      <!-- Settings Grid -->
      <div class="settings__grid">
        <!-- Left Column -->
        <div class="settings__column">
          <section class="settings-section settings-section--compact">
            <div class="settings-section-header"><h2>Appearance</h2></div>
            <theme-preferences />
          </section>

          <section class="settings-section settings-section--compact">
            <security-settings />
          </section>
        </div>

        <!-- Right Column -->
        <div class="settings__column">
          <section class="settings-section">
            <div class="settings-section-header"><h2>Integrations</h2></div>
            <plex-settings @reload="reloadSettings" />
          </section>

          <section class="settings-section">
            <data-export />
          </section>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { inject, onMounted } from "vue";
  import { useStore } from "vuex";
  import { useRoute } from "vue-router";
  import ProfileHero from "@/components/settings/ProfileHero.vue";
  import ThemePreferences from "@/components/settings/ThemePreferences.vue";
  import PlexSettings from "@/components/settings/PlexSettings.vue";
  import SecuritySettings from "@/components/settings/SecuritySettings.vue";
  import DataExport from "@/components/settings/DataExport.vue";
  import { getSettings } from "../api";

  const store = useStore();
  const route = useRoute();
  const notifications: {
    error;
  } = inject("notifications");

  function displayWarningIfMissingPlexAccount() {
    if (route.query?.missingPlexAccount === "true") {
      notifications.error({
        title: "Missing plex account 🧲",
        description: "Link your plex account to view activity",
        timeout: 10000
      });
    }
  }

  function reloadSettings() {
    return getSettings().then(response => {
      const { settings } = response;
      if (!settings) return;

      store.dispatch("user/setSettings", settings);
    });
  }

  // Functions called on component load
  onMounted(() => displayWarningIfMissingPlexAccount());
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";
  @import "scss/shared-settings";

  .settings {
    min-height: calc(100vh - var(--header-size));
    padding: 2rem 1.5rem;

    @include mobile-only {
      padding: 0.5rem;
    }

    &__container {
      max-width: 1400px;
      margin: 0 auto;

      @include mobile-only {
        max-width: 100%;
      }
    }

    &__grid {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 1.25rem;
      margin-top: 1.25rem;
      align-items: start;

      @include mobile-only {
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-top: 1rem;
      }
    }

    &__column {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;

      @include mobile-only {
        gap: 1rem;
      }
    }
  }

  .settings-section {
    background-color: var(--background-color-secondary);
    border-radius: 0.5rem;
    padding: 1.25rem;
    border: 1px solid var(--background-40);

    @include mobile-only {
      padding: 0.5rem;
    }

    &--compact {
      // Tighter padding for quick settings, but same header size
      padding: 1rem;

      @include mobile-only {
        padding: 0.5rem;
      }
    }
  }
</style>
