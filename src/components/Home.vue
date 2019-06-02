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
  &__header{
    width: 100%;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    position: relative;
    background-color: $c-dark;
    background-image: url('~assets/arrival.jpg');
    @include tablet-min{
      height: 284px;
    }
    &:before{
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba($c-light, 0.7);
    }
    &-wrap{
      text-align: center;
      position: relative;
    }
    &-title{
      font-weight: 500;
      font-size: 22px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: $c-dark;
      margin: 0;
      @include tablet-min{
        font-size: 28px;
      }
    }
    &-subtitle{
      display: block;
      font-size: 14px;
      font-weight: 300;
      color: $c-dark;
      margin: 5px 0;
      @include tablet-min{
        font-size: 16px;
      }
    }
    &-link{
      text-decoration: none;
      color: $c-dark;
      font-size: 13px;
      font-weight: 300;
      opacity: 0.7;
      transition: opacity 0.5s ease;
      &:hover{
        opacity: 1;
      }
      span{
        display: inline-block;
        vertical-align: middle;
      }
      &-icon{
        display: inline-block;
        vertical-align: middle;
        margin-right: 2px;
        width: 16px;
        height: 15px;
        fill: $c-dark;
      }
    }
  }
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
