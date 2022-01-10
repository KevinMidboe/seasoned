<template>
  <div class="group" :class="{ completed: value }">
    <svg class="group__input-icon">
      <use v-bind="{ 'xlink:href': '#icon' + icon }"></use>
    </svg>
    <input
      class="group__input"
      :type="tempType || type"
      @input="handleInput"
      v-model="inputValue"
      :placeholder="placeholder"
      @keyup.enter="submit"
    />

    <i
      v-if="value && type === 'password'"
      @click="toggleShowPassword"
      class="group__input-show noselect"
      >{{ tempType == "password" ? "show" : "hide" }}</i
    >
  </div>
</template>

<script>
export default {
  props: {
    placeholder: { type: String },
    icon: { type: String },
    type: { type: String, default: "text" },
    value: { type: String, default: undefined }
  },
  data() {
    return {
      inputValue: this.value || undefined,
      tempType: this.type
    };
  },
  methods: {
    submit(event) {
      this.$emit("enter");
    },
    handleInput(event) {
      if (this.value !== undefined) {
        this.$emit("update:value", this.inputValue);
      } else {
        this.$emit("change", this.inputValue, event);
      }
    },
    toggleShowPassword() {
      if (this.tempType === "text") {
        this.tempType = "password";
      } else {
        this.tempType = "text";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./src/scss/variables";
@import "./src/scss/media-queries";

.group {
  display: flex;
  margin-bottom: 1rem;
  width: 100%;
  position: relative;
  max-width: 35rem;

  &:hover,
  &:focus {
    .group__input {
      border-color: $text-color;

      &-icon {
        fill: $text-color;
      }
    }
  }

  &.completed {
    .group__input {
      border-color: $text-color;

      &-icon {
        fill: $text-color;
      }
    }
  }

  &__input {
    width: 100%;
    padding: 10px 10px 10px 45px;
    outline: none;
    background-color: $background-color-secondary;
    color: $text-color;
    font-weight: 100;
    font-size: 1.2rem;
    border: 1px solid $text-color-50;
    margin: 0;
    margin-left: -2.2rem !important;
    z-index: 3;
    transition: color 0.5s ease, background-color 0.5s ease, border 0.5s ease;

    border-radius: 0;
    -webkit-appearance: none;

    &-show {
      position: absolute;
      display: grid;
      place-items: center;
      right: 20px;
      z-index: 11;
      margin: auto 0;
      height: 100%;
      font-size: 0.9rem;
      cursor: pointer;
      color: $text-color-50;
      -webkit-user-select: none;
      user-select: none;
    }
  }

  &__input-icon {
    width: 24px;
    height: 24px;
    fill: $text-color-50;
    transition: fill 0.5s ease;
    pointer-events: none;
    margin-top: 10px;
    margin-left: 10px;
    z-index: 8;
  }
}
</style>
