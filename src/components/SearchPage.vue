<template>
  <div>
    <div style="display: flex; flex-direction: row">
      <label class="filter">
        <span>Search filter:</span>

        <toggle-button
          :options="['All', 'movie', 'show', 'person']"
          :selected="mediaType"
          @change="toggleChanged"
        />
      </label>
    </div>

    <ResultsSection :title="title" :apiFunction="searchTmdb" />
  </div>
</template>

<script>
import { searchTmdb } from "@/api";

import ResultsSection from "./ResultsSection";
import ListHeader from "@/components/ListHeader";
import ToggleButton from "@/components/ui/ToggleButton";

export default {
  components: { ResultsSection, ListHeader, ToggleButton },
  data() {
    return {
      query: "",
      page: 1,
      adult: false,
      mediaType: null
    };
  },
  computed: {
    title() {
      return `Search results: ${this.query}`;
    }
  },
  methods: {
    searchTmdb(page = this.page) {
      if (this.query && this.query.length)
        return searchTmdb(this.query, page, this.adult, this.mediaType);
    },
    toggleChanged(value) {
      if (["movie", "show", "person"].includes(value.toLowerCase())) {
        this.mediaType = value.toLowerCase();
      } else {
        this.mediaType = null;
      }
      this.updateQueryParams();
    },
    updateQueryParams() {
      const { query, page, adult, media_type } = this.$route.query;

      this.$router.push({
        path: "search",
        query: {
          ...this.$route.query,
          media_type: this.mediaType
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

<style lang="scss" scoped>
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
</style>
