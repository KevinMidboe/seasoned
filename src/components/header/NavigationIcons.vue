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
import NavigationIcon from "@/components/header/NavigationIcon";
import IconInbox from "@/icons/IconInbox";
import IconNowPlaying from "@/icons/IconNowPlaying";
import IconPopular from "@/icons/IconPopular";
import IconUpcoming from "@/icons/IconUpcoming";
import IconSettings from "@/icons/IconSettings";
import IconActivity from "@/icons/IconActivity";

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
      routes: [
        {
          title: "Requests",
          route: "/list/requests",
          icon: IconInbox
        },
        {
          title: "Now Playing",
          route: "/list/now_playing",
          icon: IconNowPlaying
        },
        {
          title: "Popular",
          route: "/list/popular",
          icon: IconPopular
        },
        {
          title: "Upcoming",
          route: "/list/upcoming",
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
      ],
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
  }
};
</script>

<style lang="scss" scoped>
@import "src/scss/media-queries";

.navigation-icons {
  display: grid;
  grid-column: 1fr;
  padding-left: 0;
  margin: 0;
  background-color: var(--background-color-secondary);
  z-index: 15;
  width: 100%;

  @include desktop {
    grid-template-rows: var(--header-size);
  }

  @include mobile {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
