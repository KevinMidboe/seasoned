<template>
  <div class="security-settings">
    <div class="security-settings__intro">
      <h2 class="security-settings__title">Security</h2>
      <p class="security-settings__description">
        Keep your account safe by using a strong, unique password. We recommend
        using a passphrase or generated password that's hard to guess.
      </p>
    </div>

    <change-password />
  </div>
</template>

<script setup lang="ts">
  import ChangePassword from "@/components/profile/ChangePassword.vue";
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .security-settings {
    &__intro {
      margin-bottom: 1rem;

      @include mobile-only {
        margin-bottom: 0.85rem;
      }
    }

    &__title {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1.3;
    }

    &__description {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.6;
      color: var(--text-color-70);
    }
  }
</style>
