<template>
  <section>
    <LandingBanner />

    <div v-for="list in lists" :key="list.title">
      <ResultsSection
        :api-function="list.apiFunction"
        :title="list.title"
        :short-list="true"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
  import LandingBanner from "@/components/LandingBanner.vue";
  import ResultsSection from "@/components/ResultsSection.vue";
  import { getRequests, getTmdbMovieListByName } from "../api";
  import type ISection from "../interfaces/ISection";

  const lists: ISection[] = [
    {
      title: "Requests",
      apiFunction: getRequests
    },
    {
      title: "Now playing",
      apiFunction: () => getTmdbMovieListByName("now_playing")
    },
    {
      title: "Upcoming",
      apiFunction: () => getTmdbMovieListByName("upcoming")
    },
    {
      title: "Popular",
      apiFunction: () => getTmdbMovieListByName("popular")
    }
  ];
</script>
