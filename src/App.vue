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
    <movie-popup
      v-if="moviePopupIsVisible"
      :id="popupID"
      :type="popupType"
    ></movie-popup>

    <darkmode-toggle />
  </div>
</template>

<script>
import Vue from "vue";
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
  },
  data() {
    return {
      query: "",
      moviePopupIsVisible: false,
      popupID: 0,
      popupType: "movie"
    };
  },
  created() {
    let that = this;
    Vue.prototype.$popup = {
      get isOpen() {
        return that.moviePopupIsVisible;
      },
      open: (id, type) => {
        this.popupID = id || this.popupID;
        this.popupType = type || this.popupType;
        this.moviePopupIsVisible = true;
        console.log("opened");
      },
      close: () => {
        this.moviePopupIsVisible = false;
        console.log("closed");
      }
    };

    const movieId = new URLSearchParams(window.location.search).get("movie");
    if (movieId) {
      this.$popup.open(movieId, "movie");
    }
  }
};
</script>

<style lang="scss">
// @import "./src/scss/main";
@import "./src/scss/variables";
@import "./src/scss/media-queries";

* {
  box-sizing: border-box;
}
html {
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
  font-family: "Roboto", sans-serif;
  line-height: 1.6;
  background: $background-color;
  color: $text-color;
  transition: background-color 0.5s ease, color 0.5s ease;

  * {
    transition: background-color 0.5s ease, color 0.5s ease;
  }

  &.hidden {
    overflow: hidden;
  }
}
a:any-link {
  color: inherit;
}
input,
textarea,
button {
  font-family: "Roboto", sans-serif;
}
figure {
  padding: 0;
  margin: 0;
}
img {
  display: block;
  // max-width: 100%;
  height: auto;
}

.no-scroll {
  overflow: hidden;
}

.wrapper {
  position: relative;
}
// .header {
//   position: fixed;
//   z-index: 15;
//   display: flex;
//   flex-direction: column;

//   @include tablet-min {
//     width: calc(100% - 170px);
//     margin-left: 95px;
//     border-top: 0;
//     border-bottom: 0;
//     top: 0;
//   }
// }

// router view transition
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}
.fade-enter-active {
  transition-delay: 0.25s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
