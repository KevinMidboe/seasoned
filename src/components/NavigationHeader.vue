<template>
  <nav>
    <router-link class="nav__logo" to="/home" exact>
      <TmdbLogo class="logo" />
    </router-link>

    <SearchInput />

    <Hamburger />

    <NavigationIcon class="desktop-only" :route="profileRoute" />

    <div class="nav__list mobile-only" :class="{ open: isOpen }">
      <NavigationIcons>
        <NavigationIcon :route="profileRoute" />
      </NavigationIcons>
    </div>
  </nav>
</template>

<script>
import storage from "@/storage";
import TmdbLogo from "../icons/tmdb-logo";
import IconProfile from "../icons/IconProfile";
import IconProfileLock from "../icons/IconProfileLock";
import IconSettings from "../icons/IconSettings";
import IconActivity from "../icons/IconActivity";
import SearchInput from "@/components/SearchInput";
import NavigationIcons from "src/components/NavigationIcons";
import NavigationIcon from "src/components/ui/NavigationIcon";
import Hamburger from "@/components/ui/Hamburger";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    NavigationIcons,
    NavigationIcon,
    SearchInput,
    TmdbLogo,
    IconProfile,
    IconProfileLock,
    IconSettings,
    IconActivity,
    Hamburger
  },
  data() {
    return {
      listTypes: storage.homepageLists
    };
  },
  computed: {
    ...mapGetters("user", ["loggedIn"]),
    ...mapGetters("hamburger", ["isOpen"]),
    profileRoute() {
      return {
        title: !this.loggedIn ? "Signin" : "Profile",
        route: !this.loggedIn ? "/signin" : "/profile",
        icon: !this.loggedIn ? IconProfileLock : IconProfile
      };
    }
  }
};
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

.nav__list {
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

  &.open {
    opacity: 1;
    visibility: visible;
  }
}
</style>
