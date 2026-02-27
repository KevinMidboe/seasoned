<template>
  <section class="admin">
    <h1 class="admin__title">Password gen</h1>

    <div class="form">
      <password-generator />
    </div>
  </section>
</template>

<script setup lang="ts">
  import PasswordGenerator from "@/components/settings/PasswordGenerator.vue";

  function handleGeneratedPassword() {
    return;
  }
</script>

<style lang="scss" scoped>
  .form {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }
</style>
