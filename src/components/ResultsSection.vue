<template>
  <div ref="resultSection" class="resultSection">
    <list-header v-bind="{ title, info, shortList }" :sticky="true" />

    <div
      v-if="!loadedPages.includes(1) && loading == false"
      class="load-button"
    >
      <seasoned-button @click="loadLess" :fullWidth="true"
        >load previous</seasoned-button
      >
    </div>

    <results-list v-bind="{ results, shortList, loading }" />
    <loader v-if="loading" />

    <div ref="loadMoreButton" class="button-container">
      <seasoned-button
        class="load-button"
        v-if="!shortList && page != totalPages && results.length"
        @click="loadMore"
        :fullWidth="true"
        >load more</seasoned-button
      >
    </div>
  </div>
</template>

<script>
import ListHeader from "@/components/ListHeader";
import ResultsList from "@/components/ResultsList";
import SeasonedButton from "@/components/ui/SeasonedButton";
import store from "@/store";
import { getTmdbMovieListByName } from "@/api";
import Loader from "@/components/ui/Loader";

export default {
  props: {
    apiFunction: {
      type: Function,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    shortList: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  components: { ListHeader, ResultsList, SeasonedButton, Loader },
  data() {
    return {
      results: [],
      page: 1,
      loadedPages: [],
      totalPages: -1,
      totalResults: 0,
      loading: true,
      autoLoad: false,
      observer: undefined
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
    loadMore() {
      if (!this.autoLoad) {
        this.autoLoad = true;
      }

      this.loading = true;
      let maxPage = [...this.loadedPages].slice(-1)[0];

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
    getPageFromUrl() {
      return new URLSearchParams(window.location.search).get("page");
    },
    getListResults(front = false) {
      this.apiFunction(this.page)
        .then(results => {
          if (!front) this.results = this.results.concat(...results.results);
          else this.results = results.results.concat(...this.results);
          this.page = results.page;
          this.loadedPages.push(this.page);
          this.loadedPages = this.loadedPages.sort((a, b) => a - b);
          this.totalPages = results.total_pages;
          this.totalResults = results.total_results;
        })
        .then(this.updateQueryParams)
        .finally(() => (this.loading = false));
    },
    setupAutoloadObserver() {
      this.observer = new IntersectionObserver(this.handleButtonIntersection, {
        root: this.$refs.resultSection.$el,
        rootMargin: "0px",
        threshold: 1.0
      });

      this.observer.observe(this.$refs.loadMoreButton);
    },
    handleButtonIntersection(entries) {
      entries.map(entry =>
        entry.isIntersecting && this.autoLoad ? this.loadMore() : null
      );
    }
  },
  created() {
    this.page = this.getPageFromUrl() || this.page;
    if (this.results.length === 0) this.getListResults();

    if (!this.shortList) {
      store.dispatch(
        "documentTitle/updateTitle",
        `${this.$router.history.current.name} ${this.title}`
      );
    }
  },
  mounted() {
    if (!this.shortList) {
      this.setupAutoloadObserver();
    }
  },
  beforeDestroy() {
    this.observer = undefined;
  }
};
</script>

<style lang="scss" scoped>
@import "src/scss/media-queries";

.resultSection {
  background-color: var(--background-color);
}

.button-container {
  display: flex;
  justify-content: center;
  display: flex;
  width: 100%;
}

.load-button {
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
