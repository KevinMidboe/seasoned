<template>
  <div v-if="watchStats" class="stats-overview">
    <div class="stat-card">
      <div class="stat-value">{{ watchStats.totalPlays }}</div>
      <div class="stat-label">Total Plays</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{{ watchStats.totalHours }}h</div>
      <div class="stat-label">Watch Time</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{{ watchStats.moviePlays }}</div>
      <div class="stat-label">Movies watched</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{{ watchStats.episodePlays }}</div>
      <div class="stat-label">Episodes watched</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { WatchStats } from "../../composables/useTautulliStats";

  interface Props {
    watchStats: WatchStats | null;
  }

  defineProps<Props>();
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .stats-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;

    @include mobile-only {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }

  .stat-card {
    background: var(--background-ui);
    padding: 1.5rem;
    border-radius: 12px;
    text-align: center;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-4px);
    }

    @include mobile-only {
      padding: 1rem;
    }
  }

  .stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--highlight-color);
    margin-bottom: 0.5rem;

    @include mobile-only {
      font-size: 2rem;
    }
  }

  .stat-label {
    font-size: 0.9rem;
    color: var(--text-color-60);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 300;

    @include mobile-only {
      font-size: 0.8rem;
    }
  }
</style>
