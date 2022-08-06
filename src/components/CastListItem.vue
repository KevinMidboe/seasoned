<template>
  <li class="card">
    <a @click="openCastItem">
      <img :src="pictureUrl" />
      <p class="name">{{ creditItem.name || creditItem.title }}</p>
      <p class="meta">{{ creditItem.character || creditItem.year }}</p>
    </a>
  </li>
</template>

<script setup lang="ts">
  import { defineProps, computed } from "vue";
  import { useStore } from "vuex";
  import type { MediaTypes, CreditTypes } from "../interfaces/IList";

  interface Props {
    creditItem: MediaTypes | CreditTypes;
  }

  const props = defineProps<Props>();
  const store = useStore();

  const pictureUrl = computed(() => {
    const baseUrl = "https://image.tmdb.org/t/p/w185";

    if ("profile_path" in props.creditItem && props.creditItem.profile_path) {
      return baseUrl + props.creditItem.profile_path;
    } else if ("poster" in props.creditItem && props.creditItem.poster) {
      return baseUrl + props.creditItem.poster;
    }

    return "/assets/no-image_small.svg";
  });

  function openCastItem() {
    store.dispatch("popup/open", { ...props.creditItem });
  }
</script>

<style lang="scss">
  li a p:first-of-type {
    padding-top: 10px;
  }

  li.card p {
    font-size: 1em;
    padding: 0 10px;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: calc(10px + ((16px * var(--line-height)) * 3));
  }

  li.card {
    margin: 10px;
    margin-right: 4px;
    padding-bottom: 10px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;

    min-width: 140px;
    width: 140px;
    background-color: var(--background-color-secondary);
    color: var(--text-color);

    transition: all 0.3s ease;
    transform: scale(0.97) translateZ(0);

    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &:first-of-type {
      margin-left: 0;
    }

    &:hover {
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      transform: scale(1.03);
    }

    .name {
      font-weight: 500;
    }

    .character {
      font-size: 0.9em;
    }

    .meta {
      font-size: 0.9em;
      color: var(--text-color-70);
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      // margin-top: auto;
      max-height: calc((0.9em * var(--line-height)) * 1);
    }

    a {
      display: block;
      text-decoration: none;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    img {
      width: 100%;
      height: auto;
      max-height: 210px;
      background-color: var(--background-color);
      object-fit: cover;
    }
  }
</style>
