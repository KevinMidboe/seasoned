<template>
  <transition name="shut">
    <ul class="dropdown">
      <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
      <li
        v-for="(result, _index) in searchResults"
        :key="`${_index}-${result.title}-${result.type}`"
        :class="`result di-${_index} ${_index === index ? 'active' : ''}`"
        @click="openPopup(result)"
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

<script setup lang="ts">
  import type { Ref } from "vue";
  import { ref, watch, defineProps } from "vue";
  import { useStore } from "vuex";
  import IconMovie from "../../icons/IconMovie.vue";
  import IconShow from "../../icons/IconShow.vue";
  import { elasticSearchMoviesAndShows } from "../../api";
  import { MediaTypes } from "../../interfaces/IList";
  import type {
    IAutocompleteResult,
    IAutocompleteSearchResults
  } from "../../interfaces/IAutocompleteSearch";

  interface Props {
    query?: string;
    index?: number;
    results?: Array<IAutocompleteResult>;
  }

  interface Emit {
    (e: "update:results", value: Array<IAutocompleteResult>);
  }

  const numberOfResults = 10;
  const props = defineProps<Props>();
  const emit = defineEmits<Emit>();
  const store = useStore();

  const searchResults: Ref<Array<IAutocompleteResult>> = ref([]);
  const keyboardNavigationIndex: Ref<number> = ref(0);

  let disableOnFailure = false;

  watch(
    () => props.query,
    newQuery => {
      if (newQuery?.length > 0 && !disableOnFailure)
        fetchAutocompleteResults(); /* eslint-disable-line no-use-before-define */
    }
  );

  function openPopup(result: IAutocompleteResult) {
    if (!result.id || !result.type) return;

    store.dispatch("popup/open", { ...result });
  }

  function removeDuplicates(_searchResults: Array<IAutocompleteResult>) {
    const filteredResults = [];
    _searchResults.forEach(result => {
      if (result === undefined) return;
      const numberOfDuplicates = filteredResults.filter(
        filterItem => filterItem.id === result.id
      );
      if (numberOfDuplicates.length >= 1) {
        return;
      }

      filteredResults.push(result);
    });

    return filteredResults;
  }

  function elasticTypeToMediaType(type: string): MediaTypes {
    if (type === "movie") return MediaTypes.Movie;
    if (type === "tv_series") return MediaTypes.Show;

    return null;
  }

  function parseElasticResponse(elasticResponse: IAutocompleteSearchResults) {
    const { hits } = elasticResponse.hits;
    const data = hits.length > 0 ? hits : (searchResults.value ?? []);

    const results: Array<IAutocompleteResult> = [];

    data.forEach(item => {
      if (!item._index) return;

      results.push({
        title: item._source?.original_name || item._source.original_title,
        id: item._source.id,
        adult: item._source.adult,
        type: elasticTypeToMediaType(item._source.type)
      });
    });

    return removeDuplicates(results).map((el, index) => {
      return { ...el, index };
    });
  }

  async function fetchAutocompleteResults() {
    keyboardNavigationIndex.value = 0;
    searchResults.value = [];

    return elasticSearchMoviesAndShows(props.query, numberOfResults)
      .catch(error => {
        // TODO display error
        disableOnFailure = true;
        throw error;
      })
      .then(elasticResponse => parseElasticResponse(elasticResponse))
      .then(_searchResults => {
        emit("update:results", _searchResults);
        searchResults.value = _searchResults;
      })
      .catch(error => {
        // TODO display error
        disableOnFailure = true;
        throw error;
      });
  }

  // on load functions
  fetchAutocompleteResults();
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";
  @import "scss/main";
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

    transition:
      color 0.1s ease,
      fill 0.4s ease;

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
