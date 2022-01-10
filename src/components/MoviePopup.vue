<template>
  <div class="movie-popup" @click="$popup.close()">
    <div class="movie-popup__box" @click.stop>
      <movie :id="id" :type="type"></movie>
      <button class="movie-popup__close" @click="$popup.close()"></button>
    </div>
    <i class="loader"></i>
  </div>
</template>

<script>
import Movie from "./Movie";

export default {
  props: {
    id: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  components: { Movie },
  methods: {
    checkEventForEscapeKey(event) {
      if (event.keyCode == 27) {
        this.$popup.close();
      }
    },
    updateQueryParams(id = false) {
      const params = new URLSearchParams(window.location.search);
      if (params.has("movie")) {
        params.delete("movie");
      }

      if (id) {
        params.append("movie", id);
      }

      window.history.replaceState(
        {},
        "search",
        `${window.location.protocol}//${window.location.hostname}${
          window.location.port ? `:${window.location.port}` : ""
        }${window.location.pathname}${
          params.toString().length ? `?${params}` : ""
        }`
      );
    }
  },
  created() {
    this.updateQueryParams(this.id);
    window.addEventListener("keyup", this.checkEventForEscapeKey);
    document.getElementsByTagName("body")[0].classList.add("no-scroll");
  },
  beforeDestroy() {
    this.updateQueryParams();
    window.removeEventListener("keyup", this.checkEventForEscapeKey);
    document.getElementsByTagName("body")[0].classList.remove("no-scroll");
  }
};
</script>

<style lang="scss">
@import "./src/scss/variables";
@import "./src/scss/media-queries";

.movie-popup {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100%;
  height: 100%;
  background: rgba($dark, 0.93);
  -webkit-overflow-scrolling: touch;
  overflow: auto;

  &__box {
    width: 100%;
    height: 0;
    max-width: 768px;
    position: relative;
    z-index: 5;
    background: var(--background-40);
    padding-bottom: 50px;
    @include tablet-min {
      padding-bottom: 0;
      margin: 40px auto;
    }
  }
  &__close {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    border: 0;
    background: transparent;
    width: 40px;
    height: 40px;
    transition: background 0.5s ease;
    cursor: pointer;
    &:before,
    &:after {
      content: "";
      display: block;
      position: absolute;
      top: 19px;
      left: 10px;
      width: 20px;
      height: 2px;
      background: $white;
    }
    &:before {
      transform: rotate(45deg);
    }
    &:after {
      transform: rotate(-45deg);
    }
    &:hover {
      background: $green;
    }
  }
}
</style>
