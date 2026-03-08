<template>
  <div v-if="topContent.length > 0" class="watch-history">
    <h3 class="section-title">Last Watched</h3>
    <div class="top-content-list">
      <div
        v-for="(item, index) in topContent"
        :key="index"
        class="top-content-item"
      >
        <div class="content-rank">{{ index + 1 }}</div>
        <div class="content-details">
          <div class="content-title">{{ item.title }}</div>
          <div class="content-meta">
            {{ item.type }} • {{ item.plays }} plays • {{ item.duration }}min
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface TopContentItem {
    title: string;
    type: string;
    plays: number;
    duration: number;
  }

  interface Props {
    topContent: TopContentItem[];
  }

  defineProps<Props>();
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .watch-history {
    margin-top: 2rem;
  }

  .section-title {
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
    font-weight: 500;
    color: $text-color;
  }

  .top-content-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;

    @include mobile-only {
      grid-template-columns: 1fr;
    }
  }

  .top-content-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: var(--background-ui);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid var(--text-color-50);
    transition: all 0.2s;

    &:hover {
      border-color: var(--text-color);
      transform: translateY(-2px);
    }
  }

  .content-rank {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--highlight-color);
    min-width: 2.5rem;
    text-align: center;
  }

  .content-details {
    flex: 1;
  }

  .content-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 0.25rem;
  }

  .content-meta {
    font-size: 0.85rem;
    color: var(--text-color-60);
  }
</style>
