<template>
  <button
    type="button"
    @click="emit('click')"
    :class="{ active: active, fullwidth: fullWidth }"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
  import { ref, defineProps, defineEmits } from "vue";
  import type { Ref } from "vue";

  interface Props {
    active?: Boolean;
    fullWidth?: Boolean;
  }

  interface Emit {
    (e: "click");
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emit>();
</script>

<style lang="scss" scoped>
  @import "src/scss/variables";
  @import "src/scss/media-queries";

  button {
    display: inline-block;
    border: 1px solid $text-color;
    font-size: 11px;
    font-weight: 300;
    line-height: 1.5;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    min-height: 45px;
    padding: 5px 10px 4px 10px;
    margin: 0;
    margin-right: 0.3rem;
    color: $text-color;
    background: $background-color-secondary;
    cursor: pointer;
    outline: none;
    transition: background 0.5s ease, color 0.5s ease, border-color 0.5s ease;

    @include desktop {
      font-size: 0.8rem;
      padding: 6px 20px 5px 20px;
    }

    &.fullwidth {
      font-size: 14px;
      width: 40%;

      @include mobile {
        width: 60%;
      }
    }

    &:focus,
    &:active,
    &.active {
      background: $text-color;
      color: $background-color;
    }

    @media (hover: hover) {
      &:hover {
        background: $text-color;
        color: $background-color;
      }
    }
  }
</style>
