<template>
  <div class="text-input__loading" :style="`margin-top: ${top || 0}rem`">
    <div
      v-for="l in Array(count || 1)"
      :key="l"
      class="text-input__loading--line"
      :class="lineClass || ''"
    ></div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    count?: number;
    lineClass?: string;
    top?: number;
  }

  defineProps<Props>();
</script>

<style lang="scss" scoped>
  @import "src/scss/loading-placeholder";
</style>
