<template>
  <header
    :class="{ expanded, noselect: true }"
    v-bind:style="{ 'background-image': 'url(' + imageFile + ')' }"
    @click="expanded = !expanded"
  >
    <div class="container">
      <h1 class="title">Request movies or tv shows</h1>
      <strong class="subtitle"
        >Create a profile to track and view requests</strong
      >
    </div>

    <div class="expand-icon">
      <IconExpand v-if="!expanded" />
      <IconShrink v-else />
    </div>
  </header>
</template>

<script>
import IconExpand from "../icons/IconExpand.vue";
import IconShrink from "../icons/IconShrink.vue";

export default {
  components: { IconExpand, IconShrink },
  props: {
    image: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      images: [
        "pulp-fiction.jpg",
        "arrival.jpg",
        "dune.jpg",
        "mandalorian.jpg"
      ],
      imageFile: undefined,
      expanded: false
    };
  },
  beforeMount() {
    if (this.image && this.image.length > 0) {
      this.imageFile = this.image;
    } else {
      this.imageFile = `/dist/${
        this.images[Math.floor(Math.random() * this.images.length)]
      }`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./src/scss/variables";
@import "./src/scss/media-queries";

header {
  width: 100%;
  height: 30vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  position: relative;

  &.expanded {
    height: calc(100vh - var(--header-size));
    width: calc(100vw - var(--header-size));
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
  }

  &:hover {
    .expand-icon {
      visibility: visible;
      opacity: 1;
    }
  }

  &:before {
    content: "";
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

    @include tablet-min {
      font-size: 1.3rem;
    }
  }
}
</style>
