<template>
  <li class="movies-item" :class="{'shortList': shortList}">
    <a class="movies-item__link" :class="{'no-image': !movie}" @click.prevent="openMoviePopup(movie.id, movie.type)">

      <!-- TODO change to picture element -->
      <figure class="movies-item__poster">
        <img v-if="movie.poster" class="movies-item__img is-loaded" ref="image" src="~assets/placeholder.png">
        <!--        <img class="movies-item__img is-loaded" ref="image" :data-src="posterUrl" src="~assets/placeholder.png"> -->
        <!--        <img v-if="poster === null" class="movies-item__img is-loaded" src="~assets/no-image.png" alt=""> -->

        <div v-if="movie.download" class="progress">
          <progress :value="movie.download.progress" max="100"></progress>
          <span>{{ movie.download.state }}: {{ movie.download.progress }}%</span>
        </div>
      </figure>
      <div class="movies-item__content">
        <p class="movies-item__title">{{ movie.title || movie.name }}</p>
        <p class="movies-item__title">{{ movie.year }}</p>
      </div>
    </a>
  </li>
</template>

<script>
import img from '../directives/v-image'

export default {
  props: {
    movie: {
      type: Object,
      required: true
    },
    shortList: {
      type: Boolean,
      required: false
    }
  },
  directives: {
    img: img
  },
  data(){
    return {
      posterSizes: [{
        id: 'w500',
        minWidth: 500
      }, {
        id: 'w342',
        minWidth: 342
      }, {
        id: 'w185',
        minWidth: 185
      }, {
        id: 'w154',
        minWidth: 0
      }]
    }
  },
  computed: {
    posterUrl: function() {
      if (this.movie.poster == null)
        return "~assets/no-image.png"

      const correctWidth = this.posterQualityIdentifierFromPosterWidth

      return `https://image.tmdb.org/t/p/${correctWidth}${this.movie.poster}`
    },
    posterQualityIdentifierFromPosterWidth: function() {
      const posterWidth = this.$refs.image.clientHeight
      if (posterWidth > this.posterSizes[0].minWidth)
        return this.posterSizes[0].id

      const widthCandidates = this.posterSizes.filter(size => posterWidth < size.minWidth ? size.id : null)
      return widthCandidates[widthCandidates.length - 1].id
    }
  },
  mounted() {
    if (this.$refs.image == undefined)
      return
    const imageObserver = new IntersectionObserver((entries, imgObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target
          lazyImage.src = this.posterUrl
          lazyImage.class
        }
      })
    });

    imageObserver.observe(this.$refs.image);
  },
  methods: {
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
