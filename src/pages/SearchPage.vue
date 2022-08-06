<template>
  <div>
    <div style="display: flex; flex-direction: row">
      <label class="filter">
        <span>Search filter:</span>

        <toggle-button
          :options="toggleOptions"
          v-model:selected="mediaType"
          @change="toggleChanged"
        />
      </label>
    </div>

    <ResultsSection v-if="query" :title="title" :apiFunction="search" />
    <h1 v-else class="no-results">No query found, please search above</h1>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { searchTmdb } from "../api";

  import ResultsSection from "@/components/ResultsSection.vue";
  import PageHeader from "@/components/PageHeader.vue";
  import ToggleButton from "@/components/ui/ToggleButton.vue";
  import type { Ref } from "vue";
  import { ListTypes } from "../interfaces/IList";

  // interface ISearchParams {
  //   query: string;
  //   page: string;
  //   adult: string;
  //   media_type: string;
  // }

  const route = useRoute();
  const router = useRouter();

  const toggleOptions = ["all", ...Object.values(ListTypes)];
  const query: Ref<string> = ref(null);
  const page: Ref<number> = ref(1);
  const adult: Ref<boolean> = ref(false);
  const mediaType: Ref<ListTypes> = ref(null);

  const title = computed(() => `Search results: ${query.value}`);

  const urlQuery = route.query;
  if (urlQuery && urlQuery?.query) {
    query.value = decodeURIComponent(urlQuery?.query?.toString());
    page.value = Number(urlQuery?.page) || 1;
    adult.value = Boolean(urlQuery?.adult) || adult.value;
    mediaType.value = (urlQuery?.media_type as ListTypes) || mediaType.value;
  }

  let search = (
    _page = page.value || 1,
    _mediaType = mediaType.value || "all"
  ) => {
    return searchTmdb(query.value, _page, adult.value, _mediaType);
  };

  function toggleChanged() {
    updateQueryParams();
  }

  function updateQueryParams() {
    const { query, page, adult, media_type } = route.query;

    router.push({
      path: "search",
      query: {
        ...route.query,
        media_type: mediaType.value
      }
    });
  }
</script>

<style lang="scss" scoped>
  @import "src/scss/media-queries";

  .filter {
    margin-top: 0.5rem;
    margin-left: 1.25rem;
    display: inline-flex;
    flex-direction: column;

    span {
      font-size: 1.1rem;
      line-height: 1;
      margin: 0.5rem 0;
      font-weight: 300;
    }
  }

  .no-results {
    margin-top: 3rem;
    display: block;
    text-align: center;

    @include mobile {
      padding: 0 1rem;
      font-size: 1.5rem;
    }
  }
</style>
