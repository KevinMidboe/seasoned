<template>
  <li class="movie-item" :class="{ shortList: shortList }">
    <figure class="movie-item__poster">
      <img
        class="movie-item__img is-loaded"
        ref="poster-image"
        @click="openMoviePopup(movie.id, movie.type)"
        :alt="posterAltText"
        :data-src="poster"
        src="~assets/placeholder.png"
      />

      <div v-if="movie.download" class="progress">
        <progress :value="movie.download.progress" max="100"></progress>
        <span>{{ movie.download.state }}: {{ movie.download.progress }}%</span>
      </div>
    </figure>

    <div class="movie-item__info">
      <p v-if="movie.title || movie.name">{{ movie.title || movie.name }}</p>
      <p v-if="movie.year">{{ movie.year }}</p>
      <p v-if="movie.type == 'person'">
        Known for: {{ movie.known_for_department }}
      </p>
    </div>
  </li>
</template>

<script>
import img from "../directives/v-image";

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
  data() {
    return {
      poster: undefined,
      observed: false,
      posterSizes: [
        {
          id: "w500",
          minWidth: 500
        },
        {
          id: "w342",
          minWidth: 342
        },
        {
          id: "w185",
          minWidth: 185
        },
        {
          id: "w154",
          minWidth: 0
        }
      ]
    };
  },
  computed: {
    posterAltText: function () {
      const type = this.movie.type || "";
      const title = this.movie.title || this.movie.name;
      return this.movie.poster
        ? `Poster for ${type} ${title}`
        : `Missing image for ${type} ${title}`;
    }
  },
  beforeMount() {
    if (this.movie.poster != null) {
      this.poster = "https://image.tmdb.org/t/p/w500" + this.movie.poster;
    } else {
      this.poster = "/dist/no-image.png";
    }
  },
  mounted() {
    const poster = this.$refs["poster-image"];
    if (poster == null) return;

    const imageObserver = new IntersectionObserver((entries, imgObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && this.observed == false) {
          const lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          this.observed = true;
        }
      });
    });

    imageObserver.observe(poster);
  },
  methods: {
    openMoviePopup(id, type) {
      this.$popup.open(id, type);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./src/scss/variables";
@import "./src/scss/media-queries";
@import "./src/scss/main";

.movie-item {
  padding: 10px;
  width: 50%;
  background-color: $background-color;
  transition: background-color 0.5s ease;

  @include tablet-min {
    padding: 15px;
    width: 33%;
  }
  @include tablet-landscape-min {
    padding: 15px;
    width: 25%;
  }
  @include desktop-min {
    padding: 15px;
    width: 20%;
  }

  @include desktop-lg-min {
    padding: 15px;
    width: 12.5%;
  }

  &:hover &__info > p {
    color: $text-color;
  }

  &__poster {
    text-decoration: none;
    color: $text-color-70;
    font-weight: 300;

    > img {
      width: 100%;
      opacity: 0;
      transform: scale(0.97) translateZ(0);
      transition: opacity 0.5s ease, transform 0.5s ease;
      &.is-loaded {
        opacity: 1;
        transform: scale(1);
      }

      &:hover {
        transform: scale(1.03);
        box-shadow: 0 0 10px rgba($dark, 0.1);
      }
    }
  }

  &__info {
    padding-top: 15px;
    font-weight: 300;

    > p {
      color: $text-color-70;
      margin: 0;
      font-size: 11px;
      letter-spacing: 0.5px;
      transition: color 0.5s ease;
      cursor: pointer;
      @include mobile-ls-min {
        font-size: 12px;
      }
      @include tablet-min {
        font-size: 14px;
      }
    }
  }
}

.no-image {
  background-color: var(--text-color);
  color: var(--background-color);
  width: 100%;
  height: 383px;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-size: 1.5rem;
    width: 70%;
    text-align: center;
    text-transform: uppercase;
  }

  &:hover {
    transform: scale(1);
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
