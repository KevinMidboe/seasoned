<template>
  <ul class="navigation-icons">
    <router-link
      :to="{ path: route.route }"
      v-for="route in routes"
      :key="route.title"
    >
      <li
        class="navigation-link"
        :class="{ active: route.route == activeRoute }"
      >
        <component class="navigation-icon" :is="route.icon"></component>
        <span>{{ route.title }}</span>
      </li>
    </router-link>

    <slot></slot>
  </ul>
</template>

<script>
import IconRequest from "../icons/IconRequest";
import IconNowPlaying from "../icons/IconNowPlaying";
import IconPopular from "../icons/IconPopular";
import IconUpcoming from "../icons/IconUpcoming";

export default {
  name: "NavigationIcons",
  components: { IconRequest, IconPopular, IconNowPlaying, IconUpcoming },
  data() {
    return {
      routes: [],
      activeRoute: null
    };
  },
  watch: {
    $route() {
      this.activeRoute = window.location.pathname;
    }
  },
  created() {
    this.activeRoute = window.location.pathname;
    this.routes = this.getAvailableRoutes();
  },
  methods: {
    getAvailableRoutes() {
      return [
        {
          title: "Requests",
          route: "/requests",
          apiPath: "/v2/requests",
          icon: IconRequest
        },
        {
          title: "Now Playing",
          route: "/list/now_playing",
          apiPath: "/v2/movie/now_playing",
          icon: IconNowPlaying
        },
        {
          title: "Popular",
          route: "/list/popular",
          apiPath: "/v2/movie/popular",
          icon: IconPopular
        },
        {
          title: "Upcoming",
          route: "/list/upcoming",
          apiPath: "/v2/movie/upcoming",
          icon: IconUpcoming
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./src/scss/media-queries";

.navigation-icons {
  display: inline-flex;
  flex-direction: column;
  margin: 0;
  padding-left: 0;
  height: 100%;
  background-color: var(--background-color-secondary);
  z-index: 15;

  @include mobile {
    flex-wrap: wrap;
    flex-direction: row;
  }
}
</style>
