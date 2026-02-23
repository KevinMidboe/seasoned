<template>
  <section class="settings">
    <link-plex-account @reload="reloadSettings" />

    <hr class="setting__divider" />

    <change-password />

    <hr class="setting__divider" />
  </section>
</template>

<script setup lang="ts">
  import { inject } from "vue";
  import { useStore } from "vuex";
  import { useRoute } from "vue-router";
  import ChangePassword from "@/components/profile/ChangePassword.vue";
  import LinkPlexAccount from "@/components/profile/LinkPlexAccount.vue";
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
  displayWarningIfMissingPlexAccount();
</script>

<style lang="scss">
  @import "scss/variables";
  @import "scss/media-queries";

  .settings {
    padding: 3rem;

    @include mobile-only {
      padding: 1rem;
    }

    &__header {
      margin: 0;
      line-height: 16px;
      color: $text-color;
      font-weight: 300;
      margin-bottom: 20px;
      text-transform: uppercase;
    }

    &__info {
      display: block;
      margin-bottom: 25px;
    }

    hr {
      display: block;
      height: 1px;
      border: 0;
      border-bottom: 1px solid $text-color-50;
      margin-top: 30px;
      margin-bottom: 70px;
      margin-left: 20px;
      width: 96%;
      text-align: left;
    }

    span {
      font-weight: 200;
      size: 16px;
    }
  }

  a {
    text-decoration: none;
  }
</style>
