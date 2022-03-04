<style lang="scss" scoped>
@import "./src/scss/media-queries";
#app {
  display: grid;
  // grid-template-columns: 90px 1fr 90px;
  grid-template-rows: var(--header-size);
  grid-template-columns: var(--header-size) 1fr;
}

.header {
  position: fixed;
  top: 0;
  width: 100%;
  grid-column: 1 / 3;
  grid-row: 1;
  z-index: 15;
}

.content {
  grid-column: 2 / 3;
  grid-row: 2;
  z-index: 5;

  @include mobile {
    grid-column: 1 / 3;
  }
}

.desktop-menu {
  grid-column: 1 / 2;
  grid-row: 2;
  width: var(--header-size);
  position: fixed;
  top: var(--header-size);
  left: 0;
}
</style>

<template>
  <div id="app">
    <!-- Header and hamburger navigation -->
    <NavigationHeader class="header"></NavigationHeader>
    <NavigationIcons class="desktop-menu desktop-only" />

    <!-- Display the component assigned to the given route (default: home) -->
    <router-view class="content" :key="$route.fullPath"></router-view>

    <!-- Movie popup that will show above existing rendered content -->
    <movie-popup></movie-popup>

    <darkmode-toggle />
  </div>
</template>

<script>
import NavigationHeader from "@/components/NavigationHeader";
import NavigationIcons from "@/components/NavigationIcons";
import MoviePopup from "@/components/MoviePopup";
import DarkmodeToggle from "@/components/ui/darkmodeToggle";

export default {
  name: "app",
  components: {
    NavigationHeader,
    NavigationIcons,
    MoviePopup,
    DarkmodeToggle
  }
};
</script>

<style lang="scss">
@import "./src/scss/main";
@import "./src/scss/media-queries";
</style>
