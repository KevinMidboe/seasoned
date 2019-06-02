<template>
  <section class="home">
    <LandingBanner />

    <movies-list v-for="item in homepageLists" :propList="item" :shortList="true">{{item}}</movies-list>
    <!-- <movies-list v-for="item in homepageLists" v-if="item.isCategory" :type="'component'" :mode="item.type" :category="item.query" :shortList="true"></movies-list> -->
  </section>
</template>

<script>
import axios from 'axios'
import storage from '../storage.js'
import LandingBanner from '@/components/LandingBanner.vue'
import MoviesList from './MoviesList.vue'

export default {
  name: 'home',
  components: { LandingBanner, MoviesList },
  data(){
    return {
      homepageLists: storage.homepageLists,

      listTypes: storage.listTypes,
      imageFile: 'dist/pulp-fiction.jpg'
    }
  },
  created(){
    document.title = 'TMDb';
    storage.backTitle = document.title;
  }
}
</script>

<style lang="scss">
@import "./src/scss/variables";
@import "./src/scss/media-queries";
.home{
  position: relative;
  padding: 50px 0 0;
  
  .wrapper{
    min-height: 0;
  }
  .movies__list{
    .movies__item:last-child{
      display: none;
      @include desktop-min{
        display: block;
      }
    }
  }
}
</style>
