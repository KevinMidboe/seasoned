<template>
  <div v-if="isOpen" class="movie-popup" @click="close">
    <div class="movie-popup__box" @click.stop>
      <person v-if="type === 'person'" :id="id" type="person" />
      <movie v-else :id="id" :type="type"></movie>
      <button class="movie-popup__close" @click="close"></button>
    </div>
    <i class="loader"></i>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Movie from "@/components/popup/Movie";
import Person from "@/components/popup/Person";

export default {
  components: { Movie, Person },
  computed: {
    ...mapGetters("popup", ["isOpen", "id", "type"])
  },
  watch: {
    isOpen(value) {
      value
        ? document.getElementsByTagName("body")[0].classList.add("no-scroll")
        : document
            .getElementsByTagName("body")[0]
            .classList.remove("no-scroll");
    }
  },
  methods: {
    ...mapActions("popup", ["close", "open"]),
    checkEventForEscapeKey(event) {
      if (event.keyCode == 27) this.close();
    }
  },
  created() {
    const params = new URLSearchParams(window.location.search);
    let id = null;
    let type = null;

    if (params.has("movie")) {
      id = Number(params.get("movie"));
      type = "movie";
    } else if (params.has("show")) {
      id = Number(params.get("show"));
      type = "show";
    } else if (params.has("person")) {
      id = Number(params.get("person"));
      type = "person";
    }

    if (id && type) {
      this.open({ id, type });
    }

    window.addEventListener("keyup", this.checkEventForEscapeKey);
  },
  beforeDestroy() {
    window.removeEventListener("keyup", this.checkEventForEscapeKey);
  }
};
</script>

<style lang="scss">
@import "src/scss/variables";
@import "src/scss/media-queries";

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
    max-width: 768px;
    position: relative;
    z-index: 5;
    padding-bottom: 50px;

    @include tablet-min {
      padding-bottom: 0;
      margin: 8vh auto;
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
    z-index: 5;

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
