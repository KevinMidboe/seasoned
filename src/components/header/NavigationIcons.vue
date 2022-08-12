<template>
  <ul class="navigation-icons">
    <NavigationIcon
      v-for="_route in routes"
      :key="_route.route"
      :route="_route"
      :active="activeRoute"
    />
    <slot></slot>
  </ul>
</template>

<script setup lang="ts">
  import { ref, watch } from "vue";
  import { useRoute } from "vue-router";
  import NavigationIcon from "@/components/header/NavigationIcon.vue";
  import IconInbox from "@/icons/IconInbox.vue";
  import IconNowPlaying from "@/icons/IconNowPlaying.vue";
  import IconPopular from "@/icons/IconPopular.vue";
  import IconUpcoming from "@/icons/IconUpcoming.vue";
  import IconSettings from "@/icons/IconSettings.vue";
  import IconActivity from "@/icons/IconActivity.vue";
  import IconBinoculars from "@/icons/IconBinoculars.vue";
  import type INavigationIcon from "../../interfaces/INavigationIcon";

  const route = useRoute();
  const activeRoute = ref(window?.location?.pathname);
  const routes: INavigationIcon[] = [
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
      title: "Torrents",
      route: "/torrents",
      requiresAuth: true,
      icon: IconBinoculars
    },
    {
      title: "Settings",
      route: "/profile?settings=true",
      requiresAuth: true,
      icon: IconSettings
    }
  ];

  function setActiveRoute(_route: string) {
    activeRoute.value = _route;
  }

  watch(route, () => setActiveRoute(window?.location?.pathname || ""));
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
