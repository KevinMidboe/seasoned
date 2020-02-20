<template>
  <div class="seasoned-button">
    <button type="button" class="button" @click="emit('click')" :class="{ active: active }"><slot></slot></button>
  </div>
</template>

<script>

export default {
  name: 'seasonedButton',
  props: {
    active: Boolean
  },
  methods: {
    emit() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./src/scss/variables";
@import "./src/scss/media-queries";

.button{
  display: inline-block;
  border: 1px solid $text-color;
  text-transform: uppercase;
  font-weight: 300;
  font-size: 11px;
  line-height: 2;
  height: 45px;
  letter-spacing: 0.5px;
  padding: 5px 20px 4px 20px;
  margin: 0;
  margin-right: 0.3rem;
  cursor: pointer;
  color: $text-color;
  background: $background-color-secondary;
  outline: none;
  transition: background 0.5s ease, color 0.5s ease, border-color .5s ease;

  @include tablet-min{
    font-size: 12px;
    padding: 6px 20px 5px 20px;
  }

  &:focus, &:active, &.active {
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
