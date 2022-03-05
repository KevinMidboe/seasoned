<template>
  <div>
    <div class="text-input__loading">
      <div class="text-input__loading--line" :class="lineClass" v-for="_ in Array(count)"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      require: true
    },
    lineClass: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/scss/loading-placeholder";
</style>
