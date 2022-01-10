<template>
  <div>
    <button @click="updateQueryParams">Shows</button>
    <ResultsSection :title="title" :apiFunction="searchTmdb" />
  </div>
</template>

<script>
import ResultsSection from "./ResultsSection";
import { searchTmdb } from "@/api";

export default {
  components: { ResultsSection },
  data() {
    return {
      query: "",
      page: 1,
      adult: false,
      mediaType: null
    };
  },
  watch: {
    $route(to, from) {
      console.log("query", to, from);
      const { query, page, adult, media_type } = this.$route.query;
      if (query != this.query) console.log("query updated");
      if (page != this.page) console.log("page updated");
      if (adult != this.adult) console.log("adult updated");
      if (media_type != this.media_type) console.log("media_type updated");
    }
  },
  computed: {
    title() {
      return `Search results: ${this.query}`;
    }
  },
  methods: {
    searchTmdb(page = this.page) {
      return searchTmdb(this.query, page, this.adult, this.mediaType);
    },
    updateQueryParams() {
      console.log("updating");
      const { query, page, adult, media_type } = this.$route.query;
      this.media_type = media_type == "show" ? "movie" : "show";

      this.$router.push({
        path: "search",
        query: {
          ...this.$route.query,
          media_type: this.media_type
        }
      });
    }
  },
  created() {
    const { query, page, adult, media_type } = this.$route.query;

    if (!query) {
      // abort
      console.error("abort, no query");
    }
    this.query = decodeURIComponent(query);
    this.page = page || 1;
    this.adult = adult || this.adult;
    this.mediaType = media_type || this.mediaType;

    // this.searchTmdb();
  }
};
</script>

<style lang="scss" scoped></style>
