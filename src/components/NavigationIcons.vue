<template>
  <ul class="navigation-icons">
    <NavigationIcon
      v-for="route in routes"
      :key="route.route"
      :route="route"
      :active="activeRoute"
    />
    <slot></slot>
  </ul>
</template>

<script>
import NavigationIcon from "./ui/NavigationIcon";
import IconInbox from "../icons/IconInbox";
import IconNowPlaying from "../icons/IconNowPlaying";
import IconPopular from "../icons/IconPopular";
import IconUpcoming from "../icons/IconUpcoming";
import IconSettings from "../icons/IconSettings";
import IconActivity from "../icons/IconActivity";

export default {
  name: "NavigationIcons",
  components: {
    NavigationIcon,
    IconInbox,
    IconPopular,
    IconNowPlaying,
    IconUpcoming,
    IconSettings,
    IconActivity
  },
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
          route: "/list/requests",
          apiPath: "/v2/requests",
          icon: IconInbox
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
        },
        {
          title: "Activity",
          route: "/activity",
          requiresAuth: true,
          icon: IconActivity
        },
        {
          title: "Settings",
          route: "/profile?settings=true",
          requiresAuth: true,
          icon: IconSettings
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
