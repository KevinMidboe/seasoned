<template>
  <div id="content">
    <!-- Header and hamburger navigation -->
    <NavigationHeader class="header" />

    <div class="navigation-icons-gutter desktop-only">
      <NavigationIcons />
    </div>

    <!-- Display the component assigned to the given route (default: home) -->
    <router-view :key="router.currentRoute.value.path" class="content" />

    <!-- Popup that will show above existing rendered content -->
    <popup />

    <darkmode-toggle />
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from "vue-router";
  import NavigationHeader from "@/components/header/NavigationHeader.vue";
  import NavigationIcons from "@/components/header/NavigationIcons.vue";
  import Popup from "@/components/Popup.vue";
  import DarkmodeToggle from "@/components/ui/DarkmodeToggle.vue";

  const router = useRouter();
</script>

<style lang="scss">
  @import "src/scss/main";
  @import "src/scss/media-queries";

  #app {
    display: grid;
    grid-template-rows: var(--header-size);
    grid-template-columns: var(--header-size) 1fr;

    @include mobile {
      grid-template-columns: 1fr;
    }

    .header {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 15;
    }

    .navigation-icons-gutter {
      position: fixed;
      height: 100vh;
      margin: 0;
      top: var(--header-size);
      width: var(--header-size);
      background-color: var(--background-color-secondary);
    }

    .content {
      display: grid;
      grid-column: 2 / 3;
      grid-row: 2;
      z-index: 5;

      @include mobile {
        grid-column: 1 / 3;
      }
    }
  }
</style>
