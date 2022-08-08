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

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from "vue";
  import { useStore } from "vuex";
  import Movie from "@/components/popup/Movie.vue";
  import Person from "@/components/popup/Person.vue";
  import { ListTypes } from "../interfaces/IList";
  import type { MediaTypes } from "../interfaces/IList";
  import type { Ref } from "vue";

  interface URLQueryParameters {
    id: number;
    type: ListTypes;
  }

  const store = useStore();
  const isOpen: Ref<boolean> = ref();
  const id: Ref<string> = ref();
  const type: Ref<MediaTypes> = ref();

  const unsubscribe = store.subscribe((mutation, state) => {
    if (!mutation.type.includes("popup")) return;

    isOpen.value = state.popup.open;
    id.value = state.popup.id;
    type.value = state.popup.type;

    isOpen.value
      ? document.getElementsByTagName("body")[0].classList.add("no-scroll")
      : document.getElementsByTagName("body")[0].classList.remove("no-scroll");
  });

  function getFromURLQuery(): URLQueryParameters {
    let id, type;

    const params = new URLSearchParams(window.location.search);
    params.forEach((value, key) => {
      if (!(key in ListTypes)) return;

      id = Number(params.get(key));
      type = key;
    });

    return { id, type };
  }

  function open(id: Number, type: string) {
    if (!id || !type) return;
    store.dispatch("popup/open", { id, type });
  }

  function close() {
    store.dispatch("popup/close");
  }

  function checkEventForEscapeKey(event: KeyboardEvent) {
    if (event.keyCode !== 27) return;
    close();
  }

  window.addEventListener("keyup", checkEventForEscapeKey);

  onMounted(() => {
    const { id, type } = getFromURLQuery();
    open(id, type);
  });

  onBeforeUnmount(() => {
    unsubscribe();
    window.removeEventListener("keyup", checkEventForEscapeKey);
  });
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
      margin: 8vh auto;

      @include mobile {
        margin: 0 0 50px 0;
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
