<template>
  <ResultsSection :title="sectionName" :api-function="_getSectionData" />
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import type { Ref } from "vue";
  import { useRoute } from "vue-router";
  import ResultsSection from "@/components/ResultsSection.vue";
  import { getTmdbMovieListByName, getTmdbMovieDiscoverByName } from "../api";

  const route = useRoute();
  const sectionName: Ref<string | string[]> = ref(
    route?.params?.name || "Section page"
  );

  // Determine if this is a discover section or a list based on the route path
  const isDiscoverSection = route.path.startsWith("/discover/");

  function _getSectionData(page: number) {
    const name = sectionName.value?.toString();

    // Use the appropriate API function based on the route type
    if (isDiscoverSection) {
      return getTmdbMovieDiscoverByName(name, page);
    } else {
      return getTmdbMovieListByName(name, page);
    }
  }
</script>

<style lang="scss" scoped>
  .fullwidth-button {
    width: 100%;
    margin: 1rem 0;
    padding-bottom: 2rem;
    display: flex;
    justify-content: center;
  }
</style>
