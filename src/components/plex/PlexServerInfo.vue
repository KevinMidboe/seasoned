<template>
  <div class="plex-server-info">
    <div class="plex-details">
      <div class="detail-row">
        <span class="detail-label">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          Server
        </span>
        <span class="detail-value">{{ serverName || "Unknown" }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path
              d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
            ></path>
          </svg>
          Last Sync
        </span>
        <span class="detail-value">{{ lastSync || "Never" }}</span>
      </div>
    </div>

    <div class="plex-actions">
      <seasoned-button @click="$emit('sync')" :disabled="syncing">
        <svg
          v-if="!syncing"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="23 4 23 10 17 10"></polyline>
          <polyline points="1 20 1 14 7 14"></polyline>
          <path
            d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
          ></path>
        </svg>
        {{ syncing ? "Syncing..." : "Sync Library" }}
      </seasoned-button>
      <seasoned-button @click="$emit('unlink')">
        Unlink Account
      </seasoned-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import SeasonedButton from "@/components/ui/SeasonedButton.vue";

  interface Props {
    serverName: string;
    lastSync: string;
    syncing?: boolean;
  }

  defineProps<Props>();
  defineEmits<{
    sync: [];
    unlink: [];
  }>();
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .plex-details {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 0.85rem;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    padding: 0.55rem 0.65rem;
    background-color: var(--background-ui);
    border-radius: 0.25rem;

    @include mobile-only {
      padding: 0.5rem 0.6rem;
    }
  }

  .detail-label {
    font-size: 0.85rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    @include mobile-only {
      font-size: 0.8rem;
    }

    svg {
      color: var(--text-color-60);
      flex-shrink: 0;
    }
  }

  .detail-value {
    font-size: 0.95rem;

    @include mobile-only {
      font-size: 0.9rem;
    }
  }

  .plex-actions {
    display: flex;
    gap: 0.65rem;

    @include mobile-only {
      flex-direction: column;
      gap: 0.6rem;
    }

    button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;

      svg {
        flex-shrink: 0;
      }
    }
  }
</style>
