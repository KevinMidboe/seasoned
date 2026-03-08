<template>
  <div class="activity-feed">
    <div class="activity-feed__header">
      <h2 class="activity-feed__title">Recent Activity</h2>
      <div class="activity-feed__controls">
        <select v-model="typeFilter" class="activity-feed__filter">
          <option value="">All Types</option>
          <option value="request">Requests</option>
          <option value="download">Downloads</option>
          <option value="user">Users</option>
          <option value="movie">Library</option>
        </select>
        <select
          v-model="timeFilter"
          class="activity-feed__filter"
          @change="fetchActivities"
        >
          <option value="1h">Last Hour</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
        <button
          class="refresh-btn"
          @click="fetchActivities"
          :disabled="loading"
        >
          <IconActivity :class="{ spin: loading }" />
        </button>
      </div>
    </div>

    <div v-if="loading" class="activity-feed__loading">
      Loading activities...
    </div>
    <div v-else-if="error" class="activity-feed__error">{{ error }}</div>

    <div v-else class="activity-feed__list">
      <div
        class="activity-item"
        v-for="activity in filteredActivities"
        :key="activity.id"
        @click="handleActivityClick(activity)"
      >
        <div
          :class="[
            'activity-item__icon',
            `activity-item__icon--${activity.type}`
          ]"
        >
          <component :is="getIcon(activity.type)" />
        </div>
        <div class="activity-item__content">
          <div class="activity-item__header">
            <span class="activity-item__message">{{ activity.message }}</span>
            <span v-if="activity.metadata" class="activity-item__badge">
              {{ activity.metadata }}
            </span>
          </div>
          <div class="activity-item__footer">
            <span class="activity-item__user" v-if="activity.user">{{
              activity.user
            }}</span>
            <span class="activity-item__time">{{
              formatTime(activity.timestamp)
            }}</span>
          </div>
        </div>
      </div>

      <div v-if="filteredActivities.length === 0" class="activity-feed__empty">
        No activities found
      </div>
    </div>

    <div
      v-if="!loading && filteredActivities.length > 0"
      class="activity-feed__footer"
    >
      <span class="activity-count"
        >{{ filteredActivities.length }} of
        {{ activities.length }} activities</span
      >
      <button
        v-if="hasMore"
        class="load-more-btn"
        @click="loadMore"
        :disabled="loadingMore"
      >
        {{ loadingMore ? "Loading..." : "Load More" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from "vue";
  import IconMovie from "@/icons/IconMovie.vue";
  import IconPlay from "@/icons/IconPlay.vue";
  import IconRequest from "@/icons/IconRequest.vue";
  import IconProfile from "@/icons/IconProfile.vue";
  import IconActivity from "@/icons/IconActivity.vue";

  type ActivityType = "request" | "download" | "user" | "movie";

  interface Activity {
    id: number;
    type: ActivityType;
    message: string;
    timestamp: Date;
    user?: string;
    metadata?: string;
    details?: any;
  }

  const activities = ref<Activity[]>([]);
  const loading = ref(false);
  const loadingMore = ref(false);
  const error = ref("");
  const typeFilter = ref<ActivityType | "">("");
  const timeFilter = ref("24h");
  const hasMore = ref(true);
  const page = ref(1);

  const filteredActivities = computed(() => {
    let result = [...activities.value];

    if (typeFilter.value) {
      result = result.filter(a => a.type === typeFilter.value);
    }

    return result;
  });

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

  const generateMockActivities = (
    count: number,
    startId: number
  ): Activity[] => {
    const types: ActivityType[] = ["request", "download", "user", "movie"];
    const messages = {
      request: [
        "New request: Interstellar (2014)",
        "Request approved: Oppenheimer",
        "Request denied: The Matrix",
        "Request fulfilled: Dune Part Two"
      ],
      download: [
        "Torrent completed: Dune Part Two",
        "Torrent started: Poor Things",
        "Download failed: Network Error",
        "Torrent paused by admin"
      ],
      user: [
        "New user registered: john_doe",
        "User upgraded to VIP: sarah_s",
        "User login from new device: alex_p",
        "Password changed: mike_r"
      ],
      movie: [
        "Movie added to library: The Batman",
        "Library scan completed: 12 new items",
        "Show updated: Breaking Bad S5",
        "Media deleted: Old Movie (1999)"
      ]
    };

    const users = [
      "admin",
      "kevin_m",
      "sarah_s",
      "john_doe",
      "alex_p",
      "mike_r"
    ];

    return Array.from({ length: count }, (_, i) => {
      const type = types[Math.floor(Math.random() * types.length)];
      const typeMessages = messages[type];
      const message =
        typeMessages[Math.floor(Math.random() * typeMessages.length)];
      const timeOffset = Math.random() * 24 * 60 * 60 * 1000; // Random time in last 24h

      return {
        id: startId + i,
        type,
        message,
        timestamp: new Date(Date.now() - timeOffset),
        user: users[Math.floor(Math.random() * users.length)],
        metadata: type === "request" ? "Pending" : undefined
      };
    });
  };

  async function fetchActivities() {
    loading.value = true;
    error.value = "";
    page.value = 1;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      activities.value = generateMockActivities(15, 1).sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      );

      hasMore.value = true;
    } catch (e) {
      error.value = "Failed to load activities";
    } finally {
      loading.value = false;
    }
  }

  async function loadMore() {
    if (!hasMore.value || loadingMore.value) return;

    loadingMore.value = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newActivities = generateMockActivities(
        10,
        activities.value.length + 1
      );
      activities.value = [...activities.value, ...newActivities].sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      );

      page.value += 1;

      if (page.value >= 5) {
        hasMore.value = false;
      }
    } finally {
      loadingMore.value = false;
    }
  }

  function handleActivityClick(activity: Activity) {
    console.log("Activity clicked:", activity);
  }

  onMounted(fetchActivities);
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .activity-feed {
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
      gap: 0.75rem;

      @include mobile-only {
        gap: 0.6rem;
        margin-bottom: 0.6rem;
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
        width: 100%;
      }
    }

    &__controls {
      display: flex;
      gap: 0.5rem;
      align-items: center;

      @include mobile-only {
        width: 100%;
        gap: 0.4rem;
      }
    }

    &__filter {
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
        min-width: 0;
        max-width: calc(50% - 0.2rem - 20px);
      }

      &:focus {
        outline: none;
        border-color: var(--highlight-color);
      }
    }

    &__loading,
    &__error {
      padding: 2rem;
      text-align: center;
      color: $text-color-70;

      @include mobile-only {
        padding: 1.5rem;
        font-size: 0.9rem;
      }
    }

    &__error {
      color: var(--color-error-highlight);
    }

    &__list {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      max-height: 450px;
      overflow-y: auto;
      padding-right: 0.25rem;

      @include mobile-only {
        max-height: 350px;
        gap: 0.35rem;
      }

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: var(--background-40);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--text-color-50);
        border-radius: 3px;

        &:hover {
          background: var(--text-color-70);
        }
      }
    }

    &__empty {
      padding: 2rem;
      text-align: center;
      color: $text-color-50;
      font-style: italic;

      @include mobile-only {
        padding: 1.5rem;
        font-size: 0.9rem;
      }
    }

    &__footer {
      margin-top: 1rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--background-40);
      display: flex;
      justify-content: space-between;
      align-items: center;

      @include mobile-only {
        margin-top: 0.75rem;
        padding-top: 0.5rem;
        flex-direction: column;
        gap: 0.5rem;
        align-items: stretch;
      }
    }
  }

  .activity-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.65rem;
    background-color: var(--background-ui);
    border-radius: 0.5rem;
    transition: background-color 0.2s;
    cursor: pointer;
    min-width: 0;

    @include mobile-only {
      gap: 0.6rem;
      padding: 0.6rem;
      width: 100%;
      box-sizing: border-box;
    }

    &:hover {
      background-color: var(--background-40);
    }

    @include mobile-only {
      &:hover {
        background-color: var(--background-ui);
      }

      &:active {
        background-color: var(--background-40);
      }
    }

    &__icon {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;

      @include mobile-only {
        width: 26px;
        height: 26px;
      }

      &--request {
        background-color: #3b82f6;
      }

      &--download {
        background-color: var(--highlight-color);
      }

      &--user {
        background-color: #8b5cf6;
      }

      &--movie {
        background-color: #f59e0b;
      }

      svg {
        width: 14px;
        height: 14px;
        fill: $white;

        @include mobile-only {
          width: 13px;
          height: 13px;
        }
      }
    }

    &__content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      min-width: 0;

      @include mobile-only {
        gap: 0.2rem;
      }
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.4rem;
    }

    &__message {
      font-size: 0.85rem;
      color: $text-color;
      line-height: 1.3;
      flex: 1;
      word-break: break-word;
      overflow-wrap: break-word;

      @include mobile-only {
        font-size: 0.78rem;
        line-height: 1.25;
      }
    }

    &__badge {
      flex-shrink: 0;
      font-size: 0.7rem;
      padding: 0.15rem 0.4rem;
      border-radius: 0.25rem;
      background-color: var(--color-warning);
      color: $black;
      font-weight: 500;
      text-transform: uppercase;

      @include mobile-only {
        font-size: 0.6rem;
        padding: 0.1rem 0.3rem;
      }
    }

    &__footer {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      font-size: 0.75rem;

      @include mobile-only {
        font-size: 0.7rem;
        gap: 0.35rem;
      }
    }

    &__user {
      color: $text-color-70;
      font-weight: 500;

      @include mobile-only {
        font-size: 0.7rem;
      }

      &::before {
        content: "@";
        opacity: 0.7;
      }
    }

    &__time {
      color: $text-color-50;

      @include mobile-only {
        font-size: 0.7rem;
      }

      &::before {
        content: "•";
        margin-right: 0.5rem;

        @include mobile-only {
          margin-right: 0.3rem;
        }
      }
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

  .load-more-btn {
    padding: 0.5rem 1rem;
    border: 1px solid var(--background-40);
    background-color: var(--background-ui);
    color: $text-color;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s;

    @include mobile-only {
      width: 100%;
      padding: 0.65rem 1rem;
      font-size: 0.9rem;
    }

    &:hover:not(:disabled) {
      background-color: var(--background-40);
      border-color: var(--highlight-color);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .activity-count {
    font-size: 0.8rem;
    color: $text-color-50;

    @include mobile-only {
      font-size: 0.75rem;
      text-align: center;
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
