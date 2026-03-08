<template>
  <div class="password">
    <h1 class="password__title">Password Generator</h1>

    <div class="password__content">
      <password-generator />
    </div>
  </div>
</template>

<script setup lang="ts">
  import PasswordGenerator from "@/components/settings/PasswordGenerator.vue";

  function handleGeneratedPassword() {
    return;
  }
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .password {
    padding: 3rem;
    max-width: 100%;

    @include mobile-only {
      padding: 0.75rem;
    }

    &__title {
      margin: 0 0 2rem 0;
      font-size: 2rem;
      font-weight: 300;
      color: $text-color;
      line-height: 1;

      @include mobile-only {
        font-size: 1.5rem;
        margin: 0 0 1rem 0;
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }
  }
</style>
