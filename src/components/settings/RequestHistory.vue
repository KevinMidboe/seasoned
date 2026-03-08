<template>
  <div class="export-card">
    <div class="settings-section-header">
      <h2>Request History</h2>
      <p>View and download your complete request history.</p>
    </div>

    <div class="stats-grid">
      <div class="stat-mini">
        <span class="stat-mini__value">{{ data.total }}</span>
        <span class="stat-mini__label">Total</span>
      </div>
      <div class="stat-mini">
        <span class="stat-mini__value">{{ data.approved }}</span>
        <span class="stat-mini__label">Approved</span>
      </div>
      <div class="stat-mini">
        <span class="stat-mini__value">{{ data.pending }}</span>
        <span class="stat-mini__label">Pending</span>
      </div>
    </div>

    <button class="view-btn" @click="viewHistory">View Full History</button>
  </div>
</template>

<script setup lang="ts">
  import { defineProps } from "vue";
  import { useRouter } from "vue-router";

  interface Props {
    data: any;
  }

  defineProps<Props>();
  const router = useRouter();

  function viewHistory() {
    router.push({ name: "profile" });
  }
</script>

<style lang="scss" scoped>
  @import "scss/media-queries";
  @import "scss/shared-settings";

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    margin-bottom: 0.65rem;
  }

  .stat-mini {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem 0.4rem;
    background-color: var(--background-color);
    border-radius: 0.25rem;

    @include mobile-only {
      padding: 0.45rem 0.35rem;
    }

    &__value {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--highlight-color);

      @include mobile-only {
        font-size: 1.1rem;
      }
    }

    &__label {
      font-size: 0.7rem;
      text-transform: uppercase;
      margin-top: 0.15rem;

      @include mobile-only {
        font-size: 0.65rem;
      }
    }
  }

  .view-btn {
    width: 100%;
    padding: 0.55rem 0.85rem;
    background-color: var(--background-color);
    border: 1px solid var(--background-40);
    border-radius: 0.25rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--text-color);

    &:hover {
      background-color: var(--background-40);
      border-color: var(--highlight-color);
    }
  }
</style>
