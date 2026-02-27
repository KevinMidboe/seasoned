<template>
  <section class="settings">
    <div class="settings__container">
      <!-- Profile Hero Card -->
      <div class="profile-hero">
        <div class="profile-hero__main">
          <div class="profile-hero__avatar">
            <div class="avatar-large">{{ userInitials }}</div>
          </div>
          <div class="profile-hero__info">
            <h1 class="profile-hero__name">{{ username }}</h1>
            <span :class="['profile-hero__badge', `badge--${userRole}`]">
              <a v-if="userRole === 'admin'" href="/admin">{{ userRole }}</a>
              <span v-else>{{ userRole }}</span>
            </span>
            <p class="profile-hero__member">Member since {{ memberSince }}</p>
          </div>
        </div>

        <div class="profile-hero__stats">
          <div class="stat-large">
            <span class="stat-large__value">{{ stats.totalRequests }}</span>
            <span class="stat-large__label">Requests</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-large">
            <span class="stat-large__value">{{ stats.magnetsAdded }}</span>
            <span class="stat-large__label">Magnets Added</span>
          </div>
        </div>
      </div>

      <!-- Settings Grid -->
      <div class="settings__grid">
        <!-- Left Column: Quick Settings -->
        <div class="settings__column settings__column--left">
          <section class="settings-section settings-section--compact">
            <h2 class="section-header">Appearance</h2>
            <theme-preferences />
          </section>

          <section class="settings-section settings-section--compact">
            <h2 class="section-header">Security</h2>
            <change-password />
          </section>
        </div>

        <!-- Right Column: Data-Heavy Sections -->
        <div class="settings__column settings__column--right">
          <section class="settings-section">
            <h2 class="section-header">Integrations</h2>
            <plex-settings @reload="reloadSettings" />
          </section>

          <section class="settings-section">
            <h2 class="section-header">Data & Privacy</h2>
            <data-export />
          </section>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { inject, computed, onMounted } from "vue";
  import { useStore } from "vuex";
  import { useRoute } from "vue-router";
  import ThemePreferences from "@/components/settings/ThemePreferences.vue";
  import PlexSettings from "@/components/settings/PlexSettings.vue";
  import ChangePassword from "@/components/profile/ChangePassword.vue";
  import DataExport from "@/components/settings/DataExport.vue";
  import { getSettings } from "../api";

  const store = useStore();
  const route = useRoute();
  const notifications: {
    error;
  } = inject("notifications");

  const username = computed(() => store.getters["user/username"] || "User");
  const userRole = computed(() =>
    store.getters["user/admin"] ? "admin" : "user"
  );

  const userInitials = computed(() => {
    return username.value.slice(0, 2).toUpperCase();
  });

  const memberSince = computed(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric"
    });
  });

  const stats = {
    totalRequests: 45,
    magnetsAdded: 127
  };

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

  .settings {
    min-height: calc(100vh - var(--header-size));
    padding: 2rem 1.5rem;

    @include mobile-only {
      padding: 1rem;
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

      &--left {
        // Quick settings - lighter, more concise
      }

      &--right {
        // Data-heavy sections
      }
    }
  }

  .profile-hero {
    background-color: var(--background-color-secondary);
    border-radius: 0.75rem;
    padding: 1.5rem;
    border: 1px solid var(--background-40);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;

    @include mobile-only {
      flex-direction: column;
      padding: 1.5rem 1.25rem;
      border-radius: 0.5rem;
      text-align: center;
      gap: 1rem;
    }

    &__main {
      display: flex;
      align-items: center;
      gap: 1.5rem;

      @include mobile-only {
        flex-direction: column;
        gap: 0.75rem;
      }
    }

    &__avatar {
      flex-shrink: 0;
    }

    &__info {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;

      @include mobile-only {
        align-items: center;
      }
    }

    &__name {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 600;
      line-height: 1.1;

      @include mobile-only {
        font-size: 1.5rem;
      }
    }

    &__badge {
      display: inline-block;
      padding: 0.25rem 0.7rem;
      border-radius: 2rem;
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 600;
      width: fit-content;

      @include mobile-only {
        padding: 0.2rem 0.6rem;
        font-size: 0.7rem;
      }

      &.badge--admin {
        background-color: var(--color-warning);
        color: $black;
      }

      &.badge--user {
        background-color: var(--background-40);
      }
    }

    &__member {
      margin: 0;
      font-size: 0.85rem;
      color: $text-color-70;

      @include mobile-only {
        font-size: 0.8rem;
      }
    }

    &__stats {
      display: flex;
      align-items: center;
      gap: 1.75rem;
      padding-left: 1.75rem;
      border-left: 1px solid var(--background-40);

      @include mobile-only {
        width: 100%;
        padding: 1rem 0 0 0;
        border-left: none;
        border-top: 1px solid var(--background-40);
        justify-content: center;
        gap: 1.25rem;
      }
    }
  }

  .avatar-large {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      var(--highlight-color),
      var(--color-green-70)
    );
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    font-weight: 700;
    color: $white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);

    @include mobile-only {
      width: 80px;
      height: 80px;
      font-size: 2rem;
    }
  }

  .stat-large {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;

    &__value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--highlight-color);
      line-height: 1;

      @include mobile-only {
        font-size: 1.75rem;
      }
    }

    &__label {
      font-size: 0.75rem;
      color: $text-color-70;
      text-transform: uppercase;
      font-weight: 500;
      letter-spacing: 0.5px;

      @include mobile-only {
        font-size: 0.75rem;
      }
    }
  }

  .stat-divider {
    width: 1px;
    height: 45px;
    background-color: var(--background-40);

    @include mobile-only {
      height: 45px;
    }
  }

  .settings-section {
    background-color: var(--background-color-secondary);
    border-radius: 0.5rem;
    padding: 1.25rem;
    border: 1px solid var(--background-40);

    @include mobile-only {
      padding: 1rem;
    }

    &--compact {
      // Tighter spacing for quick settings
      .section-header {
        font-size: 1.25rem;
        margin-bottom: 0.85rem;
        padding-bottom: 0.65rem;

        @include mobile-only {
          font-size: 1.2rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.6rem;
        }
      }
    }
  }

  .section-header {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--background-40);

    @include mobile-only {
      font-size: 1.3rem;
      margin-bottom: 0.85rem;
      padding-bottom: 0.65rem;
    }
  }
</style>
