<template>
  <div class="data-export">
    <div class="export-options">
      <!-- Request History Card -->
      <RequestHistory :data="requestStats" />

      <!-- Export Data Card -->
      <ExportSection :data="requestStats" />

      <!-- Local Storage Items -->
      <StorageManager />

      <!-- Delete Account -->
      <DangerZoneAction
        title="Delete Account"
        description="Permanently delete your account and all associated data. This action cannot be undone."
        button-text="Delete My Account"
        @action="confirmDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import StorageManager from "./StorageManager.vue";
  import ExportSection from "./ExportSection.vue"
  import RequestHistory from "./RequestHistory.vue"
  import DangerZoneAction from "./DangerZoneAction.vue";

  const requestStats = ref({
    total: 45,
    approved: 38,
    pending: 7
  });

  function confirmDelete() {
    const confirmed = confirm(
      "Are you sure you want to *permanently delete* your account and all associated data? This action cannot be undone."
    );

    if (!confirmed) return;
  }
</script>

<style lang="scss" scoped>
  .export-options {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    gap: 2rem;
  }
</style>
