<template>
  <div class="toggle-container">
    <button
      v-for="option in options"
      :key="option"
      class="toggle-button"
      :class="selected === option ? 'selected' : null"
      @click="() => toggleTo(option)"
    >
      {{ option }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits } from "vue";

  interface Props {
    options: string[];
    selected?: string;
  }

  interface Emit {
    (e: "update:selected", selected: string);
    (e: "change");
  }

  defineProps<Props>();
  const emit = defineEmits<Emit>();

  function toggleTo(option: string) {
    emit("update:selected", option);
    emit("change");
  }
</script>

<style lang="scss" scoped>
  @import "src/scss/variables";

  $background: $background-ui;
  $background-selected: $background-color-secondary;

  .toggle-container {
    width: 100%;
    display: flex;
    overflow-x: scroll;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: $background;
    border: 2px solid $background;
    border-radius: 8px;
    border-left: 4px solid $background;
    border-right: 4px solid $background;

    .toggle-button {
      font-size: 1rem;
      line-height: 1rem;
      font-weight: normal;
      padding: 0.5rem;
      border: 0;
      color: $text-color;
      background-color: $background;
      text-transform: capitalize;
      cursor: pointer;
      display: block;
      flex: 1 0 auto;

      &.selected {
        color: $text-color;
        background-color: $background-selected;
        border-radius: 8px;
      }
    }
  }
</style>
