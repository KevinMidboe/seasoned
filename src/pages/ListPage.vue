<template>
  <ResultsSection :title="listName" :api-function="_getTmdbMovieListByName" />
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import type { Ref } from "vue";
  import { useRoute } from "vue-router";
  import ResultsSection from "@/components/ResultsSection.vue";
  import { getTmdbMovieListByName } from "../api";

  const route = useRoute();
  const listName: Ref<string | string[]> = ref(
    route?.params?.name || "List page"
  );

  function _getTmdbMovieListByName(page: number) {
    return getTmdbMovieListByName(listName.value?.toString(), page);
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
