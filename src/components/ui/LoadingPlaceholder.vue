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

<script>
export default {
  props: {
    count: {
      type: Number,
      default: 1,
      require: false
    },
    lineClass: {
      type: String,
      default: ""
    },
    top: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/scss/loading-placeholder";
</style>
