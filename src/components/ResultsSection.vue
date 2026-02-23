<template>
  <div ref="resultSection" class="resultSection">
    <page-header v-bind="{ title, info, shortList }" />

    <div
      v-if="!loadedPages.includes(1) && loading == false"
      class="button-container"
    >
      <seasoned-button class="load-button" :full-width="true" @click="loadLess"
        >load previous</seasoned-button
      >
    </div>

    <results-list v-bind="{ results, shortList, loading }" />
    <loader v-if="loading" />

    <div ref="loadMoreButton" class="button-container">
      <seasoned-button
        v-if="!loading && !shortList && page != totalPages && results.length"
        class="load-button"
        :full-width="true"
        @click="loadMore"
        >load more</seasoned-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  import PageHeader from "@/components/PageHeader.vue";
  import ResultsList from "@/components/ResultsList.vue";
  import SeasonedButton from "@/components/ui/SeasonedButton.vue";
  import Loader from "@/components/ui/Loader.vue";
  import type { Ref } from "vue";
  import type { IList, ListResults } from "../interfaces/IList";
  import type ISection from "../interfaces/ISection";

  interface Props extends ISection {
    title: string;
    apiFunction: (page: number) => Promise<IList>;
    shortList?: boolean;
  }

  const props = defineProps<Props>();

  const results: Ref<ListResults> = ref([]);
  const page: Ref<number> = ref(1);
  const loadedPages: Ref<number[]> = ref([]);
  const totalResults: Ref<number> = ref(0);
  const totalPages: Ref<number> = ref(0);
  const loading: Ref<boolean> = ref(true);
  const autoLoad: Ref<boolean> = ref(false);
  const observer: Ref<IntersectionObserver> = ref(null);
  const resultSection = ref(null);
  const loadMoreButton = ref(null);

  function pageCountString(_page: number, _totalPages: number) {
    return `Page ${_page} of ${_totalPages}`;
  }

  function resultCountString(_results: ListResults, _totalResults: number) {
    const loadedResults = _results.length;
    const __totalResults = _totalResults < 10000 ? _totalResults : "∞";
    return `${loadedResults} of ${__totalResults} results`;
  }

  function setLoading(state: boolean) {
    loading.value = state;
  }

  const info = computed(() => {
    if (results.value.length === 0) return [null, null];

    const pageCount = pageCountString(page.value, totalPages.value);
    const resultCount = resultCountString(results.value, totalResults.value);
    return [pageCount, resultCount];
  });

  function getPageFromUrl() {
    const _page = new URLSearchParams(window.location.search).get("page");
    if (!_page) return null;

    return Number(_page);
  }

  function updateQueryParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("page")) {
      params.set("page", page.value?.toString());
    } else if (page.value > 1) {
      params.append("page", page.value?.toString());
    }

    window.history.replaceState(
      {},
      "search",
      `${window.location.protocol}//${window.location.hostname}${
        window.location.port ? `:${window.location.port}` : ""
      }${window.location.pathname}${
        params.toString().length ? `?${params}` : ""
      }`
    );
  }

  function getListResults(front = false) {
    props
      .apiFunction(page.value)
      .then(listResponse => {
        if (!front)
          results.value = results.value.concat(...listResponse.results);
        else results.value = listResponse.results.concat(...results.value);

        page.value = listResponse.page;
        loadedPages.value.push(page.value);
        loadedPages.value = loadedPages.value.sort((a, b) => a - b);
        totalPages.value = listResponse.total_pages;
        totalResults.value = listResponse.total_results;
      })
      .then(updateQueryParams)
      .finally(() => setLoading(false));
  }

  function loadMore() {
    if (!autoLoad.value) {
      autoLoad.value = true;
    }

    loading.value = true;
    const maxPage = [...loadedPages.value].slice(-1)[0];

    if (Number.isNaN(maxPage)) return;
    page.value = maxPage + 1;
    getListResults();
  }

  function loadLess() {
    loading.value = true;
    const minPage = loadedPages.value[0];
    if (minPage === 1) return;

    page.value = minPage - 1;
    getListResults(true);
  }

  function handleButtonIntersection(entries) {
    entries.map(entry =>
      entry.isIntersecting && autoLoad.value ? loadMore() : null
    );
  }

  function setupAutoloadObserver() {
    observer.value = new IntersectionObserver(handleButtonIntersection, {
      root: resultSection.value.$el,
      rootMargin: "0px",
      threshold: 0
    });

    observer.value.observe(loadMoreButton.value);
  }

  page.value = getPageFromUrl() || page.value;
  if (results.value?.length === 0) getListResults();
  onMounted(() => {
    if (!props?.shortList) setupAutoloadObserver();
  });

  //   beforeDestroy() {
  //     this.observer = undefined;
  //   }
  // };
</script>

<style lang="scss" scoped>
  @import "scss/media-queries";

  .resultSection {
    background-color: var(--background-color);
  }

  .button-container {
    display: flex;
    justify-content: center;
    display: flex;
    width: 100%;
  }

  .load-button {
    margin: 2rem 0;

    @include mobile {
      margin: 1rem 0;
    }

    &:last-of-type {
      margin-bottom: 4rem;

      @include mobile {
        margin-bottom: 2rem;
      }
    }
  }
</style>
