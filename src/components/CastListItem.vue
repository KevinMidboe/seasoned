<template>
  <li class="cast-card">
    <a
      class="cast-card__link"
      role="button"
      tabindex="0"
      :aria-label="ariaLabel"
      @click="openCastItem"
      @keydown.enter="openCastItem"
    >
      <div class="cast-card__image-wrapper">
        <img
          class="cast-card__image"
          :src="pictureUrl"
          :alt="imageAltText"
          loading="lazy"
        />
      </div>
      <div class="cast-card__content">
        <p class="cast-card__name">{{ creditItem.name || creditItem.title }}</p>
        <p v-if="metaText" class="cast-card__meta">{{ metaText }}</p>
      </div>
    </a>
  </li>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { useStore } from "vuex";
  import type { ICast, ICrew, IMovie, IShow } from "../interfaces/IList";

  interface Props {
    creditItem: ICast | ICrew | IMovie | IShow;
  }

  const props = defineProps<Props>();
  const store = useStore();

  const pictureUrl = computed(() => {
    const baseUrl = "https://image.tmdb.org/t/p/w185";

    if ("profile_path" in props.creditItem && props.creditItem.profile_path) {
      return baseUrl + props.creditItem.profile_path;
    }
    if ("poster" in props.creditItem && props.creditItem.poster) {
      return baseUrl + props.creditItem.poster;
    }

    return "/assets/no-image_small.svg";
  });

  const metaText = computed(() => {
    if ("character" in props.creditItem && props.creditItem.character) {
      return props.creditItem.character;
    }
    if ("job" in props.creditItem && props.creditItem.job) {
      return props.creditItem.job;
    }
    if ("year" in props.creditItem && props.creditItem.year) {
      return props.creditItem.year;
    }
    return "";
  });

  const imageAltText = computed(() => {
    const name = props.creditItem.name || (props.creditItem as any).title || "";
    if ("character" in props.creditItem) {
      return `${name} as ${props.creditItem.character}`;
    }
    if ("job" in props.creditItem) {
      return `${name}, ${props.creditItem.job}`;
    }
    return name ? `Poster for ${name}` : "No image available";
  });

  const ariaLabel = computed(() => {
    const name = props.creditItem.name || (props.creditItem as any).title || "";
    if ("character" in props.creditItem && props.creditItem.character) {
      return `View ${name}, played ${props.creditItem.character}`;
    }
    if ("job" in props.creditItem && props.creditItem.job) {
      return `View ${name}, ${props.creditItem.job}`;
    }
    return `View ${name}`;
  });

  function openCastItem() {
    store.dispatch("popup/open", { ...props.creditItem });
  }
</script>

<style lang="scss" scoped>
  @import "scss/variables";

  .cast-card {
    list-style: none;
    margin: 0 10px 10px 0;
    width: 150px;
    flex-shrink: 0;

    &:first-of-type {
      margin-left: 0;
    }
  }

  .cast-card__link {
    display: flex;
    flex-direction: column;
    height: 100%;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    border-radius: 10px;
    overflow: hidden;
    background-color: var(
      --highlight-secondary,
      var(--background-color-secondary)
    );
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &:hover,
    &:focus {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
      outline: none;
    }

    &:focus-visible {
      outline: 2px solid var(--highlight-color);
      outline-offset: 2px;
    }
  }

  .cast-card__image-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 2 / 3;
    overflow: hidden;
    background: linear-gradient(
      135deg,
      var(--background-color) 0%,
      var(--background-color-secondary) 100%
    );
  }

  .cast-card__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .cast-card__content {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-height: 60px;
  }

  .cast-card__name {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 500;
    line-height: 1.3;
    color: var(--highlight-bg, var(--text-color));
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cast-card__meta {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 400;
    line-height: 1.3;
    color: var(--highlight-bg, var(--text-color-70));
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
