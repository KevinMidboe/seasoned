<template>
  <header :class="{ sticky: sticky }">
    <h2>{{ title }}</h2>

    <div v-if="info instanceof Array" class="flex flex-direction-column">
      <span v-for="item in info" class="info">{{ item }}</span>
    </div>
    <span v-else class="info">{{ info }}</span>
    <router-link
      v-if="link"
      :to="link"
      class="view-more"
      :aria-label="`View all ${title}`"
    >
      View All
    </router-link>
  </header>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    sticky: {
      type: Boolean,
      required: false,
      default: true
    },
    info: {
      type: [String, Array],
      required: false
    },
    link: {
      type: String,
      required: false
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/scss/variables";
@import "src/scss/media-queries";
@import "src/scss/main";

header {
  width: 100%;
  min-height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0.75rem;
  padding-right: 0.75rem;

  &.sticky {
    background-color: $background-color;

    position: sticky;
    position: -webkit-sticky;
    top: $header-size;
    z-index: 1;
  }

  h2 {
    font-size: 1.4rem;
    font-weight: 300;
    text-transform: capitalize;
    line-height: 1.4rem;
    margin: 0;
    color: $text-color;
  }

  .view-more {
    font-size: 0.9rem;
    font-weight: 300;
    letter-spacing: 0.5px;
    color: $text-color-70;
    text-decoration: none;
    transition: color 0.5s ease;
    cursor: pointer;

    &:after {
      content: " →";
    }
    &:hover {
      color: $text-color;
    }
  }

  .info {
    font-size: 13px;
    font-weight: 300;
    letter-spacing: 0.5px;
    color: $text-color;
    text-decoration: none;
    text-align: right;
  }

  @include tablet-min {
    padding-left: 1.25rem;
  }
  @include desktop-lg-min {
    padding-left: 1.75rem;
  }
}
</style>
