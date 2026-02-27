<template>
  <div class="system-status">
    <h2 class="system-status__title">System Status</h2>
    <div class="system-status__items">
      <div class="status-item" v-for="item in systemItems" :key="item.name">
        <div class="status-item__header">
          <span class="status-item__name">{{ item.name }}</span>
          <span
            :class="[
              'status-item__indicator',
              `status-item__indicator--${item.status}`
            ]"
          ></span>
        </div>
        <div class="status-item__details">
          <span class="status-item__value">{{ item.value }}</span>
          <span class="status-item__description">{{ item.description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";

  interface SystemItem {
    name: string;
    status: "online" | "warning" | "offline";
    value: string;
    description: string;
  }

  const systemItems = ref<SystemItem[]>([]);

  onMounted(() => {
    systemItems.value = [
      {
        name: "API Server",
        status: "online",
        value: "Running",
        description: "All endpoints responding"
      },
      {
        name: "Database",
        status: "online",
        value: "Connected",
        description: "Latency: 12ms"
      },
      {
        name: "Cache Server",
        status: "online",
        value: "Active",
        description: "Hit rate: 87%"
      },
      {
        name: "Disk Space",
        status: "warning",
        value: "45% Used",
        description: "1.2 TB / 2.7 TB"
      },
      {
        name: "Background Jobs",
        status: "online",
        value: "3 Running",
        description: "Queue size: 12"
      },
      {
        name: "Plex Connection",
        status: "online",
        value: "Connected",
        description: "Server: Home"
      }
    ];
  });
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .system-status {
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

    &__items {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
  }

  .status-item {
    padding: 0.75rem;
    background-color: var(--background-ui);
    border-radius: 0.5rem;

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.25rem;
    }

    &__name {
      font-weight: 500;
      color: $text-color;
      font-size: 0.95rem;
    }

    &__indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;

      &--online {
        background-color: var(--color-success-highlight);
        box-shadow: 0 0 6px var(--color-success);
      }

      &--warning {
        background-color: var(--color-warning-highlight);
        box-shadow: 0 0 6px var(--color-warning);
      }

      &--offline {
        background-color: var(--color-error-highlight);
        box-shadow: 0 0 6px var(--color-error);
      }
    }

    &__details {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &__value {
      font-size: 0.85rem;
      color: $text-color-70;
    }

    &__description {
      font-size: 0.8rem;
      color: $text-color-50;
    }
  }
</style>
