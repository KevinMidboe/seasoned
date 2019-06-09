<template>
  <div>
    <div class='movies-list' v-if="!error">
      <header class='list-header'>
        <h2 class='header__title'>{{ listTitle }}</h2>

        <router-link class='header__view-more'
                     :to="'/list/' + list.route"
                     v-if='shortList'>
                     View All</router-link>

        <div v-else style="line-height: 0;">
          <span class='header__result-count' v-if="totalResults">{{ resultCount }} results</span>
          <loading-placeholder v-else :count="1" lineClass='short nomargin'></loading-placeholder>
        </div>
      </header>

      <!-- <ul class="filter">
        <li class="filter-item" v-for="(item, index) in results" @click="applyFilter(item, index)" :class="{'active': item === selectedRelaseType}">{{ item.title }}</li>
      </ul> -->

      <ul class='results'>
        <movies-list-item v-for='movie in results' :movie="movie" :shortList="shortList"></movies-list-item>
      </ul>

      <loader v-if="loader" />

      <div class='end-section' v-if="!shortList">
        <seasoned-button v-if="currentPage < totalPages" @click="loadMore">load more</seasoned-button>
      </div>
    </div>

    <div v-else style="display: flex; height: 50vh; width: 100%; justify-content: center; align-items: center;">

      <h1 v-if="error">{{ error }}</h1>
      <h1 v-else>Unable to load list: {{ listTitle }}</h1>
    </div>
  </div>
</template>

<script>
import storage from '@/storage.js'
import MoviesListItem from '@/components/MoviesListItem.vue'
import SeasonedButton from '@/components/ui/SeasonedButton.vue'
import LoadingPlaceholder from '@/components/ui/LoadingPlaceholder.vue'
import Loader from '@/components/ui/Loader.vue'
import { searchTmdb, getTmdbListByPath } from '@/api.js'

export default {
  props: {
    shortList: {
      type: Boolean,
      default: false
    },
    propList: Object
  },
  components: { MoviesListItem, SeasonedButton, LoadingPlaceholder, Loader },
  data() {
    return {
      listTitle: 'No listname found',
      results: [],
      currentPage: 1,
      totalResults: 0,
      totalPages: -1,
      fetchingResults: false,
      error: undefined,
      loader: false,

      filters: {
        status: {
          elms: ['all', 'requested', 'downloading', 'downloaded'],
          selected: 0,
        }
      }
    }
  },
  computed: {
    resultCount() {
      return this.totalResults.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    }
  },
  beforeMount() {
    if (this.propList) {
      this.list = this.propList
    }

    this.setPageFromUrlQuery()
    this.parseURI()
  },
  mounted() {
    setTimeout(() => {
      if (this.results.length === 0 && this.error === undefined) {
        this.loader = true
      }
    }, 200)
  },
  methods: {
    setPageFromUrlQuery() {
      if (this.$route.query.page)
        this.currentPage = this.$route.query.page
        console.log('url page param found', this.currentPage)
    },
    getListByName(name) {
      return storage.homepageLists.filter(list => list.route === name)[0]
    },
    parseURI() {
      const currentRouteName = this.$route.name

      // route name is list - we are in a list view
      if (currentRouteName === 'list') {
        const nameParam = this.$route.params.name
        if (this.getListByName(nameParam)) {
          this.list = this.getListByName(nameParam)
          this.listTitle = this.list.title
          this.fetchListitems()
        } else {
          this.error = `Unable to load list: `
        }
      } // route name is search - we are searcing
      else if (currentRouteName === 'search') {
        if (this.$route.query.query) {
          this.query = decodeURIComponent(this.$route.query.query)
          this.listTitle = 'Search results: ' + this.query
          this.fetchSearchItems()
        } else {
          this.error = 'Search query is not defined, please try again'
        }

      } // no matched route found - using prop to fetch list items
      else {
        this.listTitle = this.list.title
        this.fetchListitems()
      }

      document.title = this.listTitle
    },
    // TODO these should receive a path not get it from list instance
    fetchListitems() {
      getTmdbListByPath(this.list.path, this.currentPage)
       .then(this.parseResponse)
       .catch(error => {
          console.error(error)
          this.error = 'Network error'
       })
    },
    fetchSearchItems() {
      searchTmdb(this.query, this.currentPage)
        .then(this.parseResponse)
    },

    // TODO what parts are modular and what parts do we  want the component to deal with
    // if we pass in some object and then as we initialize we set to local variables.
    // This way we call the http-api from outside and pass the response in to the component[0]
    // Could also parse the response we are requesting then return a clean object we can
    // pass down[1].

    // [0] if this is done we should also take the page, total pages, total results and
    //     the list of results. Maybe also the title of the list  or use local title as fallback?
    // [1] an issue with this that duplicate code will be needed for doing the same with
    //     url params and paths.
    //      (What if we eliminated folder based routes and implemented the routes in hashes
    //       with single page applications today the navigation is simple enought that it
    //       would maybe not be needed to have a path-route but a hash-local.storage
    //       implementation; would allow sharing and remembering paths is just silly for most
    //       Single-Page-Applications that are tightly scoped applications)
    parseResponse(response) {
      const data = response.data
      if (data.page > data.total_pages) {
        console.error('You have reached the end')
        this.error = 'You have reached the end'
        return
      }

      if (this.results.length) {
        this.results.push(...data.results)
      } else {
        this.results = this.shortList ? data.results.slice(0,12) : data.results
      }
      this.page = data.page
      this.totalPages = data.total_pages
      this.totalResults = data.total_results || data.results.length

      this.loader = false

      console.info(`Response from list: ${this.listTitle}`, { results: this.results, page: this.page, totalPages: this.totalPages, totalResults: this.totalResults })
    },
    loadMore(){
      this.currentPage++;

      console.log('path and name:', this.$route.path, this.$route.name)
      let url = ''

      if (this.$route.path.includes('list'))
        url = `/#${this.$route.path}?page=${this.currentPage}`
      else if (this.$route.path.includes('search'))
        url = `/#/search?query=${this.query}&page=${this.currentPage}`

      console.log('new url', url)
      window.history.replaceState({}, 'foo', url)

      this.parseURI()
    },
    // sort() {
    //   console.log(this.showFilters)
    // },
    // toggleFilter(item, index){
    //   this.showFilter = this.showFilter ? false : true;
    //   // this.results = this.results.filter(result => result.status != 'downloaded')
    // },
    // applyFilter(item, index) {
    //   this.filter = item;
    //   this.filters.status.selected = index;
    //   console.log('applied query filter: ', item, index)
    //   this.fetchCategory()
    // }
  },
  watch: {
    $route: function () {
      console.log('updated route')
      this.results = false
      this.currentPage = 1
      this.setPageFromUrlQuery()
      this.parseURI()
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./src/scss/variables";
@import "./src/scss/media-queries";
@import "./src/scss/elements";

  .movies-list {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    padding: 15px;

    .results {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
    }

    .list-header {
      width: 100%;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      justify-content: space-between;
      padding: 20px 10px;

      @include tablet-min{
        padding: 23px 15px;
      }
      @include tablet-landscape-min{
        padding: 16px 25px;
      }
      @include desktop-min{
        padding: 8px 30px;
      }

      .header__title {
        line-height: 18px;
        margin: 0;
        font-size: 18px;
        color: #081c24;
        font-weight: 300;
        // flex-basis: 50%;
        text-transform: capitalize;

        @include tablet-min{
          font-size: 18px;
          line-height: 18px;
        }
      }

      .header__result-count {
        font-size: 12px;
        font-weight: 300;
        letter-spacing: .5px;
        color: rgba(8,28,36,.5);
        text-align: right;
      }

      .header__view-more {
        font-size: 13px;
        font-weight: 300;
        letter-spacing: .5px;
        color: rgba($c-dark, 0.5);
        text-decoration: none;
        transition: color .5s ease;
        cursor: pointer;

        &:after{
          content: " →";
        }
        &:hover{
          color: $c-dark;
        }
      }
    }

    .end-section {
      display: flex;
      justify-content: center;
      width: 100%;
      margin: 1rem 0;
    }
  }


  @import "./src/scss/media-queries";
  .form__group-input {
    padding: 10px 5px 10px 15px;
    margin-left: 0;
    height: 38px;
    width: 150px;
    font-size: 15px;
    @include desktop-min {
      width: 200px;
      font-size: 17px;
    }
  }

</style>
