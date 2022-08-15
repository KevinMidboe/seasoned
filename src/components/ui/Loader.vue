<template>
  <div :class="`loader type-${type || LoaderHeightType.Page}`">
    <i class="loader--icon">
      <i class="loader--icon-spinner" />
    </i>
  </div>

  <!--
  TODO: fetch and display movie facts after 1.5 seconds while loading?
  

--></template>

<script setup lang="ts">
  import { defineProps } from "vue";
  import LoaderHeightType from "../../interfaces/ILoader";

  interface Props {
    type?: LoaderHeightType;
  }

  defineProps<Props>();
</script>

<style lang="scss" scoped>
  @import "src/scss/variables";

  .loader {
    display: flex;
    width: 100%;
    height: 30vh;
    justify-content: center;
    align-items: center;

    &.type-section {
      height: 15vh;
    }

    &--icon {
      border: 2px solid $text-color-70;
      border-radius: 50%;
      display: block;
      height: 40px;
      position: absolute;
      width: 40px;

      &-spinner {
        display: block;
        animation: load 1s linear infinite;
        height: 35px;
        width: 35px;
        &:after {
          border: 7px solid $green-90;
          border-radius: 50%;
          content: "";
          left: 8px;
          position: absolute;
          top: 22px;
        }
      }
    }
    @keyframes load {
      100% {
        transform: rotate(360deg);
      }
    }
  }
</style>
