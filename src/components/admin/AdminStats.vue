<template>
  <div class="admin-stats">
    <div class="admin-stats__header">
      <h2 class="admin-stats__title">Statistics</h2>
      <div class="admin-stats__controls">
        <select
          v-model="timeRange"
          class="time-range-select"
          @change="fetchStats"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
        <button class="refresh-btn" @click="fetchStats" :disabled="loading">
          <IconActivity :class="{ spin: loading }" />
        </button>
      </div>
    </div>

    <div v-if="loading" class="admin-stats__loading">Loading statistics...</div>

    <div v-else class="admin-stats__grid">
      <div
        class="stat-card"
        v-for="stat in statCards"
        :key="stat.key"
        @click="handleCardClick(stat.key)"
        :class="{ 'stat-card--clickable': stat.clickable }"
      >
        <div class="stat-card__header">
          <component :is="stat.icon" class="stat-card__icon" />
          <span
            v-if="stat.trend !== 0"
            :class="[
              'stat-card__trend',
              stat.trend > 0 ? 'stat-card__trend--up' : 'stat-card__trend--down'
            ]"
          >
            {{ stat.trend > 0 ? "↑" : "↓" }} {{ Math.abs(stat.trend) }}%
          </span>
        </div>
        <span class="stat-card__value">{{ stat.value }}</span>
        <span class="stat-card__label">{{ stat.label }}</span>
        <div v-if="stat.sparkline" class="stat-card__sparkline">
          <div
            v-for="(point, index) in stat.sparkline"
            :key="index"
            class="sparkline-bar"
            :style="{
              height: `${(point / Math.max(...stat.sparkline)) * 100}%`
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  import IconProfile from "@/icons/IconProfile.vue";
  import IconPlay from "@/icons/IconPlay.vue";
  import IconRequest from "@/icons/IconRequest.vue";
  import IconActivity from "@/icons/IconActivity.vue";

  interface Stat {
    key: string;
    value: string | number;
    label: string;
    trend: number;
    icon: any;
    clickable: boolean;
    sparkline?: number[];
  }

  const stats = ref({
    totalUsers: 0,
    activeTorrents: 0,
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    totalStorage: "0 GB",
    usersTrend: 0,
    torrentsTrend: 0,
    requestsTrend: 0,
    pendingTrend: 0,
    approvedTrend: 0,
    storageTrend: 0,
    usersSparkline: [] as number[],
    torrentsSparkline: [] as number[],
    requestsSparkline: [] as number[]
  });

  const loading = ref(false);
  const timeRange = ref("week");

  const statCards = computed<Stat[]>(() => [
    {
      key: "totalUsers",
      value: stats.value.totalUsers,
      label: "Total Users",
      trend: stats.value.usersTrend,
      icon: IconProfile,
      clickable: true,
      sparkline: stats.value.usersSparkline
    },
    {
      key: "activeTorrents",
      value: stats.value.activeTorrents,
      label: "Active Torrents",
      trend: stats.value.torrentsTrend,
      icon: IconPlay,
      clickable: true,
      sparkline: stats.value.torrentsSparkline
    },
    {
      key: "totalRequests",
      value: stats.value.totalRequests,
      label: "Total Requests",
      trend: stats.value.requestsTrend,
      icon: IconRequest,
      clickable: true,
      sparkline: stats.value.requestsSparkline
    },
    {
      key: "pendingRequests",
      value: stats.value.pendingRequests,
      label: "Pending Requests",
      trend: stats.value.pendingTrend,
      icon: IconRequest,
      clickable: true
    },
    {
      key: "approvedRequests",
      value: stats.value.approvedRequests,
      label: "Approved",
      trend: stats.value.approvedTrend,
      icon: IconRequest,
      clickable: true
    },
    {
      key: "totalStorage",
      value: stats.value.totalStorage,
      label: "Storage Used",
      trend: stats.value.storageTrend,
      icon: IconActivity,
      clickable: false
    }
  ]);

  const generateSparkline = (
    baseValue: number,
    points: number = 7
  ): number[] => {
    return Array.from({ length: points }, () => {
      const variance = Math.random() * 0.3 - 0.15;
      return Math.max(0, Math.floor(baseValue * (1 + variance)));
    });
  };

  async function fetchStats() {
    loading.value = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const baseUsers = 142;
      const baseTorrents = 23;
      const baseRequests = 856;

      stats.value = {
        totalUsers: baseUsers,
        activeTorrents: baseTorrents,
        totalRequests: baseRequests,
        pendingRequests: 12,
        approvedRequests: 712,
        totalStorage: "2.4 TB",
        usersTrend: 8.5,
        torrentsTrend: -3.2,
        requestsTrend: 12.7,
        pendingTrend: -15.4,
        approvedTrend: 18.2,
        storageTrend: 5.8,
        usersSparkline: generateSparkline(baseUsers / 7),
        torrentsSparkline: generateSparkline(baseTorrents),
        requestsSparkline: generateSparkline(baseRequests / 30)
      };
    } finally {
      loading.value = false;
    }
  }

  function handleCardClick(key: string) {
    console.log(`Stat card clicked: ${key}`);
  }

  onMounted(() => fetchStats());
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .admin-stats {
    background-color: var(--background-color-secondary);
    border-radius: 0.5rem;
    padding: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 100%;
    overflow: hidden;

    @include mobile-only {
      background-color: transparent;
      border-radius: 0;
      padding: 0;
      box-shadow: none;
      width: 100%;
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
      gap: 0.5rem;

      @include mobile-only {
        margin-bottom: 0.6rem;
        width: 100%;
      }
    }

    &__title {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 400;
      color: $text-color;
      text-transform: uppercase;
      letter-spacing: 0.8px;

      @include mobile-only {
        font-size: 0.95rem;
      }
    }

    &__controls {
      display: flex;
      gap: 0.5rem;
      align-items: center;

      @include mobile-only {
        width: 100%;
        justify-content: space-between;
      }
    }

    &__loading {
      padding: 2rem;
      text-align: center;
      color: $text-color-70;

      @include mobile-only {
        padding: 1.5rem;
        font-size: 0.9rem;
      }
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;

      @include mobile-only {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.6rem;
        width: 100%;
      }
    }
  }

  .time-range-select {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--background-40);
    border-radius: 0.25rem;
    background-color: var(--background-color);
    color: $text-color;
    font-size: 0.85rem;
    cursor: pointer;

    @include mobile-only {
      flex: 1;
      font-size: 0.8rem;
      padding: 0.4rem 0.5rem;
    }

    &:focus {
      outline: none;
      border-color: var(--highlight-color);
    }
  }

  .refresh-btn {
    background: none;
    border: 1px solid var(--background-40);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;

    @include mobile-only {
      width: 40px;
      padding: 0.4rem;
    }

    &:hover:not(:disabled) {
      background-color: var(--background-ui);
      border-color: var(--highlight-color);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    svg {
      width: 18px;
      height: 18px;
      fill: $text-color;

      @include mobile-only {
        width: 16px;
        height: 16px;
      }

      &.spin {
        animation: spin 1s linear infinite;
      }
    }
  }

  .stat-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem;
    background-color: var(--background-ui);
    border-radius: 0.5rem;
    text-align: center;
    transition: all 0.2s;
    overflow: hidden;
    min-width: 0;

    @include mobile-only {
      padding: 0.6rem 0.4rem;
      width: 100%;
      box-sizing: border-box;
    }

    &--clickable {
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        background-color: var(--background-40);
      }

      @include mobile-only {
        &:hover {
          transform: none;
        }

        &:active {
          transform: scale(0.98);
        }
      }
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-bottom: 0.4rem;

      @include mobile-only {
        margin-bottom: 0.3rem;
      }
    }

    &__icon {
      width: 20px;
      height: 20px;
      fill: var(--highlight-color);
      opacity: 0.8;

      @include mobile-only {
        width: 16px;
        height: 16px;
      }
    }

    &__trend {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;

      @include mobile-only {
        font-size: 0.65rem;
        padding: 0.15rem 0.3rem;
      }

      &--up {
        color: $white;
        background-color: var(--color-success-highlight);
      }

      &--down {
        color: $white;
        background-color: var(--color-error-highlight);
      }
    }

    &__value {
      font-size: 2.2rem;
      font-weight: 600;
      color: var(--highlight-color);
      margin-bottom: 0.15rem;
      line-height: 1.1;
      padding: 1rem 0;

      @include mobile-only {
        font-size: 1.25rem;
        margin-bottom: 0.1rem;
      }
    }

    &__label {
      font-size: 0.75rem;
      color: $text-color-70;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      margin-bottom: 0.4rem;
      word-break: break-word;
      max-width: 100%;
      line-height: 1.2;

      @include mobile-only {
        font-size: 0.65rem;
        margin-bottom: 0.3rem;
        letter-spacing: 0.2px;
      }
    }

    &__sparkline {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      width: 100%;
      height: 24px;
      margin-top: 0.4rem;
      gap: 2px;

      @include mobile-only {
        height: 18px;
        margin-top: 0.3rem;
        gap: 1px;
      }
    }
  }

  .sparkline-bar {
    flex: 1;
    background: linear-gradient(
      180deg,
      var(--highlight-color) 0%,
      var(--color-green-70) 100%
    );
    border-radius: 2px 2px 0 0;
    min-height: 3px;
    transition: all 0.3s ease;

    .stat-card:hover & {
      opacity: 0.9;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
