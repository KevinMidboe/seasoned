<template>
  <section class="settings">
    <link-plex-account @reload="reloadSettings" />

    <hr class="setting__divider" />

    <change-password />

    <hr class="setting__divider" />
  </section>
</template>

<script setup lang="ts">
  import { useStore } from "vuex";
  import ChangePassword from "@/components/profile/ChangePassword.vue";
  import LinkPlexAccount from "@/components/profile/LinkPlexAccount.vue";
  import { getSettings } from "../api";

  const store = useStore();

  function reloadSettings() {
    return getSettings().then(response => {
      const { settings } = response;
      if (!settings) return;

      store.dispatch("user/setSettings", settings);
    });
  }
</script>

<style lang="scss">
  @import "src/scss/variables";
  @import "src/scss/media-queries";

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
