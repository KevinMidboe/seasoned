<template>
  <div class="wrapper">
    <h3 v-if="title" class="title">{{ title }}</h3>
    <textarea :placeholder="placeholder" @input="handleInput" v-model="value" :rows="rows" />
  </div>
</template>


<script>

export default {
  props: {
    placeholder: {
      type: String,
      required: false
    },
    title: {
      type: String,
      required: false
    },
    rows: {
      type: Number,
      required: false,
      default: 10
    },
    value: {
      type: String,
      required: false,
      default: undefined
    }
  },
  methods: {
    handleInput(event) {
      if (this.value !== undefined) {
        this.$emit('update:value', this.value)
      } else {
        this.$emit('input', this.value, event)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./src/scss/variables.scss";

.wrapper {
  width: 100%;
}

.title {
  margin: 0;
  font-weight: 400;
  text-transform: uppercase;
  font-size: 14px;
  color: $green;
  margin-bottom: 0.5rem;
  @include tablet-min {
    font-size: 16px;
  }
}

textarea {
  width: 100%;
  font-size: 14px;
  padding: 0.5rem;
  border: 2px solid $text-color-50;

  &:focus {
    border-color: $text-color;

    outline: none;

    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
  }
}
</style>
