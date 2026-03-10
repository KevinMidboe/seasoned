<template>
  <section>
    <LandingBanner />

    <ResultsSection
      :api-function="getRequests"
      title="Requests"
      :short-list="true"
    />

    <ResultsSection
      :api-function="() => getTmdbMovieListByName('now_playing')"
      title="Now playing"
      :short-list="true"
      section-type="list"
    />

    <DiscoverMinimal />

    <ResultsSection
      :api-function="() => getTmdbMovieListByName('upcoming')"
      title="Upcoming"
      :short-list="true"
      section-type="list"
    />

    <ResultsSection
      :api-function="() => getTmdbMovieListByName('popular')"
      title="Popular"
      :short-list="true"
      section-type="list"
    />
  </section>
</template>

<script setup lang="ts">
  import LandingBanner from "@/components/LandingBanner.vue";
  import ResultsSection from "@/components/ResultsSection.vue";
  import DiscoverMinimal from "@/components/DiscoverMinimal.vue";
  import { getRequests, getTmdbMovieListByName } from "../api";
</script>
