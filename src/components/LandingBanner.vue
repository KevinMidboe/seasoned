<template>
  <header ref="headerElement" :class="{ expanded, noselect: true }">
    <img :src="bannerImage" ref="imageElement" />
    <div class="container">
      <h1 class="title">Request movies or tv shows</h1>
      <strong class="subtitle"
        >Create a profile to track and view requests</strong
      >
    </div>

    <div class="expand-icon" @click="expand" @mouseover="upgradeImage">
      <IconExpand v-if="!expanded" />
      <IconShrink v-else />
    </div>
  </header>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  import IconExpand from "@/icons/IconExpand.vue";
  import IconShrink from "@/icons/IconShrink.vue";
  import type { Ref } from "vue";

  const ASSET_URL = "https://request.movie/assets/";
  const images: Array<string> = [
    "pulp-fiction.jpg",
    "arrival.jpg",
    "disaster-artist.jpg",
    "dune.jpg",
    "mandalorian.jpg"
  ];

  const bannerImage: Ref<string> = ref();
  const expanded: Ref<boolean> = ref(false);
  const headerElement: Ref<HTMLElement> = ref(null);
  const imageElement: Ref<HTMLImageElement> = ref(null);
  const defaultHeaderHeight: Ref<string> = ref();
  const disableProxy = true;

  bannerImage.value = randomImage();

  function expand() {
    expanded.value = !expanded.value;
    let height = defaultHeaderHeight?.value;

    if (expanded.value) {
      const aspectRation =
        imageElement.value.naturalHeight / imageElement.value.naturalWidth;
      height = `${imageElement.value.clientWidth * aspectRation}px`;
      defaultHeaderHeight.value = headerElement.value.style.height;
    }

    headerElement.value.style.setProperty("--header-height", height);
  }

  function randomImage(): string {
    const image = images[Math.floor(Math.random() * images?.length)];
    return ASSET_URL + image;
  }

  // function sliceToHeaderSize(url: string): string {
  //   let width = headerElement.value?.getBoundingClientRect()?.width || 1349;
  //   let height = headerElement.value?.getBoundingClientRect()?.height || 261;

  //   if (disableProxy) return url;

  //   return buildProxyURL(width, height, url);
  // }

  // function upgradeImage() {
  //   if (disableProxy || imageUpgraded.value == true) return;

  //   const headerSize = 90;
  //   const height = window.innerHeight - headerSize;
  //   const width = window.innerWidth - headerSize;

  //   const proxyHost = `http://imgproxy.schleppe:8080/insecure/`;
  //   const proxySizeOptions = `q:65/plain/`;

  //   bannerImage.value = `${proxyHost}${proxySizeOptions}${
  //     ASSET_URL + image.value
  //   }`;
  // }

  // function buildProxyURL(width: number, height: number, asset: string): string {
  //   const proxyHost = `http://imgproxy.schleppe:8080/insecure/`;
  //   const proxySizeOptions = `resize:fill:${width}:${height}:ce/q:65/plain/`;
  //   return `${proxyHost}${proxySizeOptions}${asset}`;
  // }
</script>

<style lang="scss" scoped>
  @import "src/scss/variables";
  @import "src/scss/media-queries";

  header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: height 0.5s ease;
    overflow: hidden;
    --header-height: 261px;

    @include mobile {
      --header-height: 25vh;
    }

    height: var(--header-height);

    > * {
      z-index: 1;
    }

    img {
      position: absolute;
      z-index: 0;
      object-fit: cover;
      width: 100%;
    }

    &.expanded {
      // height: calc(100vh - var(--header-size));
      // width: calc(100vw - var(--header-size));

      // @include mobile {
      //   width: 100vw;
      //   height: 100vh;
      // }

      &:before {
        background-color: transparent;
      }

      .title,
      .subtitle {
        opacity: 0;
      }
    }

    .expand-icon {
      visibility: hidden;
      opacity: 0;
      transition: all 0.5s ease-in-out;
      height: 1.8rem;
      width: 1.8rem;
      fill: var(--text-color-50);

      position: absolute;
      top: 0.5rem;
      right: 1rem;

      &:hover {
        cursor: pointer;
        fill: var(--text-color-90);
      }
    }

    &:hover {
      .expand-icon {
        visibility: visible;
        opacity: 1;
      }
    }

    &:before {
      content: "";
      z-index: 1;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--background-70);
      transition: inherit;
    }

    .container {
      text-align: center;
      position: relative;
      transition: color 0.5s ease;
    }

    .title {
      font-weight: 500;
      font-size: 22px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: $text-color;
      margin: 0;
      opacity: 1;

      @include tablet-min {
        font-size: 2.5rem;
      }
    }

    .subtitle {
      display: block;
      font-size: 14px;
      font-weight: 300;
      color: $text-color-70;
      margin: 5px 0;
      opacity: 1;

      @include tablet-min {
        font-size: 1.3rem;
      }
    }
  }
</style>
