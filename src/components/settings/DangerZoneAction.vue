<template>
  <div class="danger-zone">
    <h3 class="danger-zone__title">{{ title }}</h3>
    <p class="danger-zone__description">
      {{ description }}
    </p>
    <button class="danger-zone__button" @click="$emit('action')">
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    title: string;
    description: string;
    buttonText: string;
  }

  interface Emit {
    (e: "action"): void;
  }

  defineProps<Props>();
  defineEmits<Emit>();
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .danger-zone {
    padding: 1.25rem;
    background: rgba(220, 48, 35, 0.1);
    border: 1px solid var(--color-error-highlight);
    border-radius: 0.5rem;

    @include mobile-only {
      padding: 1rem;
    }

    &__title {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--color-error-highlight);
    }

    &__description {
      margin: 0 0 1rem 0;
      font-size: 0.875rem;
      color: var(--text-color-70);
      line-height: 1.5;
    }

    &__button {
      padding: 0.625rem 1.25rem;
      background: var(--color-error);
      color: white;
      border: 1px solid var(--color-error-highlight);
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: var(--color-error-highlight);
      }
    }
  }
</style>
