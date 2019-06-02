<template>
  <header v-bind:style="{ 'background-image': 'url(' + imageFile + ')' }">
    <div class="container">
      <h1 class="title">Request new movies or tv shows for plex</h1>
      <strong class="subtitle">Made with Vue.js</strong>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      imageFile: 'dist/pulp-fiction.jpg'
    }
  },
  beforeMount() {
    if (this.image && this.image.length > 0) {
      this.imageFile = this.image
    }
  }
}
  
</script>

<style lang="scss" scoped>
@import "./src/scss/variables";
@import "./src/scss/media-queries";

header {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  position: relative;
  background-color: $c-dark;
  @include tablet-min {
    height: 284px;
  }
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba($c-light, 0.7);
  }
  
  .container {
    text-align: center;
    position: relative;
  }
  
  .title {
    font-weight: 500;
    font-size: 22px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: $c-dark;
    margin: 0;
    @include tablet-min{
      font-size: 28px;
    }
  }

  .subtitle {
    display: block;
    font-size: 14px;
    font-weight: 300;
    color: $c-dark;
    margin: 5px 0;
    @include tablet-min{
      font-size: 16px;
    }
  }

  .link {
    text-decoration: none;
    color: $c-dark;
    font-size: 13px;
    font-weight: 300;
    opacity: 0.7;
    transition: opacity 0.5s ease;
    &:hover {
      opacity: 1;
    }
    span {
      display: inline-block;
      vertical-align: middle;
    }
    &-icon {
      display: inline-block;
      vertical-align: middle;
      margin-right: 2px;
      width: 16px;
      height: 15px;
      fill: $c-dark;
    }
  }
}
</style>