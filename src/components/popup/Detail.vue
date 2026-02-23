<template>
  <div class="movie-detail">
    <h2 class="title">{{ title }}</h2>
    <span v-if="detail" class="info">{{ detail }}</span>

    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    title: string;
    detail?: string | number;
  }

  defineProps<Props>();
</script>

<style lang="scss" scoped>
  @import "scss/media-queries";

  .movie-detail {
    margin-bottom: 20px;

    &:last-of-type {
      margin-bottom: 0px;
    }

    @include tablet-min {
      margin-bottom: 30px;
    }

    h2.title {
      margin: 0;
      font-weight: 400;
      text-transform: uppercase;
      font-size: 1.2rem;
      color: var(--highlight-color);

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
