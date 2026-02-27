<template>
  <div class="system-status">
    <div class="system-status__header">
      <h2 class="system-status__title">System Status</h2>
      <button
        class="refresh-btn"
        @click="fetchSystemStatus"
        :disabled="loading"
      >
        <IconActivity :class="{ spin: loading }" />
      </button>
    </div>

    <div v-if="loading" class="system-status__loading">
      Loading system status...
    </div>

    <div v-else class="system-status__items">
      <div
        class="status-item"
        v-for="item in systemItems"
        :key="item.name"
        @click="showDetails(item)"
      >
        <div class="status-item__header">
          <span class="status-item__name">{{ item.name }}</span>
          <div class="status-item__indicator-wrapper">
            <span class="status-item__uptime" v-if="item.uptime">{{
              item.uptime
            }}</span>
            <span
              :class="[
                'status-item__indicator',
                `status-item__indicator--${item.status}`
              ]"
              :title="`${item.status}`"
            ></span>
          </div>
        </div>
        <div class="status-item__details">
          <span class="status-item__value">{{ item.value }}</span>
          <span class="status-item__description">{{ item.description }}</span>
        </div>
        <div v-if="item.metrics" class="status-item__metrics">
          <div
            v-for="metric in item.metrics"
            :key="metric.label"
            class="metric"
          >
            <span class="metric__label">{{ metric.label }}</span>
            <div class="metric__bar">
              <div
                class="metric__fill"
                :style="{ width: `${metric.value}%` }"
                :class="getMetricClass(metric.value)"
              ></div>
            </div>
            <span class="metric__value">{{ metric.value }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="selectedItem" class="modal-overlay" @click="closeDetails">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedItem.name }} Details</h3>
          <button class="close-btn" @click="closeDetails">
            <IconClose />
          </button>
        </div>
        <div class="modal-body">
          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span
              :class="['detail-value', `detail-value--${selectedItem.status}`]"
            >
              {{ selectedItem.status.toUpperCase() }}
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Current Value:</span>
            <span class="detail-value">{{ selectedItem.value }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Description:</span>
            <span class="detail-value">{{ selectedItem.description }}</span>
          </div>
          <div v-if="selectedItem.uptime" class="detail-row">
            <span class="detail-label">Uptime:</span>
            <span class="detail-value">{{ selectedItem.uptime }}</span>
          </div>
          <div v-if="selectedItem.lastCheck" class="detail-row">
            <span class="detail-label">Last Check:</span>
            <span class="detail-value">{{ selectedItem.lastCheck }}</span>
          </div>
          <div v-if="selectedItem.logs" class="detail-logs">
            <h4>Recent Logs</h4>
            <div
              class="log-entry"
              v-for="(log, index) in selectedItem.logs"
              :key="index"
            >
              <span class="log-time">{{ log.time }}</span>
              <span class="log-message">{{ log.message }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="action-btn" @click="restartService(selectedItem)">
            Restart Service
          </button>
          <button
            class="action-btn action-btn--secondary"
            @click="viewFullLogs(selectedItem)"
          >
            View Full Logs
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import IconActivity from "@/icons/IconActivity.vue";
  import IconClose from "@/icons/IconClose.vue";

  interface Metric {
    label: string;
    value: number;
  }

  interface LogEntry {
    time: string;
    message: string;
  }

  interface SystemItem {
    name: string;
    status: "online" | "warning" | "offline";
    value: string;
    description: string;
    uptime?: string;
    lastCheck?: string;
    metrics?: Metric[];
    logs?: LogEntry[];
  }

  const systemItems = ref<SystemItem[]>([]);
  const loading = ref(false);
  const selectedItem = ref<SystemItem | null>(null);

  const getMetricClass = (value: number) => {
    if (value >= 90) return "metric__fill--critical";
    if (value >= 70) return "metric__fill--warning";
    return "metric__fill--good";
  };

  async function fetchSystemStatus() {
    loading.value = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      systemItems.value = [
        {
          name: "API Server",
          status: "online",
          value: "Running",
          description: "All endpoints responding",
          uptime: "15d 7h 23m",
          lastCheck: "Just now",
          metrics: [
            { label: "CPU", value: 23 },
            { label: "Memory", value: 45 }
          ],
          logs: [
            { time: "2m ago", message: "Health check passed" },
            { time: "5m ago", message: "Request handled: /api/v2/movie" },
            { time: "7m ago", message: "Cache hit: user_settings" }
          ]
        },
        {
          name: "Disk Space",
          status: "warning",
          value: "45% Used",
          description: "1.2 TB / 2.7 TB",
          uptime: "15d 7h 23m",
          lastCheck: "Just now",
          metrics: [
            { label: "System", value: 45 },
            { label: "Media", value: 78 }
          ],
          logs: [
            { time: "5m ago", message: "Disk usage check completed" },
            { time: "10m ago", message: "Media folder: 78% full" }
          ]
        },
        {
          name: "Plex Connection",
          status: "online",
          value: "Connected",
          description: "Server: Home",
          uptime: "15d 7h 23m",
          lastCheck: "Just now",
          metrics: [{ label: "Response Time", value: 15 }],
          logs: [
            { time: "2m ago", message: "Plex API request successful" },
            { time: "8m ago", message: "Library sync completed" }
          ]
        }
      ];
    } finally {
      loading.value = false;
    }
  }

  function showDetails(item: SystemItem) {
    selectedItem.value = item;
  }

  function closeDetails() {
    selectedItem.value = null;
  }

  function restartService(item: SystemItem) {
    console.log(`Restarting service: ${item.name}`);
    alert(`Restart initiated for ${item.name}`);
    closeDetails();
  }

  function viewFullLogs(item: SystemItem) {
    console.log(`Viewing full logs for: ${item.name}`);
    alert(`Full logs for ${item.name} would open here`);
  }

  onMounted(fetchSystemStatus);
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .system-status {
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

      @include mobile-only {
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
      }
    }

    &__loading {
      padding: 1.5rem;
      text-align: center;
      color: $text-color-70;

      @include mobile-only {
        padding: 1rem;
        font-size: 0.85rem;
      }
    }

    &__items {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;

      @include mobile-only {
        gap: 0.5rem;
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

  .status-item {
    padding: 0.65rem;
    background-color: var(--background-ui);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 0;

    @include mobile-only {
      padding: 0.6rem;
      width: 100%;
      box-sizing: border-box;
    }

    &:hover {
      background-color: var(--background-40);
      transform: translateX(2px);
    }

    @include mobile-only {
      &:hover {
        transform: none;
      }

      &:active {
        background-color: var(--background-40);
        transform: scale(0.98);
      }
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.2rem;
    }

    &__name {
      font-weight: 500;
      color: $text-color;
      font-size: 0.9rem;
      line-height: 1.2;

      @include mobile-only {
        font-size: 0.82rem;
      }
    }

    &__indicator-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      @include mobile-only {
        gap: 0.35rem;
      }
    }

    &__uptime {
      font-size: 0.75rem;
      color: $text-color-50;

      @include mobile-only {
        font-size: 0.7rem;
      }
    }

    &__indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      animation: pulse 2s infinite;

      @include mobile-only {
        width: 8px;
        height: 8px;
      }

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
      margin-bottom: 0.4rem;

      @include mobile-only {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.15rem;
        margin-bottom: 0.3rem;
      }
    }

    &__value {
      font-size: 0.8rem;
      color: $text-color-70;
      line-height: 1.2;

      @include mobile-only {
        font-size: 0.75rem;
      }
    }

    &__description {
      font-size: 0.75rem;
      color: $text-color-50;
      line-height: 1.2;

      @include mobile-only {
        font-size: 0.7rem;
      }
    }

    &__metrics {
      margin-top: 0.4rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;

      @include mobile-only {
        margin-top: 0.3rem;
        gap: 0.3rem;
      }
    }
  }

  .metric {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.7rem;

    &__label {
      min-width: 65px;
      color: $text-color-70;
      line-height: 1;
    }

    &__bar {
      flex: 1;
      height: 5px;
      background-color: var(--background-40);
      border-radius: 3px;
      overflow: hidden;
    }

    &__fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.3s ease;

      &--good {
        background-color: var(--color-success-highlight);
      }

      &--warning {
        background-color: var(--color-warning-highlight);
      }

      &--critical {
        background-color: var(--color-error-highlight);
      }
    }

    &__value {
      min-width: 35px;
      text-align: right;
      color: $text-color-50;
    }
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;

    @include mobile-only {
      padding: 0.5rem;
      align-items: flex-end;
    }
  }

  .modal-content {
    background-color: var(--background-color-secondary);
    border-radius: 0.5rem;
    max-width: 600px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);

    @include mobile-only {
      max-height: 90vh;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid var(--background-40);

    @include mobile-only {
      padding: 1rem;
    }

    h3 {
      margin: 0;
      color: $text-color;
      font-weight: 400;

      @include mobile-only {
        font-size: 1rem;
      }
    }
  }

  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.25rem;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--background-40);
    }

    svg {
      width: 20px;
      height: 20px;
      fill: $text-color;
    }
  }

  .modal-body {
    padding: 1.5rem;

    @include mobile-only {
      padding: 1rem;
    }
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--background-40);

    &:last-child {
      border-bottom: none;
    }
  }

  .detail-label {
    font-weight: 500;
    color: $text-color-70;
  }

  .detail-value {
    color: $text-color;

    &--online {
      color: var(--color-success-highlight);
    }

    &--warning {
      color: var(--color-warning-highlight);
    }

    &--offline {
      color: var(--color-error-highlight);
    }
  }

  .detail-logs {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--background-40);

    h4 {
      margin: 0 0 0.75rem 0;
      color: $text-color;
      font-weight: 400;
      font-size: 0.95rem;
    }
  }

  .log-entry {
    display: flex;
    gap: 1rem;
    padding: 0.5rem;
    font-size: 0.8rem;
    background-color: var(--background-ui);
    border-radius: 0.25rem;
    margin-bottom: 0.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .log-time {
    min-width: 60px;
    color: $text-color-50;
  }

  .log-message {
    color: $text-color-70;
  }

  .modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--background-40);
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;

    @include mobile-only {
      padding: 1rem;
      flex-direction: column-reverse;
    }
  }

  .action-btn {
    padding: 0.5rem 1rem;
    border: 1px solid var(--highlight-color);
    background-color: var(--highlight-color);
    color: $white;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s;

    &:hover {
      background-color: var(--color-green-90);
      border-color: var(--color-green-90);
    }

    &--secondary {
      background-color: transparent;
      color: $text-color;
      border-color: var(--background-40);

      &:hover {
        background-color: var(--background-ui);
      }
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

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }
</style>
