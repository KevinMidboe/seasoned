<template>
  <nav>
    <a v-if="isHome" class="nav__logo" href="/">
      <TmdbLogo class="logo" />
    </a>
    <router-link v-else class="nav__logo" to="/" exact>
      <TmdbLogo class="logo" />
    </router-link>

    <SearchInput />

    <Hamburger class="mobile-only" />
    <NavigationIcon class="desktop-only" :route="profileRoute" />

    <!-- <div class="navigation-icons-grid mobile-only" :class="{ open: isOpen }"> -->
    <div class="navigation-icons-grid mobile-only" v-if="isOpen">
      <NavigationIcons>
        <NavigationIcon :route="profileRoute" />
      </NavigationIcons>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { computed, defineProps, PropType } from "vue";
  import type { App } from "vue";
  import { useStore } from "vuex";
  import { useRoute } from "vue-router";
  import SearchInput from "@/components/header/SearchInput.vue";
  import Hamburger from "@/components/ui/Hamburger.vue";
  import NavigationIcons from "@/components/header/NavigationIcons.vue";
  import NavigationIcon from "@/components/header/NavigationIcon.vue";
  import TmdbLogo from "@/icons/tmdb-logo.vue";
  import IconProfile from "@/icons/IconProfile.vue";
  import IconProfileLock from "@/icons/IconProfileLock.vue";
  import type INavigationIcon from "../../interfaces/INavigationIcon";

  const route = useRoute();
  const store = useStore();

  const signinNavigationIcon: INavigationIcon = {
    title: "Signin",
    route: "/signin",
    icon: IconProfileLock
  };

  const profileNavigationIcon: INavigationIcon = {
    title: "Profile",
    route: "/profile",
    icon: IconProfile
  };

  const isHome = computed(() => route.path === "/");
  const isOpen = computed(() => store.getters["hamburger/isOpen"]);
  const loggedIn = computed(() => store.getters["user/loggedIn"]);

  const profileRoute = computed(() =>
    !loggedIn.value ? signinNavigationIcon : profileNavigationIcon
  );
</script>

<style lang="scss" scoped>
  @import "src/scss/variables";
  @import "src/scss/media-queries";

  .spacer {
    @include mobile-only {
      width: 100%;
      height: $header-size;
    }
  }

  nav {
    display: grid;
    grid-template-columns: var(--header-size) 1fr var(--header-size);

    > * {
      z-index: 10;
    }
  }

  .nav__logo {
    overflow: hidden;
  }

  .logo {
    padding: 1rem;
    fill: var(--color-green);
    width: var(--header-size);
    height: var(--header-size);
    display: flex;
    align-items: center;
    justify-content: center;
    background: $background-nav-logo;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.08);
    }

    @include mobile {
      padding: 0.5rem;
    }
  }

  .navigation-icons-grid {
    display: flex;
    flex-wrap: wrap;
    position: fixed;
    top: var(--header-size);
    left: 0;
    width: 100%;
    background-color: $background-95;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.4s ease;

    opacity: 1;
    visibility: visible;

    &.open {
    }
  }
</style>
