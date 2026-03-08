<template>
  <div class="settings-section-card">
    <div class="settings-section-header">
      <h2>Export Your Data</h2>
      <p>
        Download a copy of your account data including requests, watch history,
        and preferences.
      </p>
    </div>

    <!-- Export to JSON & CSV section -->
    <div class="export-actions">
      <button
        class="export-btn"
        @click="() => exportData('json')"
        :disabled="exporting"
      >
        <IconActivity v-if="exporting" class="spin" />
        <span v-else>Export as JSON</span>
      </button>
      <button
        class="export-btn"
        @click="() => exportData('csv')"
        :disabled="exporting"
      >
        <IconActivity v-if="exporting" class="spin" />
        <span v-else>Export as CSV</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, defineProps } from "vue";
  import IconActivity from "@/icons/IconActivity.vue";

  interface Props {
    data: any;
  }

  const props = defineProps<Props>();

  const exporting = ref(false);

  async function exportData(format: "json" | "csv") {
    exporting.value = true;

    // Mock export
    await new Promise(resolve => setTimeout(resolve, 1500));

    const data = {
      username: "user123",
      requests: props?.data,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob(
      [format === "json" ? JSON.stringify(data, null, 2) : convertToCSV(data)],
      { type: format === "json" ? "application/json" : "text/csv" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `seasoned-data-export.${format}`;
    link.click();
    URL.revokeObjectURL(url);

    exporting.value = false;
  }

  function convertToCSV(data: any): string {
    return `Username,Total Requests,Approved,Pending,Export Date\n${data.username},${data.requests.total},${data.requests.approved},${data.requests.pending},${data.exportDate}`;
  }


</script>

<style lang="scss" scoped>
  @import "scss/media-queries";
  @import "scss/shared-settings";

  .export-actions {
    display: flex;
    gap: 0.55rem;

    @include mobile-only {
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  .export-btn {
    flex: 1;
    padding: 0.55rem 0.85rem;
    background-color: var(--highlight-color);
    color: white;
    border: none;
    border-radius: 0.25rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;

    &:hover:not(:disabled) {
      background-color: var(--color-green-90);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    svg {
      width: 16px;
      height: 16px;
      fill: white;

      &.spin {
        animation: spin 1s linear infinite;
      }
    }
  }
</style>
