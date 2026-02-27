<template>
  <div class="library-stats">
    <div
      v-for="stat in displayStats"
      :key="stat.key"
      class="stat-card"
      :class="{ disabled: stat.value === 0 || loading }"
      @click="
        stat.clickable && stat.value > 0 && !loading && handleClick(stat.key)
      "
    >
      <div class="stat-icon">
        <component :is="stat.icon" />
      </div>
      <div class="stat-content">
        <div class="stat-value" v-if="!loading">{{ stat.value }}</div>
        <div class="stat-value loading-dots" v-else>...</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import IconMovie from "@/icons/IconMovie.vue";
  import IconShow from "@/icons/IconShow.vue";
  import IconMusic from "@/icons/IconMusic.vue";
  import IconClock from "@/icons/IconClock.vue";

  interface Props {
    movies: number;
    shows: number;
    music: number;
    watchtime: number;
    loading?: boolean;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    openLibrary: [type: string];
  }>();

  const displayStats = computed(() => [
    {
      key: "movies",
      icon: IconMovie,
      value: props.movies,
      label: "Movies",
      clickable: true
    },
    {
      key: "shows",
      icon: IconShow,
      value: props.shows,
      label: "TV Shows",
      clickable: true
    },
    {
      key: "music",
      icon: IconMusic,
      value: props.music,
      label: "Albums",
      clickable: true
    },
    {
      key: "watchtime",
      icon: IconClock,
      value: props.watchtime,
      label: "Hours Watched",
      clickable: false
    }
  ]);

  function handleClick(type: string) {
    emit("openLibrary", type);
  }
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .library-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
    margin-bottom: 0.85rem;

    @include mobile-only {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.65rem;
    }
  }

  .stat-card {
    background-color: var(--background-ui);
    border-radius: 0.5rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;

    @include mobile-only {
      padding: 0.85rem 0.75rem;
    }

    &:hover:not(.disabled) {
      background-color: var(--background-40);
      border-color: var(--highlight-color);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &.disabled {
      cursor: default;
      opacity: 0.6;

      &:hover {
        transform: none;
        border-color: transparent;
      }
    }
  }

  .stat-icon {
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;

    @include mobile-only {
      width: 2rem;
      height: 2rem;
    }

    svg {
      width: 100%;
      height: 100%;
      fill: var(--highlight-color);
      transition: fill 0.2s ease;
    }
  }

  .stat-card:hover:not(.disabled) .stat-icon svg {
    fill: var(--color-green-90);
  }

  .stat-content {
    text-align: center;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-color);
    line-height: 1;
    margin-bottom: 0.25rem;

    @include mobile-only {
      font-size: 1.3rem;
    }
  }

  .stat-label {
    font-size: 0.75rem;
    color: var(--text-color-60);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.03em;

    @include mobile-only {
      font-size: 0.7rem;
    }
  }

  .loading-dots {
    animation: loadingDots 1.5s infinite;
  }

  @keyframes loadingDots {
    0%,
    20% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.3;
    }
  }
</style>
