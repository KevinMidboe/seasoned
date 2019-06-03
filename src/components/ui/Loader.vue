<template>
  <div class="loader">
    <i class="loader--icon">
      <i class="loader--icon-spinner" />
    </i>
  </div>
</template>

<style lang="scss" scoped>
@import "./src/scss/variables";

.loader {
  display: flex;
  width: 100%;
  height: 30vh;
  justify-content: center;
  align-items: center;

  &--icon{
    border: 2px solid rgba($c-dark, 0.9);
    border-radius: 50%;
    display: block;
    height: 40px;
    // left: 50%;
    // margin: -1.5em;
    position: absolute;
    width: 40px;

    &-spinner {
    // border: 2px solid transparent;
    display: block;
      animation: load 1s linear infinite;
    height: 35px;
    width: 35px;
&:after {
      border: 7px solid rgba($c-green, 0.9);
      border-radius: 50%;
      content: '';
      left: 8px;
      position: absolute;
      top: 22px;
    }
    }
  }
  @keyframes load {
    100% { transform: rotate(360deg); }
  }
}
</style>