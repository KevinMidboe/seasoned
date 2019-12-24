<template>
  <div class="toggle-container">
    <button v-for="option in options" class="toggle-button" @click="toggle(option)"
      :class="toggleValue === option ? 'selected' : null"
    >{{ option }}</button>
  </div>
</template>


<script>
export default {
  props: {
    options: {
      Array,
      required: true
    },
    selected: {
      type: String,
      required: false,
      default: undefined
    }
  },
  data() {
    return {
      toggleValue: this.selected || this.options[0]
    }
  },
  beforeMount() {
    this.toggle(this.toggleValue)
  },
  methods: {
    toggle(toggleValue) {
      this.toggleValue = toggleValue;
      if (this.selected !== undefined) {
        this.$emit('update:selected', toggleValue)
      } else {
        this.$emit('change', toggleValue)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import "./src/scss/variables";

$background: $background-ui;
$background-selected: $background-color-secondary;

.toggle-container {
  width: 100%;
  max-width: 15rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  // padding: 0.2rem;
  background-color: $background;
  border: 2px solid $background;
  border-radius: 8px;
  border-left: 4px solid $background;
  border-right: 4px solid $background;

  .toggle-button {
    font-size: 1rem;
    line-height: 1rem;
    font-weight: normal;
    width: 100%;
    padding: 0.5rem 0;
    border: 0;
    color: $text-color;
    // background-color: $text-color-5;
    background-color: $background;
    text-transform: capitalize;

    &.selected {
      color: $text-color;
      // background-color: $background-color-secondary;
      background-color: $background-selected;
      border-radius: 8px;
    }

    // &:first-of-type, &:last-of-type {
    //   border-left: 4px solid $background;
    //   border-right: 4px solid $background;
    // }


    // &:first-of-type {
    //   border-top-left-radius: 4px;
    //   border-bottom-left-radius: 4px;
    // }

    // &:last-of-type {
    //   border-top-right-radius: 4px;
    //   border-bottom-right-radius: 4px;
    // }
  }
}
</style>