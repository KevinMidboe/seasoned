<template>
  <div class="activity-feed">
    <h2 class="activity-feed__title">Recent Activity</h2>
    <div class="activity-feed__list">
      <div
        class="activity-item"
        v-for="activity in activities"
        :key="activity.id"
      >
        <div class="activity-item__icon">
          <component :is="getIcon(activity.type)" />
        </div>
        <div class="activity-item__content">
          <span class="activity-item__message">{{ activity.message }}</span>
          <span class="activity-item__time">{{
            formatTime(activity.timestamp)
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from "vue";
  import IconMovie from "@/icons/IconMovie.vue";
  import IconPlay from "@/icons/IconPlay.vue";
  import IconRequest from "@/icons/IconRequest.vue";
  import IconProfile from "@/icons/IconProfile.vue";

  interface Activity {
    id: number;
    type: "request" | "download" | "user" | "movie";
    message: string;
    timestamp: Date;
  }

  const activities = ref<Activity[]>([]);

  const getIcon = (type: string) => {
    const icons: Record<string, any> = {
      request: IconRequest,
      download: IconPlay,
      user: IconProfile,
      movie: IconMovie
    };
    return icons[type] || IconMovie;
  };

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  onMounted(() => {
    activities.value = [
      {
        id: 1,
        type: "request",
        message: "New request: Interstellar (2014)",
        timestamp: new Date(Date.now() - 5 * 60000)
      },
      {
        id: 2,
        type: "download",
        message: "Torrent completed: Dune Part Two",
        timestamp: new Date(Date.now() - 23 * 60000)
      },
      {
        id: 3,
        type: "user",
        message: "New user registered: john_doe",
        timestamp: new Date(Date.now() - 45 * 60000)
      },
      {
        id: 4,
        type: "movie",
        message: "Movie added to library: The Batman",
        timestamp: new Date(Date.now() - 2 * 3600000)
      },
      {
        id: 5,
        type: "request",
        message: "Request approved: Oppenheimer",
        timestamp: new Date(Date.now() - 3 * 3600000)
      },
      {
        id: 6,
        type: "download",
        message: "Torrent started: Poor Things",
        timestamp: new Date(Date.now() - 5 * 3600000)
      },
      {
        id: 7,
        type: "user",
        message: "User upgraded to VIP: sarah_s",
        timestamp: new Date(Date.now() - 8 * 3600000)
      },
      {
        id: 8,
        type: "movie",
        message: "Library scan completed: 12 new items",
        timestamp: new Date(Date.now() - 12 * 3600000)
      }
    ];
  });
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .activity-feed {
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

    &__list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-height: 400px;
      overflow-y: auto;
    }
  }

  .activity-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 0.75rem;
    background-color: var(--background-ui);
    border-radius: 0.5rem;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--background-40);
    }

    &__icon {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--highlight-color);
      border-radius: 50%;

      svg {
        width: 16px;
        height: 16px;
        fill: $white;
      }
    }

    &__content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    &__message {
      font-size: 0.9rem;
      color: $text-color;
      line-height: 1.3;
    }

    &__time {
      font-size: 0.75rem;
      color: $text-color-50;
    }
  }
</style>
