<template>
  <div>
    <section class="not-found" :style="backgroundImageCSS">
      <h1 class="not-found__title">Page Not Found</h1>
      <seasoned-button class="button" @click="goBack">
        go back to previous page
      </seasoned-button>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { useStore } from "vuex";
  import SeasonedButton from "@/components/ui/SeasonedButton.vue";

  const backgroundImageCSS =
    'background-image: url("/assets/pulp-fiction.jpg")';

  const store = useStore();

  if (store.getters["popup/isOpen"]) {
    store.dispatch("popup/close");
  }

  function goBack() {
    window.history.go(-2);
  }
</script>

<style lang="scss" scoped>
  @import "scss/variables.scss";
  @import "scss/media-queries";

  .button {
    font-size: 1.2rem;
    z-index: 10;

    @include mobile {
      font-size: 1rem;
      width: content;
    }
  }

  .not-found {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: calc(100vh - var(--header-size));
    background-size: cover;
    background-position: 50% 50%;
    background-repeat: no-repeat no-repeat;

    &::before {
      content: "";
      position: absolute;
      height: calc(100vh - var(--header-size));
      width: 100%;
      pointer-events: none;
      background: var(--background-40);
    }

    &__title {
      font-size: 2.5rem;
      font-weight: 500;
      padding: 0 1rem;
      color: var(--text-color);
      position: relative;
      background-color: var(--background-90);

      @include tablet-min {
        font-size: 3.5rem;
      }
    }
  }
</style>
