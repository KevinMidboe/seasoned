<template>
  <div>
    <list-header :title="title" :info="resultCount" :sticky="true" />

    <results-list :results="results" />
    
    <div v-if="page < totalPages" class="fullwidth-button">
      <seasoned-button @click="loadMore">load more</seasoned-button>
    </div>

    <loader v-if="!results.length" />
  </div>
</template>

<script>
import { searchTmdb } from '@/api'
import ListHeader from '@/components/ListHeader'
import ResultsList from '@/components/ResultsList'
import SeasonedButton from '@/components/ui/SeasonedButton'
import Loader from '@/components/ui/Loader'

export default {
  components: { ListHeader, ResultsList, SeasonedButton, Loader },
  props: {
    propQuery: {
      type: String,
      required: false
    },
    propPage: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      loading: true,
      query: String,
      title: String,
      page: Number,
      totalPages: 0,
      results: [],
      totalResults: []
    }
  },
  computed: {
    resultCount() {
      const loadedResults = this.results.length
      const totalResults = this.totalResults < 10000 ? this.totalResults : '∞'
      return `${loadedResults} of ${totalResults} results`
    }
  },
  methods: {
    search(query=this.query, page=this.page) {
      searchTmdb(query, page)
        .then(this.parseResponse)
    },
    parseResponse(response) {
      const data = response.data

      if (this.results.length > 0) {
        this.results.push(...data.results)
      } else {
        this.results = data.results
      }

      this.totalPages = data.total_pages
      this.totalResults = data.total_results || data.results.length

      this.loading = false
    },
    loadMore() {
      this.page++

      window.history.replaceState({}, 'search', `/#/search?query=${this.query}&page=${this.page}`)
      this.search()
    }
  },
  created() {
    const { query, page } = this.$route.query

    if (!query) {
      // abort
      console.error('abort, no query')
    }
    this.query = decodeURIComponent(query)
    this.page = page ? page : 1
    this.title = `Search results: ${this.query}`

    this.search()
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