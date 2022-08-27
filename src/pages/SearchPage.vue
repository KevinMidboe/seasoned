<template>
  <div>
    <div style="display: flex; flex-direction: row">
      <div class="filter">
        <span>Search filter:</span>

        <toggle-button
          v-model:selected="mediaType"
          :options="toggleOptions"
          @change="toggleChanged"
        />
      </div>
    </div>

    <ResultsSection
      :key="query"
      v-if="query"
      :title="title"
      :api-function="search"
    />
    <h1 v-else class="no-results">No query found, please search above</h1>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from "vue";
  import { useRoute, useRouter } from "vue-router";

  import ResultsSection from "@/components/ResultsSection.vue";
  import ToggleButton from "@/components/ui/ToggleButton.vue";
  import type { Ref } from "vue";
  import { searchTmdb } from "../api";
  import { MediaTypes } from "../interfaces/IList";

  // interface ISearchParams {
  //   query: string;
  //   page: string;
  //   adult: string;
  //   media_type: string;
  // }

  const route = useRoute();
  const router = useRouter();

  const toggleOptions = ["all", ...Object.values(MediaTypes)];
  const query: Ref<string> = ref(null);
  const page: Ref<number> = ref(1);
  const adult: Ref<boolean> = ref(false);
  const mediaType: Ref<MediaTypes> = ref(null);

  const title = computed(() => `Search results: ${query.value}`);

  function readQueryParams() {
    const urlQuery = route.query;
    if (urlQuery && urlQuery?.query) {
      query.value = decodeURIComponent(urlQuery?.query?.toString());
      page.value = Number(urlQuery?.page) || 1;
      adult.value = Boolean(urlQuery?.adult) || adult.value;
      mediaType.value = (urlQuery?.media_type as MediaTypes) || mediaType.value;
    }
  }

  const search = (
    _page = page.value || 1,
    _mediaType = mediaType.value || "all"
  ) => {
    return searchTmdb(query.value, _page, adult.value, _mediaType);
  };

  function updateQueryParams() {
    router.push({
      path: "search",
      query: {
        ...route.query,
        media_type: mediaType.value
      }
    });
  }

  function toggleChanged() {
    updateQueryParams();
  }

  readQueryParams();
  watch(
    () => route.fullPath,
    () => readQueryParams()
  );
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
