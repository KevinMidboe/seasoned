<template>
  <router-link
    :to="{ path: route?.route }"
    :key="route?.title"
    v-if="route?.requiresAuth == undefined || (route?.requiresAuth && loggedIn)"
  >
    <li class="navigation-link" :class="{ active: route.route == active }">
      <component class="navigation-icon" :is="route.icon"></component>
      <span>{{ route.title }}</span>
    </li>
  </router-link>
</template>

<script setup lang="ts">
  import { useStore } from "vuex";
  import { computed, defineProps } from "vue";
  import type INavigationIcon from "../../interfaces/INavigationIcon";

  interface Props {
    route: INavigationIcon;
    active?: string;
  }

  defineProps<Props>();

  const store = useStore();
  const loggedIn = computed(() => store.getters["user/loggedIn"]);
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
