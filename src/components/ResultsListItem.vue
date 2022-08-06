<template>
  <li class="movie-item" ref="list-item">
    <figure
      ref="posterElement"
      class="movie-item__poster"
      @click="openMoviePopup"
    >
      <img
        class="movie-item__img"
        :alt="posterAltText"
        :data-src="poster"
        src="/assets/placeholder.png"
      />

      <div v-if="listItem.download" class="progress">
        <progress :value="listItem.download.progress" max="100"></progress>
        <span
          >{{ listItem.download.state }}:
          {{ listItem.download.progress }}%</span
        >
      </div>
    </figure>

    <div class="movie-item__info">
      <p v-if="listItem.title || listItem.name" class="movie-item__title">
        {{ listItem.title || listItem.name }}
      </p>
      <p v-if="listItem.year">{{ listItem.year }}</p>
      <p v-if="listItem.type == 'person'">
        Known for: {{ listItem.known_for_department }}
      </p>
    </div>
  </li>
</template>

<script setup lang="ts">
  import { ref, computed, defineProps, onMounted } from "vue";
  import { useStore } from "vuex";
  import { buildImageProxyUrl } from "../utils";
  import type { Ref } from "vue";
  import type { MediaTypes } from "../interfaces/IList";

  interface Props {
    listItem: MediaTypes;
  }

  const props = defineProps<Props>();
  const store = useStore();

  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
  const IMAGE_FALLBACK = "/assets/no-image.svg";
  const poster: Ref<string> = ref();
  const posterElement: Ref<HTMLElement> = ref(null);
  const observed: Ref<boolean> = ref(false);

  poster.value = props.listItem?.poster
    ? IMAGE_BASE_URL + props.listItem?.poster
    : IMAGE_FALLBACK;

  onMounted(observePosterAndSetImageSource);

  function observePosterAndSetImageSource() {
    const imageElement = posterElement.value.getElementsByTagName("img")[0];
    if (imageElement == null) return;

    const imageObserver = new IntersectionObserver((entries, imgObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && observed.value == false) {
          const lazyImage = entry.target as HTMLImageElement;
          lazyImage.src = lazyImage.dataset.src;
          posterElement.value.classList.add("is-loaded");
          observed.value = true;
        }
      });
    });

    imageObserver.observe(imageElement);
  }

  function openMoviePopup() {
    store.dispatch("popup/open", { ...props.listItem });
  }

  const posterAltText = computed(() => {
    const type = props.listItem.type || "";
    let title: string = "";

    if ("name" in props.listItem) title = props.listItem.name;
    else if ("title" in props.listItem) title = props.listItem.title;

    return props.listItem.poster
      ? `Poster for ${type} ${title}`
      : `Missing image for ${type} ${title}`;
  });

  const imageSize = computed(() => {
    if (!posterElement.value) return;
    const { height, width } = posterElement.value.getBoundingClientRect();
    return {
      height: Math.ceil(height),
      width: Math.ceil(width)
    };
  });

  // import img from "../directives/v-image";
  //   directives: {
  //     img: img
  //   },
</script>

<style lang="scss" scoped>
  @import "src/scss/variables";
  @import "src/scss/media-queries";
  @import "src/scss/main";

  .movie-item {
    padding: 15px;
    width: 100%;
    background-color: var(--background-color);

    &:hover &__info > p {
      color: $text-color;
    }

    &__poster {
      text-decoration: none;
      color: $text-color-70;
      font-weight: 300;
      position: relative;
      transform: scale(0.97) translateZ(0);

      &::before {
        content: "";
        position: absolute;
        z-index: 1;
        width: 100%;
        height: 100%;
        background-color: var(--background-color);
        transition: 1s background-color ease;
      }

      &:hover {
        transform: scale(1.03);
        box-shadow: 0 0 10px rgba($dark, 0.1);
      }

      &.is-loaded::before {
        background-color: transparent;
      }

      img {
        width: 100%;
        border-radius: 10px;
      }
    }

    &__info {
      padding-top: 10px;
      font-weight: 300;

      > p {
        color: $text-color-70;
        margin: 0;
        font-size: 14px;
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

    &__title {
      font-weight: 400;
    }
  }
</style>
