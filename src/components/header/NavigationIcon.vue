<template>
  <router-link
    v-if="route?.requiresAuth == undefined || (route?.requiresAuth && loggedIn)"
    :key="route?.title"
    :to="{ path: route?.route }"
  >
    <li
      class="navigation-link"
      :class="{ active: matchesActiveRoute(), 'nofill-stroke': useStroke }"
    >
      <component :is="route.icon" class="navigation-icon"></component>
      <span>{{ route.title }}</span>
    </li>
  </router-link>
</template>

<script setup lang="ts">
  import { useStore } from "vuex";
  import { computed } from "vue";
  import type INavigationIcon from "../../interfaces/INavigationIcon";

  interface Props {
    route: INavigationIcon;
    active?: string;
    useStroke?: boolean;
  }

  const props = defineProps<Props>();

  const store = useStore();
  const loggedIn = computed(() => store.getters["user/loggedIn"]);

  function matchesActiveRoute() {
    const currentRoute = props.route.title.toLowerCase();
    return props?.active?.includes(currentRoute);
  }
</script>

<style lang="scss" scoped>
  @import "src/scss/media-queries";

  .navigation-link {
    display: grid;
    place-items: center;
    min-height: var(--header-size);
    list-style: none;
    padding: 1rem 0.15rem;
    text-align: center;
    background-color: var(--background-color-secondary);
    transition: transform 0.3s ease, color 0.3s ease, stoke 0.3s ease,
      fill 0.3s ease, background-color 0.5s ease;

    &:hover {
      transform: scale(1.05);
    }

    &:hover,
    &.active {
      background-color: var(--background-color);

      span,
      .navigation-icon {
        color: var(--text-color);
        fill: var(--text-color);
      }
    }

    span {
      text-transform: uppercase;
      font-size: 11px;
      margin-top: 0.25rem;
      color: var(--text-color-70);
    }

    &.nofill-stroke {
      .navigation-icon {
        stroke: var(--text-color-70);
        fill: none !important;
      }

      &:hover .navigation-icon,
      &.active .navigation-icon {
        stroke: var(--text-color);
      }
    }
  }

  a {
    text-decoration: none;
  }

  .navigation-icon {
    width: 28px;
    fill: var(--text-color-70);
    transition: inherit;
  }
</style>
