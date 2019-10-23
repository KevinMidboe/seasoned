<template>
  <div class="wrapper" v-if="listLoaded">
    <div class="movies" v-if="movies.length">
      <header class="movies__header">
        <h2 class="movies__title">{{ listTitle }}</h2>
        <span class="movies__results" v-if="!shortList">{{ countResults }}</span>

        <router-link v-if="shortList && mode != 'user-requests'" class="movies__link" :to="{name: 'home-category', params: {category: category}}">
          View All
        </router-link>
         <router-link v-if="shortList && mode == 'user-requests'" class="movies__link" :to="{name: 'user-requests'}">
          View All
        </router-link>

        <span v-if="!shortList && (this.$route.params.category === 'requests' || mode == 'user-requests')" class="movies__filters">
          <button type="button" class="button" @click="toggleFilter">Filter</button>
          <span class="movies__filters__button-spacing"></span>
          <!-- <button type="button" class="button" @click="sort">Sort</button>  -->
          <span class="movies__filters__button-spacing"></span>
          <div class="form__group">
             <input v-model="filter_query" class="form__group-input" placeholder="Filter by search"/>
          </div>
        </span>
      </header>

      <ul v-if="showFilter" class="movies__filters-list">
        <li v-for="(item, index) in filters.status.elms" @click="applyFilter(item, index)" :class="{'active': index === filters.status.selected}">{{ item }}</li>
      </ul>

      <ul class="movies__list">
        <movies-list-item class="movies__item" v-for="(movie, index) in movies" :movie="movie"></movies-list-item>
      </ul>
      <div class="movies__nav" v-if="!shortList" :class="{'is-hidden' : currentPage == pages}">
        <button @click="loadMore" class="button">Load Mores</button>
      </div>
    </div>
    <i v-if="!listLoaded" class="loader"></i>
    <section v-if="!movies.length && !shortList" class="not-found">
      <div class="not-found__content">
        <h2 class="not-found__title" v-if="mode == 'search'">Nothing Found</h2>
        <h2 class="not-found__title" v-if="mode == 'favorite'">You haven't added any favorite movies</h2>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import numeral from 'numeral'
import storage from '../storage.js'
import MoviesListItem from './MoviesListItem.vue'

// Storage for removed favorite item
let removed;

export default {
  props: ['type', 'mode', 'category', 'shortList'],
  components: { MoviesListItem },
  // beforeRouteLeave (to, from, next) {
  //   if(from.name == 'search'){
  //     eventHub.$emit('setSearchQuery', true);
  //   }
  //   next();
  // },
  data() {
    return {
      listTitle: '',
      movies: [],
      unfiltered_movies: [],
      pages: '',
      filter: '',
      filter_query: '',
      results: '',
      currentPage: 1,
      listLoaded: false,
      showFilter: false,
      filters: {
        status: {
          elms: ['all', 'requested', 'downloading', 'downloaded'],
          selected: 0,
        }
      }
    }
  },
  computed: {
    pageTitle(){
      return this.listTitle + storage.pageTitlePostfix;
    },
    query(){
      return this.$route.params.query || '';
    },
    request(){
      console.log('todays mode is: ', this.mode);
      if(this.mode == 'search'){
        return `https://api.kevinmidboe.com/api/v1/plex/request?query=${this.query}&page=${this.currentPage}`;
      } else if(this.mode == 'requests' || this.$route.params.category == 'requests') {
        return `https://api.kevinmidboe.com/api/v1/plex/requests/all?page=${this.currentPage}&status=${this.filter}`;
      } else if(this.mode == 'collection') {
        let category = this.$route.params.category || this.category;
        return `https://api.kevinmidboe.com/api/v1/tmdb/list/${category}?page=${this.currentPage}`;
      } else if(this.mode == 'history') {
        return 'https://api.kevinmidboe.com/api/v1/user/history';
      } else if(this.mode == 'user-requests') {
        return 'https://api.kevinmidboe.com/api/v1/user/requests';
      }
    },
    countResults(){
      if(this.results > 1){
        return numeral(this.results).format('0,0') + ' results';
      } else {
        return numeral(this.results).format('0,0') + ' result';
      }
    }
  },
  methods: {
    fetchCategory(){
      axios.get(this.request, {
        headers: {authorization: storage.token},
      })
      .then(function(resp){
          let data = resp.data;
          console.log('data: ', data)

          if(this.shortList){
            this.movies = data.results.slice(0, 5);
            this.pages = 1;
            this.results = 5;
          } else {
            this.movies = data.results;
            this.pages = data.total_pages;
            this.results = data.total_results;
          }
          this.unfiltered_movies = this.movies;
          this.listLoaded = true;
          // Change Page title
          if(this.type == 'page'){
            document.title = this.pageTitle;
          }
      }.bind(this))
      .catch(function(error) {
        this.$router.push({ name: '404' });
      }.bind(this));
    },
    loadMore(){
      this.currentPage++;
      axios.get(this.request)
      .then(function(resp){
          let data = resp.data;
          let newData = this.movies.concat(data.results);
          this.movies = newData;
      }.bind(this));
    },
    // sort() {
    //   console.log(this.showFilters)
    // },
    toggleFilter(item, index){
      this.showFilter = this.showFilter ? false : true;
      // this.results = this.results.filter(result => result.status != 'downloaded')
    },
    applyFilter(item, index) {
      this.filter = item;
      this.filters.status.selected = index;
      console.log('applied query filter: ', item, index)
      this.fetchCategory()
    }
  },
  watch: {
    filter_query: function(val, oldVal) {
      let movies = this.unfiltered_movies;
      val = val.toLowerCase()
      if (val.length > 0)
        movies = movies.filter(movie => movie.title.toLowerCase().startsWith(val))

      if (movies.length > 0)
        this.movies = movies;
    }
  },
  created(){
    // Set List Title
    if(this.mode == 'search'){
      this.listTitle = storage.categories['search'];
      eventHub.$emit('setSearchQuery');
    } else if(this.mode == 'requests') {
      this.listTitle = storage.categories['requests'];
    } else if(this.mode == 'collection') {
      let category = this.$route.params.category || this.category;
      this.listTitle = storage.categories[category]; // <-- this
    } else if(this.mode == 'favorite') {
      this.listTitle = storage.categories['favorite'];
    } else if(this.mode == 'user-requests') {
      this.listTitle = storage.categories['user-requests'];
    }
    this.fetchCategory();
    eventHub.$on('updateFavorite', this.updateFavorite);
  }
}
</script>
<style lang="scss" scoped>
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
<style lang="scss">
@import "./src/scss/variables";
@import "./src/scss/media-queries";
.movies{
  padding: 10px;
  @include tablet-min{
    padding: 15px;
  }
  @include tablet-landscape-min{
    padding: 25px;
  }
  @include desktop-min{
    padding: 30px;
  }
  &__header{
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
  }
    &__title{
      margin: 0;
      font-size: 16px;
      line-height: 16px;
      color: $c-dark;
      font-weight: 300;

      flex-basis: 50%;
      @include tablet-min{
        font-size: 18px;
        line-height: 18px;
      }
    }
    &__results{
      font-size: 12px;
      font-weight: 300;
      letter-spacing: 0.5px;
      color: rgba($c-dark, 0.5);
      
      text-align: right;
      flex-basis: 50%;
      @include mobile-only {
        display: none;
      }
    }
    &__link{
      font-size: 12px;
      font-weight: 300;
      letter-spacing: 0.5px;
      color: rgba($c-dark, 0.5);
      text-decoration: none;
      transition: color 0.5s ease;
      &:after{
        content: " →";
      }
      &:hover{
        color: $c-dark;
      }
    }
  &__filters{
    margin-top: 10px;
    line-height: 22px;
    color: $c-dark;
    font-size: 18px;
    display: flex;
    justify-content: flex-end;
    transition: opacity 1s ease;

    &__button-spacing {
      @include tablet-min {
        width: 15px;
      }
      @include mobile-only {
        width: 10px;
      }
    }
    &-list {
      margin: 0px 10px;
      padding: 0;
      list-style: none;
      border: solid 1px;
      border-radius: 2px;
      overflow: hidden;
      display: flex;
      transition: color 0.2s ease;

      justify-content: space-evenly;

      @include tablet-min{
        margin: 0px 15px;
      }
      @include tablet-landscape-min {
        margin: 0px 25px;
      }
      @include desktop-min{
        margin: 0px 30px;
      }
      li {
        padding: 6px 14px;
        background-color: $c-white;
        transition: color 0.2s ease;
        font-size: 13px;
        font-weight: 200;
        text-transform: capitalize;
        text-align: center;
        width: 100%;
        &:nth-child(n+2) {
          border-left: solid 1px;
        }
        &.active, &:hover {
          border-color: transparent;
          background-color: #091c24;
          color: $c-white;
          cursor: pointer;
        }
        @include tablet-min {
          font-size: 16px;
        }
      }
    }
    &-toggle {
      margin-left: 15px;
    }
  }
  &__list{
    padding: 0;
    margin: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
  }
    &__item{
      padding: 10px;
      width: 50%;
      @include tablet-min{
        padding: 15px;
      }
      @include tablet-landscape-min{
        padding: 20px;
        width: 25%;
      }
      @include desktop-min{
        padding: 30px;
        width: 20%;
      }
    }
    &__nav{
      padding: 25px 0;
      text-align: center;
      &.is-hidden{
        display: none;
      }
    }
}
</style>
