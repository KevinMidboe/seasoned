<template>
  <li class="movies-item" :class="{'shortList': shortList}">
    <a class="movies-item__link" :class="{'no-image': noImage}" @click.prevent="openMoviePopup(movie.id, movie.type)">

      <figure class="movies-item__poster">
        <img v-if="!noImage" class="movies-item__img" src="~assets/placeholder.png" v-img="poster()" alt="">
        <img v-if="noImage" class="movies-item__img is-loaded" src="~assets/no-image.png" alt="">
      </figure>
      <div class="movies-item__content">
        <p class="movies-item__title">{{ movie.title }}</p>
        <p class="movies-item__title">{{ movie.year }}</p>
      </div>
    </a>
  </li>
</template>

<script>
import img from '../directives/v-image.js'

export default {
  props: ['movie', 'shortList'],
  directives: {
    img: img
  },
  data(){
    return{
      noImage: false
    }
  },
  methods: {
    // TODO handle missing images better and load diff sizes based on screen size
    poster() {
      if (this.movie.poster) {
        return 'https://image.tmdb.org/t/p/w500' + this.movie.poster
      } else {
        this.noImage = true
      }
    },
    openMoviePopup(id, type){
      this.$popup.open(id, type)
    }
  }
}
</script>

<style lang="scss">
@import "./src/scss/variables";
@import "./src/scss/media-queries";
.movies-item {
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

  @include desktop-lg-min{
    padding: 20px;
    width: 16.5%;
  }

  &.shortList {
    display: none;

    &:nth-child(-n+6) { // show first 6
      display: block;
    }

    @include tablet-landscape-min{
      &:nth-child(-n+8) { // show first 8
        display: block;
      }
    }
    @include desktop-min{
      &:nth-child(-n+10) { // show first 10
        display: block;
      }
    }

    @include desktop-lg-min{
      display: block; // show all
    }
  }

  &__link{
    text-decoration: none;
    color: rgba($c-dark, 0.5);
    font-weight: 300;
  }
  &__content{
    padding-top: 15px;
  }
  &__poster{
    transition: transform 0.5s ease, box-shadow 0.3s ease;
    transform: translateZ(0);
    background: $c-white;
  }
  &__img{
    width: 100%;
    opacity: 0;
    transform: scale(0.97) translateZ(0);
    transition: opacity 0.5s ease, transform 0.5s ease;
    &.is-loaded{
      opacity: 1;
      transform: scale(1);
    }
  }
  &__link:not(.no-image):hover &__poster{
    transform: scale(1.03);
    box-shadow: 0 0 10px rgba($c-dark, 0.1);
  }
  &__title{
    margin: 0;
    font-size: 11px;
    letter-spacing: 0.5px;
    transition: color 0.5s ease;
    @include mobile-ls-min{
      font-size: 12px;
    }
    @include tablet-min{
      font-size: 14px;
    }
  }
  &__link:hover &__title{
    color: $c-dark;
  }
}
</style>
