<template>
  <section class="not-found">
    <h1 class="not-found__title">Page Not Found</h1>
  </section>
</template>

<script>
import storage from '../storage.js'
export default {
  created(){
    document.title = 'Page Not Found' + storage.pageTitlePostfix;
  }
}
</script>

<style lang="scss" scoped>
@import "./src/scss/variables";
@import "./src/scss/media-queries";
.not-found {
  width: 100%;
  height: calc(100vh - var(--header-size));
  background: url('~assets/pulp-fiction.jpg') no-repeat 50% 50%;
  background-size: cover;
  display: flex;
  justify-content: center;

  &:before {
    background: $background-40;
    height: calc(100vh - var(--header-size));
    width: 100%;
    content: "";
    position: absolute;
  }
  &__title{
   padding-top: 40vh;
    font-size: 2rem;
    font-weight: 500;
    color: $text-color;
    position: relative;
    margin: 0;
    @include tablet-min{
      font-size: 2.3rem;
    }
  }
}
</style>
