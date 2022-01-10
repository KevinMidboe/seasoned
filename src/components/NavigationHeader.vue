<template>
  <nav>
    <router-link class="nav__logo" to="/home" exact>
      <TmdbLogo class="logo" />
    </router-link>

    <SearchInput />

    <div class="nav__hamburger" @click="toggleNav">
      <div v-for="_ in 3" class="bar"></div>
    </div>

    <router-link class="profile desktop-only" to="/profile">
      <li class="navigation-link">
        <icon-profile class="navigation-icon" />
        <span>{{ !userLoggedIn ? "Signin" : "Profile" }}</span>
      </li>
    </router-link>
    <!-- <NavigationIcons class="desktop-only" /> -->

    <div class="nav__list mobile-only">
      <NavigationIcons>
        <router-link
          v-if="userLoggedIn"
          class="settings"
          to="/profile?settings=true"
        >
          <li class="navigation-link">
            <icon-settings class="navigation-icon stroke" />
            <span>Settings</span>
          </li>
        </router-link>

        <router-link v-if="userLoggedIn" class="profile" to="/activity">
          <li class="navigation-link">
            <icon-activity class="navigation-icon stroke" />
            <span>Activity</span>
          </li>
        </router-link>

        <router-link class="profile" to="/profile">
          <li class="navigation-link">
            <icon-profile class="navigation-icon" />
            <span>{{ !userLoggedIn ? "Signin" : "Profile" }}</span>
          </li>
        </router-link>
      </NavigationIcons>

      <!--       <li class="nav__item nav__item--profile">
        <router-link
          class="nav__link nav__link--profile"
          :to="{ name: 'signin' }"
          v-if="!userLoggedIn"
        >
          <div class="nav__link-wrap">
            <svg class="nav__link-icon">
              <use xlink:href="#iconLogin"></use>
            </svg>
            <span class="nav__link-title">Sign in</span>
          </div>
        </router-link>

        <router-link
          class="nav__link nav__link--profile"
          :to="{ name: 'profile' }"
          v-if="userLoggedIn"
        >
          <div class="nav__link-wrap">
            <svg class="nav__link-icon">
              <use xlink:href="#iconLogin"></use>
            </svg>
            <span class="nav__link-title">Profile</span>
          </div>
        </router-link>
      </li> -->
    </div>
    <div style="z-index: -1"></div>
  </nav>
</template>

<script>
import storage from "@/storage";
import TmdbLogo from "../icons/tmdb-logo";
import IconProfile from "../icons/IconProfile";
import IconSettings from "../icons/IconSettings";
import IconActivity from "../icons/IconActivity";
import SearchInput from "@/components/SearchInput";
import NavigationIcons from "src/components/NavigationIcons";

export default {
  components: {
    NavigationIcons,
    SearchInput,
    TmdbLogo,
    IconProfile,
    IconSettings,
    IconActivity
  },
  data() {
    return {
      listTypes: storage.homepageLists,
      userLoggedIn: localStorage.getItem("token") ? true : false
    };
  },
  methods: {
    setUserStatus() {
      this.userLoggedIn = localStorage.getItem("token") ? true : false;
    },
    toggleNav() {
      document
        .querySelector(".nav__hamburger")
        .classList.toggle("nav__hamburger--active");
      document
        .querySelector(".nav__list")
        .classList.toggle("nav__list--active");
    }
  },
  created() {
    // TODO move this to state manager
    eventHub.$on("setUserStatus", this.setUserStatus);
  }
};
</script>

<style lang="scss">
@import "./src/scss/media-queries";

.profile.desktop-only .navigation-link,
.navigation-link {
  border-bottom: none;
  border-left: 1px solid var(--text-color-5);
}

.navigation-link {
  display: grid;
  place-items: center;
  list-style: none;
  padding: 1rem 0.15rem;
  margin: 0;
  text-align: center;
  background-color: var(--background-color-secondary);
  transition: transform 0.3s ease, color 0.3s ease, stoke 0.3s ease,
    fill 0.3s ease, background-color 0.5s ease;

  @include mobile {
    padding: 1rem;
    width: 50vw;
  }

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

      &.stroke {
        fill: none;
        stroke: var(--text-color);
      }
    }
  }

  span {
    text-transform: uppercase;
    margin-top: 0.75rem;
    font-size: 11px;
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

  &.stroke {
    fill: none;
    stroke: var(--text-color-70);
  }
}
</style>
<style lang="scss" scoped>
@import "./src/scss/variables";
@import "./src/scss/media-queries";

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

.logo {
  padding: 1rem;
  fill: var(--color-green);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.08);
  }

  @include mobile {
    padding: 0.5rem;
  }
}

.nav {
  // transition: background 0.5s ease;
  // position: fixed;
  // top: 0;
  // left: 0;
  // width: 100%;
  // height: 50px;
  // z-index: 10;
  // display: block;
  // color: $text-color;
  // background-color: $background-color-secondary;

  &__logo {
    width: var(--header-size);
    height: var(--header-size);
    display: flex;
    align-items: center;
    justify-content: center;
    background: $background-nav-logo;

    // &-image {
    //   width: 35px;
    //   height: 31px;
    //   fill: $green;
    //   transition: transform 0.5s ease;
    //   @include tablet-min {
    //     width: 45px;
    //     height: 40px;
    //   }
    // }
    // &:hover &-image {
    //   transform: scale(1.04);
    // }
  }
  &__hamburger {
    display: block;
    position: relative;
    width: var(--header-size);
    height: var(--header-size);
    cursor: pointer;
    border-left: 1px solid $background-color;
    background-color: var(--background-color-secondary);

    @include tablet-min {
      display: none;
    }
    .bar {
      position: absolute;
      width: 23px;
      height: 1px;
      background-color: $text-color-70;
      transition: all 300ms ease;
      &:nth-child(1) {
        left: 16px;
        top: 17px;
      }
      &:nth-child(2) {
        left: 16px;
        top: 25px;
        &:after {
          content: "";
          position: absolute;
          left: 0px;
          top: 0px;
          width: 23px;
          height: 1px;
          transition: all 300ms ease;
        }
      }
      &:nth-child(3) {
        right: 15px;
        top: 33px;
      }
    }
    &--active {
      .bar {
        &:nth-child(1),
        &:nth-child(3) {
          width: 0;
        }
        &:nth-child(2) {
          transform: rotate(-45deg);
        }
        &:nth-child(2):after {
          transform: rotate(-90deg);
          // background: rgba($c-dark, 0.5);
          background-color: $text-color-70;
        }
      }
    }
  }
  &__list {
    width: 100%;
    position: fixed;
    left: 0;
    top: var(--header-size);
    opacity: 0;
    transition: opacity 0.4s ease;
    visibility: hidden;

    @include mobile-only {
      display: flex;
      flex-wrap: wrap;
      background-color: $background-95;
      &--active {
        opacity: 1;
        visibility: visible;
      }
    }
    @include tablet-min {
      display: flex;
      position: relative;
      display: block;
      width: 100%;
      border-top: 0;
      top: 0;
    }
  }
}
</style>
