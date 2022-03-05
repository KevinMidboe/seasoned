<template>
  <transition name="shut">
    <ul class="dropdown">
      <li
        v-for="result in searchResults"
        :key="`${result.index}-${result.title}-${result.type}`"
        @click="openPopup(result)"
        :class="
          `result di-${result.index} ${result.index === index ? 'active' : ''}`
        "
      >
        <IconMovie v-if="result.type == 'movie'" class="type-icon" />
        <IconShow v-if="result.type == 'show'" class="type-icon" />
        <span class="title">{{ result.title }}</span>
      </li>

      <li
        v-if="searchResults.length"
        :class="`info di-${searchResults.length}`"
      >
        <span> Select from list or press enter to search </span>
      </li>
    </ul>
  </transition>
</template>

<script>
import { mapActions } from "vuex";
import IconMovie from "src/icons/IconMovie";
import IconShow from "src/icons/IconShow";
import IconPerson from "src/icons/IconPerson";
import { elasticSearchMoviesAndShows } from "@/api";

export default {
  components: { IconMovie, IconShow, IconPerson },
  props: {
    query: {
      type: String,
      default: null,
      required: false
    },
    index: {
      type: Number,
      default: -1,
      required: false
    },
    results: {
      type: Array,
      default: [],
      required: false
    }
  },
  watch: {
    query(newQuery) {
      if (newQuery && newQuery.length > 1) this.fetchAutocompleteResults();
    }
  },
  data() {
    return {
      searchResults: [],
      keyboardNavigationIndex: 0,
      numberOfResults: 10
    };
  },
  methods: {
    ...mapActions("popup", ["open"]),
    openPopup(result) {
      const { id, type } = result;
      this.open({ id, type });
    },
    fetchAutocompleteResults() {
      this.keyboardNavigationIndex = 0;
      this.searchResults = [];

      elasticSearchMoviesAndShows(this.query, this.numberOfResults).then(
        resp => {
          const data = resp.hits.hits;

          let results = data.map(item => {
            let index = null;
            if (item._source.log.file.path.includes("movie")) index = "movie";
            if (item._source.log.file.path.includes("series")) index = "show";

            if (index === "movie" || index === "show") {
              return {
                title:
                  item._source.original_name || item._source.original_title,
                id: item._source.id,
                adult: item._source.adult,
                type: index
              };
            }
          });

          results = this.removeDuplicates(results);
          results = results.map((el, index) => {
            return { ...el, index };
          });

          this.$emit("update:results", results);
          this.searchResults = results;
        }
      );
    },
    removeDuplicates(searchResults) {
      let filteredResults = [];
      searchResults.map(result => {
        if (result === undefined) return;
        const numberOfDuplicates = filteredResults.filter(
          filterItem => filterItem.id == result.id
        );
        if (numberOfDuplicates.length >= 1) {
          return null;
        }
        filteredResults.push(result);
      });

      if (this.adult == false) {
        filteredResults = filteredResults.filter(
          result => result.adult == false
        );
      }

      return filteredResults;
    }
  },
  created() {
    if (this.query) this.fetchAutocompleteResults();
  }
};
</script>

<style lang="scss" scoped>
@import "src/scss/variables";
@import "src/scss/media-queries";
@import "src/scss/main";
$sizes: 22;

@for $i from 0 through $sizes {
  .dropdown .di-#{$i} {
    visibility: visible;
    transform-origin: top center;
    animation: scaleZ 200ms calc(50ms * #{$i}) ease-in forwards;
  }
}

@keyframes scaleZ {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  80% {
    transform: scale(1.07);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.dropdown {
  top: var(--header-size);
  position: relative;
  height: 100%;
  width: 100%;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  z-index: 5;

  margin-top: -1px;
  border-top: none;
  padding: 0;

  @include mobile {
    position: fixed;
    left: 0;
    max-width: 100vw;
  }

  @include tablet-min {
    top: unset;
    --gutter: 1.5rem;
    max-width: calc(100% - (2 * var(--gutter)));
    margin: -1px var(--gutter) 0 var(--gutter);
  }

  @include desktop {
    max-width: 720px;
  }
}

li.result {
  background-color: var(--background-95);
  color: var(--text-color-50);
  padding: 0.5rem 2rem;
  list-style: none;

  opacity: 0;
  height: 56px;
  width: 100%;
  visibility: hidden;
  display: flex;
  align-items: center;
  padding: 0.5rem 2rem;

  font-size: 1.4rem;
  text-transform: capitalize;
  list-style: none;
  cursor: pointer;
  white-space: nowrap;

  transition: color 0.1s ease, fill 0.4s ease;

  span {
    overflow-x: hidden;
    text-overflow: ellipsis;
    transition: inherit;
  }

  &.active,
  &:hover,
  &:active {
    color: var(--text-color);
    border-bottom: 2px solid var(--color-green);

    .type-icon {
      fill: var(--text-color);
    }
  }

  .type-icon {
    width: 28px;
    height: 28px;
    margin-right: 1rem;
    transition: inherit;
    fill: var(--text-color-50);
  }
}

li.info {
  visibility: hidden;
  opacity: 0;
  display: flex;
  justify-content: center;
  padding: 0 1rem;
  color: var(--text-color-50);
  background-color: var(--background-95);
  color: var(--text-color-50);
  font-size: 0.6rem;
  height: 16px;
  width: 100%;
}

.shut-leave-to {
  height: 0px;
  transition: height 0.4s ease;
  flex-wrap: no-wrap;
  overflow: hidden;
}
</style>
