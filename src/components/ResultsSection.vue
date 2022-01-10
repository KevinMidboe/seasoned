<template>
  <div>
    <list-header :title="prettify(title)" :info="info" :sticky="true" />

    <div
      v-if="!loadedPages.includes(1) && loading == false"
      class="load-button"
    >
      <seasoned-button @click="loadLess" :fullWidth="true"
        >load previous</seasoned-button
      >
    </div>

    <results-list :results="results" v-if="results" />

    <loader v-if="!results.length" />

    <div v-if="page < totalPages" class="load-button">
      <seasoned-button @click="loadMore" :fullWidth="true"
        >load more</seasoned-button
      >
    </div>
  </div>
</template>

<script>
import ListHeader from "@/components/ListHeader";
import ResultsList from "@/components/ResultsList";
import SeasonedButton from "@/components/ui/SeasonedButton";
import Loader from "@/components/ui/Loader";
import store from "@/store";

export default {
  props: {
    apiFunction: {
      type: Function,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  components: { ListHeader, ResultsList, SeasonedButton, Loader },
  data() {
    return {
      results: [],
      page: 1,
      loadedPages: [],
      totalPages: 0,
      totalResults: 0,
      loading: true
    };
  },
  computed: {
    info() {
      if (this.results.length === 0) return [null, null];
      return [this.pageCount, this.resultCount];
    },
    resultCount() {
      const loadedResults = this.results.length;
      const totalResults = this.totalResults < 10000 ? this.totalResults : "∞";
      return `${loadedResults} of ${totalResults} results`;
    },
    pageCount() {
      return `Page ${this.page} of ${this.totalPages}`;
    }
  },
  methods: {
    prettify(listName) {
      return listName.includes("_") ? listName.split("_").join(" ") : listName;
    },
    loadMore() {
      this.loading = true;
      let maxPage = [...this.loadedPages].slice(-1)[0];
      console.log("maxPage:", maxPage);
      if (maxPage == NaN) return;
      this.page = maxPage + 1;
      this.getListResults();
    },
    loadLess() {
      this.loading = true;
      const minPage = this.loadedPages[0];
      if (minPage === 1) return;

      this.page = minPage - 1;
      this.getListResults(true);
    },
    updateQueryParams() {
      let params = new URLSearchParams(window.location.search);
      if (params.has("page")) {
        params.set("page", this.page);
      } else if (this.page > 1) {
        params.append("page", this.page);
      }

      window.history.replaceState(
        {},
        "search",
        `${window.location.protocol}//${window.location.hostname}${
          window.location.port ? `:${window.location.port}` : ""
        }${window.location.pathname}${
          params.toString().length ? `?${params}` : ""
        }`
      );
    },
    getPageFromQueryParams() {
      return new URLSearchParams(window.location.search).get("page");
    },
    getListResults(front = false) {
      this.apiFunction(this.page)
        .then(results => {
          if (front) this.results = results.results.concat(...this.results);
          else this.results = this.results.concat(...results.results);
          this.page = results.page;
          this.loadedPages.push(this.page);
          this.loadedPages = this.loadedPages.sort();
          this.totalPages = results.total_pages;
          this.totalResults = results.total_results;
        })
        .then(this.updateQueryParams)
        .finally(() => (this.loading = false));
    }
  },
  created() {
    this.page = this.getPageFromQueryParams() || this.page;
    if (this.results.length === 0) this.getListResults();

    store.dispatch(
      "documentTitle/updateTitle",
      `${this.$router.history.current.name} ${this.$route.params.name}`
    );
  }
};
</script>

<style lang="scss" scoped>
@import "./src/scss/media-queries";

.load-button {
  display: flex;
  width: 100%;
  justify-content: center;
  margin: 2rem 0;

  @include mobile {
    margin: 1rem 0;
  }

  &:last-of-type {
    margin-bottom: 4rem;

    @include mobile {
      margin-bottom: 2rem;
    }
  }
}
</style>
