<template>
  <div class="group" :class="{ completed: value, focus }">
    <component :is="inputIcon" v-if="inputIcon" />

    <input
      class="input"
      :type="tempType || type"
      @input="handleInput"
      v-model="inputValue"
      :placeholder="placeholder"
      @keyup.enter="event => $emit('enter', event)"
      @focus="focus = true"
      @blur="focus = false"
    />

    <i
      v-if="value && type === 'password'"
      @click="toggleShowPassword"
      @keydown.enter="toggleShowPassword"
      class="show noselect"
      tabindex="0"
      >{{ tempType == "password" ? "show" : "hide" }}</i
    >
  </div>
</template>

<script>
import IconKey from "../../icons/IconKey";
import IconEmail from "../../icons/IconEmail";

export default {
  components: { IconKey, IconEmail },
  props: {
    placeholder: { type: String },
    type: { type: String, default: "text" },
    value: { type: String, default: undefined }
  },
  data() {
    return {
      inputValue: this.value || undefined,
      tempType: this.type,
      focus: false
    };
  },
  computed: {
    inputIcon() {
      if (this.type === "password") return IconKey;
      if (this.type === "email") return IconEmail;
      return false;
    }
  },
  methods: {
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
@import "src/scss/variables";
@import "src/scss/media-queries";

.group {
  display: flex;
  width: 100%;
  position: relative;
  max-width: 35rem;
  border: 1px solid var(--text-color-50);
  background-color: var(--background-color-secondary);

  &.completed,
  &.focus,
  &:hover,
  &:focus {
    border-color: var(--text-color);

    svg {
      fill: var(--text-color);
    }
  }

  svg {
    width: 24px;
    height: 24px;
    fill: var(--text-color-50);
    pointer-events: none;
    margin-top: 10px;
    margin-left: 10px;
    z-index: 8;
  }

  input {
    width: 100%;
    padding: 10px;
    outline: none;
    background-color: var(--background-color-secondary);
    color: var(--text-color);
    font-weight: 100;
    font-size: 1.2rem;
    margin: 0;
    z-index: 3;
    border: none;

    border-radius: 0;
    -webkit-appearance: none;
  }

  .show {
    position: absolute;
    display: grid;
    place-items: center;
    right: 20px;
    z-index: 11;
    margin: auto 0;
    height: 100%;
    font-size: 0.9rem;
    cursor: pointer;
    color: var(--text-color-50);
    -webkit-user-select: none;
    user-select: none;
  }
}
</style>
