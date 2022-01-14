<template>
  <div
    class="nav__hamburger"
    :class="{ open: isOpen }"
    @click="toggle"
    @keydown.enter="toggle"
    tabindex="0"
  >
    <div v-for="_ in 3" class="bar"></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters("hamburger", ["isOpen"])
  },
  methods: {
    ...mapActions("hamburger", ["toggle"])
  }
};
</script>

<style lang="scss" scoped>
@import "./src/scss/media-queries";

.nav__hamburger {
  display: block;
  position: relative;
  width: var(--header-size);
  height: var(--header-size);
  cursor: pointer;
  border-left: 1px solid var(--background-color);
  background-color: var(--background-color-secondary);

  @include tablet-min {
    display: none;
  }

  .bar {
    position: absolute;
    width: 23px;
    height: 1px;
    background-color: var(--text-color-70);
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
  &.open {
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
        background-color: var(--text-color-70);
      }
    }
  }
}
</style>
