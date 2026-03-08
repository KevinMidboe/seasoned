<template>
  <div
    v-if="isOpen"
    ref="popupContainer"
    class="movie-popup"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    @click="close"
    @keydown.enter="close"
    @keydown="handleKeydown"
  >
    <div class="movie-popup__box" @click.stop>
      <person v-if="type === 'person'" :id="id" type="person" />
      <movie v-else :id="id" :type="type"></movie>
      <button class="movie-popup__close" @click="close" tabindex="0"></button>
    </div>
    <i class="loader"></i>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
  import { useStore } from "vuex";
  import Movie from "@/components/popup/Movie.vue";
  import Person from "@/components/popup/Person.vue";
  import type { Ref } from "vue";
  import { MediaTypes } from "../interfaces/IList";

  interface URLQueryParameters {
    id: number;
    type: MediaTypes;
  }

  const store = useStore();
  const isOpen: Ref<boolean> = ref();
  const id: Ref<string> = ref();
  const type: Ref<MediaTypes> = ref();
  const popupContainer = ref<HTMLElement | null>(null);
  let previouslyFocusedElement: HTMLElement | null = null;

  const unsubscribe = store.subscribe((mutation, state) => {
    if (!mutation.type.includes("popup")) return;

    isOpen.value = state.popup.open;
    id.value = state.popup.id;
    type.value = state.popup.type;

    if (isOpen.value) {
      document.getElementsByTagName("body")[0].classList.add("no-scroll");
    } else {
      document.getElementsByTagName("body")[0].classList.remove("no-scroll");
    }
  });

  function getFromURLQuery(): URLQueryParameters {
    let _id: number;
    let _type: MediaTypes;

    const params = new URLSearchParams(window.location.search);
    params.forEach((_, key) => {
      if (
        key !== MediaTypes.Movie &&
        key !== MediaTypes.Show &&
        key !== MediaTypes.Person
      ) {
        return;
      }

      _id = Number(params.get(key));
      _type = key;
    });

    return { id: _id, type: _type };
  }

  function open(_id: number, _type: string) {
    if (!_id || !_type) return;
    store.dispatch("popup/open", { id: _id, type: _type });
  }

  function close() {
    store.dispatch("popup/close");
  }

  function checkEventForEscapeKey(event: KeyboardEvent) {
    if (event.keyCode !== 27) return;
    close();
  }

  function getFocusableElements(): HTMLElement[] {
    if (!popupContainer.value) return [];

    const focusableSelectors = [
      "button:not([disabled])",
      "a[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])'
    ].join(", ");

    return Array.from(
      popupContainer.value.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];
  }

  function trapFocus(event: KeyboardEvent) {
    if (event.key !== "Tab") return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    trapFocus(event);
  }

  function setInitialFocus() {
    nextTick(() => {
      // Focus the popup container itself instead of a specific element
      // This allows tab to start fresh without any element being focused
      if (popupContainer.value) {
        popupContainer.value.focus();
      }
    });
  }

  watch(isOpen, newValue => {
    if (newValue) {
      // Store the previously focused element
      previouslyFocusedElement = document.activeElement as HTMLElement;
      // Set focus to popup
      setInitialFocus();
    } else {
      // Restore focus to previously focused element
      if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
      }
    }
  });

  window.addEventListener("keyup", checkEventForEscapeKey);

  onMounted(() => {
    const query = getFromURLQuery();
    open(query?.id, query?.type);
  });

  onBeforeUnmount(() => {
    unsubscribe();
    window.removeEventListener("keyup", checkEventForEscapeKey);
  });
</script>

<style lang="scss">
  @import "scss/variables";
  @import "scss/media-queries";

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

    &:focus {
      outline: none;
    }

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
        background-color: white;
      }
      &:before {
        transform: rotate(45deg);
      }
      &:after {
        transform: rotate(-45deg);
      }
      &:hover {
        background-color: var(--highlight-color);
      }
    }
  }
</style>
