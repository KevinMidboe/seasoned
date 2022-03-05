<template>
  <div>
    <ul
      v-if="results && results.length"
      class="results"
      :class="{ shortList: shortList }"
    >
      <movies-list-item
        v-for="(movie, index) in results"
        :key="`${movie.type}-${movie.id}-${index}`"
        :movie="movie"
      />
    </ul>

    <span v-else class="no-results">No results found</span>
  </div>
</template>

<script>
import MoviesListItem from "@/components/MoviesListItem";

export default {
  components: { MoviesListItem },
  props: {
    results: {
      type: Array,
      required: true
    },
    shortList: {
      type: Boolean,
      required: false,
      default: false
    }
  }
};
</script>

<style lang="scss">
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
