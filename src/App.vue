<template>
  <div id="app">
    <!-- Header and hamburger navigation -->
    <NavigationHeader class="header"></NavigationHeader>

    <div class="navigation-icons-gutter desktop-only">
      <NavigationIcons />
    </div>

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
