<template>
  <section class="not-found">
    <h1 class="not-found__title">Page Not Found</h1>
  </section>
</template>

<style lang="scss" scoped>
@import "./src/scss/variables";
@import "./src/scss/media-queries";

.not-found {
  display: flex;
  height: calc(100vh - var(--header-size));
  width: 100%;
  background: url('~assets/pulp-fiction.jpg') no-repeat 50% 50%;
  background-size: cover;
  justify-content: center;

  &:before {
    content: "";
    position: absolute;
    height: calc(100vh - var(--header-size));
    width: 100%;
    background: $background-40;
  }
  &__title {
   padding-top: 40vh;
    font-size: 2rem;
    font-weight: 500;
    color: $text-color;
    position: relative;
    margin: 0;

    @include tablet-min {
      font-size: 2.3rem;
    }
  }
}
</style>
