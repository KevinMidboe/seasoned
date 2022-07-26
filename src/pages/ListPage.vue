<template>
  <ResultsSection :title="listName" :apiFunction="getTmdbMovieListByName" />
</template>

<script>
import ResultsSection from "@/components/ResultsSection";
import { getTmdbMovieListByName } from "@/api";

export default {
  components: { ResultsSection },
  computed: {
    listName() {
      return this.$route.params.name;
    }
  },
  methods: {
    getTmdbMovieListByName(page) {
      return getTmdbMovieListByName(this.listName, page);
    }
  }
};
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
