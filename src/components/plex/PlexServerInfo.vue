<template>
  <div class="plex-server-info">
    <div class="plex-details">
      <div class="detail-row">
        <span class="detail-label">
          <IconServer class="label-icon" style="fill: var(--text-color)" />
          Plex server name
        </span>
        <span class="detail-value">{{ serverName || "Unknown" }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">
          <IconSync class="label-icon" style="stroke: var(--text-color)" />
          Last Sync
        </span>
        <span class="detail-value">{{ lastSync || "Never" }}</span>
      </div>
    </div>

    <div class="plex-actions">
      <seasoned-button @click="$emit('sync')" :disabled="syncing">
        <IconSync v-if="!syncing" class="button-icon" />
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
  import IconServer from "@/icons/IconServer.vue";
  import IconSync from "@/icons/IconSync.vue";

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
      flex-shrink: 0;
    }

    .label-icon {
      width: 16px;
      height: 16px;
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

      .button-icon {
        width: 16px;
        height: 16px;
      }
    }
  }
</style>
