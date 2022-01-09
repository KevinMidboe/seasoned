<template>
  <nav class="nav">
    <router-link
      class="nav__logo"
      :to="{ name: 'home' }"
      exact
      title="Vue.js — TMDb App"
    >
      <svg class="nav__logo-image">
        <use xlink:href="#svgLogo"></use>
      </svg>
    </router-link>

    <div class="nav__hamburger" @click="toggleNav">
      <div v-for="_ in 3" class="bar"></div>
    </div>

    <ul class="nav__list">
      <li class="nav__item" v-for="item in listTypes">
        <router-link class="nav__link" :to="'/list/' + item.route">
          <div class="nav__link-wrap">
            <svg class="nav__link-icon">
              <use :xlink:href="'#icon_' + item.route"></use>
            </svg>
            <span class="nav__link-title">{{ item.title }}</span>
          </div>
        </router-link>
      </li>

      <li class="nav__item mobile-only"></li>

      <li class="nav__item nav__item--profile">
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
      </li>
    </ul>
  </nav>
</template>

<script>
import storage from "@/storage";

export default {
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

<style lang="scss" scoped>
@import "./src/scss/variables";
@import "./src/scss/media-queries";

.icon {
  width: 30px;
}

.nav {
  transition: background 0.5s ease;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: var(--header-size);
  z-index: 10;
  display: block;
  color: $text-color;
  background-color: $background-color-secondary;

  @include tablet-min {
    top: 0;
    bottom: unset;
    width: 95px;
    height: 100vh;
  }
  &__logo {
    width: 95px;
    height: $header-size;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $background-nav-logo;

    @include mobile-only {
      align-items: flex-start;
      padding-top: 0.5rem;
      width: 55px;
    }

    &-image {
      width: 35px;
      height: 31px;
      fill: $green;
      transition: transform 0.5s ease;

      @include tablet-min {
        width: 45px;
        height: 40px;
      }
    }
    &:hover &-image {
      transform: scale(1.04);
    }
  }
  &__hamburger {
    display: block;
    position: fixed;
    width: 55px;
    height: 50px;
    bottom: 1.5rem;
    right: 0;
    cursor: pointer;
    z-index: 10;
    border-left: 1px solid $background-color;
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
    list-style: none;
    padding: 0;
    margin: 0;
    text-align: center;
    width: 100%;
    position: fixed;
    left: 0;
    top: 50px;
    border-top: 1px solid $background-color;

    @include mobile-only {
      display: flex;
      position: absolute;
      top: unset;
      bottom: var(--header-size);
      height: min-content;
      flex-wrap: wrap;
      font-size: 0;
      opacity: 0;
      visibility: hidden;
      background-color: $background-95;
      text-align: left;

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
  &__item {
    transition: background 0.5s ease, color 0.5s ease, border 0.5s ease;
    background-color: $background-color-secondary;
    color: $text-color-70;

    @include mobile-only {
      flex: 0 0 33.3%;
      text-align: center;
      border-bottom: 1px solid $background-color;
      &:nth-child(odd) {
        border-right: 1px solid $background-color;

        &:last-child {
          // flex: 0 0 100%;
        }
      }
    }
    @include tablet-min {
      width: 100%;
      border-bottom: 1px solid $text-color-5;

      &--profile {
        position: fixed;
        right: 0;
        top: 0;
        width: $header-size;
        height: $header-size;
        border-bottom: 0;
        border-left: 1px solid $background-color;
      }
    }
    &:hover,
    .is-active {
      color: $text-color;
      background-color: $background-color;
    }
  }
  &__link {
    background-color: inherit; // a elements have a transparent background
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    font-size: 7px;
    font-weight: 300;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    cursor: pointer;
    &-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    @include mobile-only {
      font-size: 10px;
      padding: 20px 0;
    }
    @include tablet-min {
      width: 95px;
      height: 95px;
      font-size: 9px;
      &--profile {
        width: 75px;
        height: 75px;
        background-color: $background-color-secondary;
      }
    }
    &-icon {
      width: 20px;
      height: 20px;
      fill: $text-color-70;
      @include tablet-min {
        width: 20px;
        height: 20px;
        margin-bottom: 5px;
      }
    }
    &-title {
      margin-top: 5px;
      display: block;
      width: 100%;
    }
    &:hover &-icon,
    &.is-active &-icon {
      fill: $text-color;
    }
  }
}
</style>
