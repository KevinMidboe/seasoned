<template>
  <li
    class="sidebar-list-element"
    :class="{ active, disabled }"
    @click="emit('click')"
    @keydown.enter="emit('click')"
  >
    <slot></slot>
  </li>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits } from "vue";

  interface Props {
    active?: boolean;
    disabled?: boolean;
  }

  interface Emit {
    (e: "click");
  }

  const emit = defineEmits<Emit>();
  defineProps<Props>();
</script>

<style lang="scss">
  @import "src/scss/media-queries";

  li.sidebar-list-element {
    display: flex;
    align-items: center;
    text-decoration: none;
    text-transform: uppercase;
    color: var(--text-color-50);
    font-size: 12px;
    padding: 10px 0;
    border-bottom: 1px solid var(--text-color-5);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;

    &:first-of-type {
      padding-top: 0;
    }

    div > svg,
    svg {
      width: 26px;
      height: 26px;
      margin-right: 1rem;
      transition: all 0.3s ease;
      fill: var(--text-color-70);
    }

    &:hover,
    &.active {
      color: var(--text-color);

      div > svg,
      svg {
        fill: var(--text-color);
        transform: scale(1.1, 1.1);
      }
    }

    &.active > div > svg,
    &.active > svg {
      fill: var(--color-green);
    }

    &.disabled {
      cursor: default;
    }

    .pending {
      color: #f8bd2d;
    }

    .meta {
      margin-left: auto;
      text-align: right;
    }
  }
</style>
