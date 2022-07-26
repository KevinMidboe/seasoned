<template>
  <section>
    <LandingBanner />

    <div v-for="list in lists" :key="list.name">
      <ResultsSection
        :apiFunction="list.apiFunction"
        :title="list.title"
        :shortList="true"
      />
    </div>
  </section>
</template>

<script>
import LandingBanner from "@/components/LandingBanner";
import ResultsSection from "@/components/ResultsSection";
import { getRequests, getTmdbMovieListByName } from "@/api";

export default {
  name: "home",
  components: { LandingBanner, ResultsSection },
  data() {
    return {
      imageFile: "/pulp-fiction.jpg",
      lists: [
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
      ]
    };
  }
};
</script>
