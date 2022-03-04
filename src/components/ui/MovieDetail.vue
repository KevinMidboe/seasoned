<template>
  <div class="movie-detail">
    <h2 class="title">{{ title }}</h2>
    <span v-if="detail" class="info">{{ detail }}</span>

    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    detail: {
      required: false,
      default: null
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./src/scss/media-queries";

.movie-detail {
  margin-bottom: 20px;
  margin-right: 20px;

  &:last-of-type {
    margin-bottom: 0px;
  }

  @include tablet-min {
    margin-bottom: 30px;
    margin-right: 30px;
  }

  h2.title {
    margin: 0;
    font-weight: 400;
    text-transform: uppercase;
    font-size: 1.2rem;
    color: var(--color-green);

    @include mobile {
      font-size: 1.1rem;
    }
  }

  span.info {
    font-weight: 300;
    font-size: 1rem;
    letter-spacing: 0.8px;
    margin-top: 5px;
  }
}
</style>
