<template>
  <li class="movie-item" :class="{'shortList': shortList}">
    <figure class="movie-item__poster">
      <img class="movie-item__img is-loaded"
           ref="poster-image"
           @click="openMoviePopup(movie.id, movie.type)"
           :alt="posterAltText"
           :data-src="poster"
           src="~assets/placeholder.png">

      <div v-if="movie.download" class="progress">
        <progress :value="movie.download.progress" max="100"></progress>
        <span>{{ movie.download.state }}: {{ movie.download.progress }}%</span>
      </div>
    </a>
  </li>
</template>

<script>
import img from '../directives/v-image'

export default {
  props: ['movie', 'shortList'],
  directives: {
    img: img
  },
  data(){
    return {
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
    openMoviePopup(id, type) {
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
  background-color: $background-color;
  transition: background-color 0.5s ease;

  @include tablet-min{
    padding: 15px;
  }
  @include tablet-landscape-min{
    padding: 15px;
    width: 25%;
  }
  @include desktop-min{
    padding: 15px;
    width: 20%;
  }

  @include desktop-lg-min{
    padding: 15px;
    width: 12.5%;
  }

  &__link{
    text-decoration: none;
    color: $text-color-70;
    font-weight: 300;
  }
  &__content{
    padding-top: 15px;
  }
  &__poster{
    transition: transform 0.5s ease, box-shadow 0.3s ease;
    transform: translateZ(0);
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
    box-shadow: 0 0 10px rgba($dark, 0.1);
  }
  &__title{
    margin: 0;
    font-size: 11px;
    letter-spacing: 0.5px;
    transition: color 0.5s ease;
    cursor: pointer;
    @include mobile-ls-min{
      font-size: 12px;
    }
    @include tablet-min{
      font-size: 14px;
    }
  }
  &__link:hover &__title{
    color: $text-color;
  }
}
</style>

<style lang="scss" scoped>
@import "./src/scss/variables";

.progress {
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 0.8rem;

  > progress {
    width: 95%;
  }

  > span {
    position: absolute;
    font-size: 1rem;
    line-height: 1.4rem;
    color: $white;
  }

  progress {
    border-radius: 4px;
    height: 1.4rem;
  }
  progress::-webkit-progress-bar {
    background-color: rgba($black, 0.55);
    border-radius: 4px;
  }
  progress::-webkit-progress-value {
    background-color: $green-70;
    border-radius: 4px;

  }
  progress::-moz-progress-bar {
    /* style rules */
    background-color: green;
  }
}
</style>