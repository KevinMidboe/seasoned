<template>
  <div>
    <ul
      v-if="results && results.length"
      class="results"
      :class="{ shortList: shortList }"
    >
      <results-list-item
        v-for="(result, index) in results"
        :key="`${result.type}-${result.id}-${index}`"
        :listItem="result"
      />
    </ul>

    <span v-else-if="!loading" class="no-results">No results found</span>
  </div>
</template>

<script setup lang="ts">
  import { defineProps } from "vue";
  import ResultsListItem from "@/components/ResultsListItem.vue";
  import type { ListResults } from "../interfaces/IList";

  interface Props {
    results: Array<ListResults>;
    shortList?: Boolean;
    loading?: Boolean;
  }

  const props = defineProps<Props>();
</script>

<style lang="scss" scoped>
  @import "src/scss/media-queries";
  @import "src/scss/main";

  .no-results {
    width: 100%;
    display: block;
    text-align: center;
    margin: 1.5rem;
    font-size: 1.2rem;
  }

  .results {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(225px, 1fr));
    grid-auto-rows: auto;
    margin: 0;
    padding: 0;
    list-style: none;

    @include mobile {
      grid-template-columns: repeat(2, 1fr);
    }

    &.shortList {
      overflow: auto;
      grid-auto-flow: column;
      max-width: 100vw;

      @include noscrollbar;

      > li {
        min-width: 225px;
      }

      @include tablet-min {
        max-width: calc(100vw - var(--header-size));
      }
    }
  }
</style>
