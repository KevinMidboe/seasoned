<template>
  <div class="text-input__loading" :style="`margin-top: ${top}rem`">
    <div
      class="text-input__loading--line"
      :class="lineClass"
      v-for="l in Array(count)"
      :key="l"
    ></div>
  </div>
</template>

<script setup lang="ts">
  import { defineProps } from "vue";

  interface Props {
    count?: Number;
    lineClass?: String;
    top?: Number;
  }

  const { count = 1, lineClass = "", top = 0 } = defineProps<Props>();
</script>

<style lang="scss" scoped>
  @import "src/scss/loading-placeholder";
</style>
