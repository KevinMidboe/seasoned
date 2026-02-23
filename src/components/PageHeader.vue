<template>
  <header>
    <h2>{{ prettify }}</h2>
    <h3>{{ subtitle }}</h3>

    <router-link
      v-if="shortList"
      :to="urlify"
      class="view-more"
      :aria-label="`View all ${title}`"
    >
      View All
    </router-link>

    <div v-else-if="info">
      <div v-if="info instanceof Array" class="flex flex-direction-column">
        <span v-for="item in info" :key="item" class="info">{{ item }}</span>
      </div>

      <span v-else class="info">{{ info }}</span>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { computed } from "vue";

  interface Props {
    title: string;
    subtitle?: string;
    info?: string | Array<string>;
    link?: string;
    shortList?: boolean;
  }

  const props = defineProps<Props>();

  const urlify = computed(() => {
    return `/list/${props.title.toLowerCase().replace(" ", "_")}`;
  });

  const prettify = computed(() => {
    return props.title.includes("_")
      ? props.title.split("_").join(" ")
      : props.title;
  });
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";
  @import "scss/main";

  header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.75rem;
    background-color: $background-color;

    position: sticky;
    position: -webkit-sticky;
    top: $header-size;
    z-index: 1;

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
