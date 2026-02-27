<template>
  <div class="admin-stats">
    <h2 class="admin-stats__title">Statistics</h2>
    <div class="admin-stats__grid">
      <div class="stat-card">
        <span class="stat-card__value">{{ stats.totalUsers }}</span>
        <span class="stat-card__label">Total Users</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__value">{{ stats.activeTorrents }}</span>
        <span class="stat-card__label">Active Torrents</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__value">{{ stats.totalRequests }}</span>
        <span class="stat-card__label">Total Requests</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__value">{{ stats.pendingRequests }}</span>
        <span class="stat-card__label">Pending Requests</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__value">{{ stats.approvedRequests }}</span>
        <span class="stat-card__label">Approved</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__value">{{ stats.totalStorage }}</span>
        <span class="stat-card__label">Storage Used</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";

  interface Stats {
    totalUsers: number;
    activeTorrents: number;
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    totalStorage: string;
  }

  const stats = ref<Stats>({
    totalUsers: 0,
    activeTorrents: 0,
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    totalStorage: "0 GB"
  });

  onMounted(() => {
    stats.value = {
      totalUsers: 142,
      activeTorrents: 23,
      totalRequests: 856,
      pendingRequests: 12,
      approvedRequests: 712,
      totalStorage: "2.4 TB"
    };
  });
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .admin-stats {
    background-color: var(--background-color-secondary);
    border-radius: 0.5rem;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &__title {
      margin: 0 0 1rem 0;
      font-size: 1.25rem;
      font-weight: 400;
      color: $text-color;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;

      @include mobile-only {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }

  .stat-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    background-color: var(--background-ui);
    border-radius: 0.5rem;
    text-align: center;

    &__value {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--highlight-color);
    }

    &__label {
      font-size: 0.85rem;
      color: $text-color-70;
      margin-top: 0.25rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
</style>
