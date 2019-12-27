
<template>
  <div>
    <list-header :title="listTitle" :info="info" :sticky="true" />

    <results-list :results="results" v-if="results" />

    <loader v-if="!results.length" />

    <div v-if="page < totalPages" class="fullwidth-button">
      <seasoned-button @click="loadMore">load more</seasoned-button>
    </div>
  </div>
</template>


<script>
import ListHeader from '@/components/ListHeader'
import ResultsList from '@/components/ResultsList'
import SeasonedButton from '@/components/ui/SeasonedButton'
import Loader from '@/components/ui/Loader'
import { getTmdbMovieListByName, getRequests } from '@/api'
import store from '@/store'

export default {
  components: { ListHeader, ResultsList, SeasonedButton, Loader },
  data() {
    return {
      legalTmdbLists: [ 'now_playing', 'upcoming', 'popular' ],
      results: [],
      page: 1,
      totalPages: 0,
      totalResults: 0,
      loading: true
    }
  },
  computed: {
    listTitle() {
      if (this.results.length === 0)
        return ''

      const routeListName = this.$route.params.name
      console.log('routelistname', routeListName)
      return routeListName.includes('_') ? routeListName.split('_').join(' ') : routeListName
    },
    info() {
      if (this.results.length === 0)
        return [null, null]
      return [this.pageCount, this.resultCount]
    },
    resultCount() {
      const loadedResults = this.results.length
      const totalResults = this.totalResults < 10000 ? this.totalResults : '∞'
      return `${loadedResults} of ${totalResults} results`
    },
    pageCount() {
      return `Page ${this.page} of ${this.totalPages}`
    }
  },
  methods: {
    loadMore() {
      console.log(this.$route)
      this.loading = true;
      this.page++

      window.history.replaceState({}, 'search', `/#/${this.$route.fullPath}?page=${this.page}`)
      this.init()
    },
    init() {
      const routeListName = this.$route.params.name

      if (routeListName === 'request') {
        getRequests(this.page)
          .then(results => {
            this.results = this.results.concat(...results.results)
            this.page = results.page
            this.totalPages = results.total_pages
            this.totalResults = results.total_results
          })
      } else if (this.legalTmdbLists.includes(routeListName)) {
        getTmdbMovieListByName(routeListName, this.page)
          .then(results => {
            this.results = this.results.concat(...results.results)
            this.page = results.page
            this.totalPages = results.total_pages
            this.totalResults = results.total_results
          })
      } else {
        // TODO handle if list is not found
        console.log('404 this is not a tmdb list')
      }

      this.loading = false
    }
  },
  created() {
    if (this.results.length === 0)
      this.init()

    store.dispatch('documentTitle/updateTitle', `${this.$router.history.current.name} ${this.$route.params.name}`)
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
