<template>
  <div class="data-export">
    <!-- Info Header -->
    <div class="data-export__header">
      <div class="data-export__info">
        <IconInfo class="info-icon" />
        <span>
          Full transparency and control over your data. Everything is stored
          locally on your device—no servers, no tracking. You own your data.
        </span>
      </div>
    </div>

    <div class="export-options">
      <!-- Export Data Card -->
      <div class="export-card">
        <div class="export-header">
          <h4>Export Your Data</h4>
          <p>
            Download a copy of your account data including requests, watch
            history, and preferences.
          </p>
        </div>

        <div class="export-actions">
          <button
            class="export-btn"
            @click="exportData('json')"
            :disabled="exporting"
          >
            <IconActivity v-if="exporting" class="spin" />
            <span v-else>Export as JSON</span>
          </button>
          <button
            class="export-btn"
            @click="exportData('csv')"
            :disabled="exporting"
          >
            <IconActivity v-if="exporting" class="spin" />
            <span v-else>Export as CSV</span>
          </button>
        </div>
      </div>

      <!-- Request History Card -->
      <div class="export-card">
        <div class="export-header">
          <h4>Request History</h4>
          <p>View and download your complete request history.</p>
        </div>

        <div class="stats-grid">
          <div class="stat-mini">
            <span class="stat-mini__value">{{ requestStats.total }}</span>
            <span class="stat-mini__label">Total</span>
          </div>
          <div class="stat-mini">
            <span class="stat-mini__value">{{ requestStats.approved }}</span>
            <span class="stat-mini__label">Approved</span>
          </div>
          <div class="stat-mini">
            <span class="stat-mini__value">{{ requestStats.pending }}</span>
            <span class="stat-mini__label">Pending</span>
          </div>
        </div>

        <button class="view-btn" @click="viewHistory">View Full History</button>
      </div>

      <!-- Local Storage Items -->
      <div class="storage-section">
        <h4 class="storage-section__title">Browser Storage</h4>
        <div class="storage-items">
          <div
            v-for="item in storageItems"
            :key="item.key"
            class="storage-item"
          >
            <div class="storage-item__info">
              <h5 class="storage-item__title">{{ item.title }}</h5>
              <p class="storage-item__description">
                {{ item.description }} ·
                <span class="storage-item__size">{{ item.size }}</span>
              </p>
            </div>
            <button
              class="storage-item__delete"
              @click="clearItem(item.key, item.title)"
              :title="`Clear ${item.title}`"
            >
              <IconClose />
            </button>
          </div>
        </div>
      </div>

      <!-- Clear All Local Data -->
      <DangerZoneAction
        title="Clear All Local Data"
        description="Remove all locally stored data at once. This includes preferences, history, and cached information."
        button-text="Clear All Data"
        @action="clearAllData"
      />

      <!-- Delete Account -->
      <DangerZoneAction
        title="Delete Account"
        description="Permanently delete your account and all associated data. This action cannot be undone."
        button-text="Delete My Account"
        @action="confirmDelete"
      />
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Delete Account</h3>
          <button class="close-btn" @click="cancelDelete">
            <IconClose />
          </button>
        </div>
        <div class="modal-body">
          <div class="warning-box">
            <span class="warning-icon">⚠️</span>
            <p>
              <strong>Warning:</strong> This action is permanent and cannot be
              undone.
            </p>
          </div>
          <p>All of the following will be permanently deleted:</p>
          <ul>
            <li>Your account and profile information</li>
            <li>All request history</li>
            <li>Watch history and preferences</li>
            <li>Plex account connection</li>
          </ul>
          <p>Type <strong>DELETE</strong> to confirm:</p>
          <input
            v-model="deleteConfirmation"
            type="text"
            placeholder="Type DELETE"
            class="confirm-input"
          />
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="cancelDelete">Cancel</button>
          <button
            class="confirm-delete-btn"
            @click="deleteAccount"
            :disabled="deleteConfirmation !== 'DELETE'"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, inject } from "vue";
  import { useRouter } from "vue-router";
  import { clearCommandHistory } from "@/utils/commandTracking";
  import IconActivity from "@/icons/IconActivity.vue";
  import IconClose from "@/icons/IconClose.vue";
  import IconInfo from "@/icons/IconInfo.vue";
  import DangerZoneAction from "./DangerZoneAction.vue";

  interface StorageItem {
    key: string;
    title: string;
    description: string;
    size: string;
  }

  const router = useRouter();

  const notifications: {
    success: (options: {
      title: string;
      description?: string;
      timeout?: number;
    }) => void;
    error: (options: {
      title: string;
      description?: string;
      timeout?: number;
    }) => void;
  } = inject("notifications");

  const exporting = ref(false);
  const showDeleteModal = ref(false);
  const deleteConfirmation = ref("");

  const requestStats = ref({
    total: 45,
    approved: 38,
    pending: 7
  });

  const storageItems = computed<StorageItem[]>(() => {
    const items: StorageItem[] = [];

    // Command palette stats
    const commandStats = localStorage.getItem("commandPalette_stats");
    if (commandStats) {
      items.push({
        key: "commandPalette_stats",
        title: "Command Palette History",
        description: "Usage statistics for command palette navigation",
        size: formatBytes(commandStats.length)
      });
    }

    // Plex user data
    const plexData = localStorage.getItem("plex_user_data");
    if (plexData) {
      items.push({
        key: "plex_user_data",
        title: "Plex User Data",
        description: "Cached Plex account information",
        size: formatBytes(plexData.length)
      });
    }

    // Theme preference
    const theme = localStorage.getItem("theme");
    if (theme) {
      items.push({
        key: "theme",
        title: "Theme Preference",
        description: "Your selected color theme",
        size: formatBytes(theme.length)
      });
    }

    // Color scheme
    const colorScheme = localStorage.getItem("color-scheme");
    if (colorScheme) {
      items.push({
        key: "color-scheme",
        title: "Color Scheme",
        description: "Light or dark mode preference",
        size: formatBytes(colorScheme.length)
      });
    }

    return items;
  });

  function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }

  async function exportData(format: "json" | "csv") {
    exporting.value = true;

    // Mock export
    await new Promise(resolve => setTimeout(resolve, 1500));

    const data = {
      username: "user123",
      requests: requestStats.value,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob(
      [format === "json" ? JSON.stringify(data, null, 2) : convertToCSV(data)],
      { type: format === "json" ? "application/json" : "text/csv" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `seasoned-data-export.${format}`;
    link.click();
    URL.revokeObjectURL(url);

    exporting.value = false;
  }

  function convertToCSV(data: any): string {
    return `Username,Total Requests,Approved,Pending,Export Date\n${data.username},${data.requests.total},${data.requests.approved},${data.requests.pending},${data.exportDate}`;
  }

  function viewHistory() {
    router.push({ name: "profile" });
  }

  function confirmDelete() {
    showDeleteModal.value = true;
    deleteConfirmation.value = "";
  }

  function cancelDelete() {
    showDeleteModal.value = false;
    deleteConfirmation.value = "";
  }

  function deleteAccount() {
    if (deleteConfirmation.value === "DELETE") {
      alert("Account deletion would be processed here");
      showDeleteModal.value = false;
    }
  }

  function clearItem(key: string, title: string) {
    try {
      // Special handling for command history
      if (key === "commandPalette_stats") {
        clearCommandHistory();
      } else {
        localStorage.removeItem(key);
      }

      notifications.success({
        title: "Data Cleared",
        description: `${title} has been cleared`,
        timeout: 3000
      });

      // Force re-render
      storageItems.value;
    } catch (error) {
      notifications.error({
        title: "Error",
        description: `Failed to clear ${title}`,
        timeout: 5000
      });
    }
  }

  function clearAllData() {
    const confirmed = confirm(
      "Are you sure you want to clear all locally stored data? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      localStorage.clear();
      clearCommandHistory();

      notifications.success({
        title: "All Data Cleared",
        description: "All locally stored data has been removed",
        timeout: 3000
      });
    } catch (error) {
      notifications.error({
        title: "Error",
        description: "Failed to clear all data",
        timeout: 5000
      });
    }
  }
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .data-export {
    &__header {
      margin-bottom: 1rem;

      @include mobile-only {
        margin-bottom: 0.85rem;
      }
    }

    &__info {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 0.75rem;
      background: var(--background-ui);
      border-radius: 0.375rem;
      border-left: 3px solid var(--highlight-color);

      .info-icon {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        fill: var(--highlight-color);
        margin-top: 2px;
      }

      span {
        font-size: 0.85rem;
        color: var(--text-color-70);
        line-height: 1.5;
      }
    }
  }

  .export-options {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .export-card {
    padding: 0.85rem;
    background-color: var(--background-ui);
    border-radius: 0.25rem;
    border-left: 3px solid var(--highlight-color);

    @include mobile-only {
      padding: 0.75rem;
    }
  }

  .export-header {
    margin-bottom: 0.85rem;

    @include mobile-only {
      margin-bottom: 0.7rem;
    }

    h4 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
      font-weight: 500;

      @include mobile-only {
        font-size: 0.95rem;
      }
    }

    p {
      margin: 0;
      font-size: 0.85rem;

      @include mobile-only {
        font-size: 0.8rem;
      }
    }
  }

  .export-actions {
    display: flex;
    gap: 0.55rem;

    @include mobile-only {
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  .export-btn {
    flex: 1;
    padding: 0.55rem 0.85rem;
    background-color: var(--highlight-color);
    color: $white;
    border: none;
    border-radius: 0.25rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;

    &:hover:not(:disabled) {
      background-color: var(--color-green-90);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    svg {
      width: 16px;
      height: 16px;
      fill: $white;

      &.spin {
        animation: spin 1s linear infinite;
      }
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    margin-bottom: 0.65rem;
  }

  .stat-mini {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem 0.4rem;
    background-color: var(--background-color);
    border-radius: 0.25rem;

    @include mobile-only {
      padding: 0.45rem 0.35rem;
    }

    &__value {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--highlight-color);

      @include mobile-only {
        font-size: 1.1rem;
      }
    }

    &__label {
      font-size: 0.7rem;
      text-transform: uppercase;
      margin-top: 0.15rem;

      @include mobile-only {
        font-size: 0.65rem;
      }
    }
  }

  .view-btn {
    width: 100%;
    padding: 0.55rem 0.85rem;
    background-color: var(--background-color);
    border: 1px solid var(--background-40);
    border-radius: 0.25rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: var(--background-40);
      border-color: var(--highlight-color);
    }
  }

  .storage-section {
    &__title {
      margin: 0 0 0.65rem 0;
      font-size: 1rem;
      font-weight: 500;
      color: var(--text-color);

      @include mobile-only {
        font-size: 0.95rem;
        margin-bottom: 0.6rem;
      }
    }
  }

  .storage-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .storage-item {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: 0;
    background: var(--background-color);
    border-radius: 0.25rem;
    overflow: hidden;
    transition: all 0.2s ease;

    &:hover {
      .storage-item__delete {
        background: var(--color-error-highlight);
      }
    }

    &__info {
      flex: 1;
      min-width: 0;
      padding: 0.85rem;

      @include mobile-only {
        padding: 0.75rem;
      }
    }

    &__title {
      margin: 0 0 0.25rem 0;
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-color);

      @include mobile-only {
        font-size: 0.9rem;
      }
    }

    &__description {
      margin: 0;
      font-size: 0.8rem;
      color: var(--text-color-70);
      line-height: 1.4;

      @include mobile-only {
        font-size: 0.75rem;
      }
    }

    &__size {
      color: var(--text-color-50);
      font-family: monospace;
    }

    &__delete {
      flex-shrink: 0;
      width: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-error);
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;

      @include mobile-only {
        width: 60px;
      }

      svg {
        width: 20px;
        height: 20px;
        fill: white;
        transition: transform 0.2s ease;

        @include mobile-only {
          width: 18px;
          height: 18px;
        }
      }

      &:hover {
        background: var(--color-error-highlight);

        svg {
          transform: scale(1.1);
        }
      }

      &:active {
        svg {
          transform: scale(0.9);
        }
      }
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
    max-width: 500px;
    width: 100%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);

    @include mobile-only {
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
    }
  }

  .modal-body {
    padding: 1.5rem;

    @include mobile-only {
      padding: 1rem;
    }

    p {
      margin: 0 0 1rem 0;

      @include mobile-only {
        font-size: 0.9rem;
      }
    }

    ul {
      margin: 0 0 1.5rem 0;
      padding-left: 1.5rem;

      @include mobile-only {
        font-size: 0.85rem;
      }
    }
  }

  .warning-box {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background-color: var(--color-warning);
    border-radius: 0.5rem;
    margin-bottom: 1rem;

    @include mobile-only {
      padding: 0.75rem;
    }

    .warning-icon {
      font-size: 1.5rem;
    }

    p {
      margin: 0;
      color: $black;
      font-size: 0.9rem;

      @include mobile-only {
        font-size: 0.85rem;
      }
    }
  }

  .confirm-input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid var(--background-40);
    border-radius: 0.25rem;
    background-color: var(--background-color);
    font-size: 0.9rem;

    &:focus {
      outline: none;
      border-color: var(--color-error-highlight);
    }
  }

  .modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--background-40);
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;

    @include mobile-only {
      padding: 1rem;
      flex-direction: column-reverse;
    }

    button {
      padding: 0.65rem 1.25rem;
      border-radius: 0.25rem;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }
  }

  .cancel-btn {
    background-color: transparent;
    border: 1px solid var(--background-40) !important;

    &:hover {
      background-color: var(--background-ui);
    }
  }

  .confirm-delete-btn {
    background-color: var(--color-error-highlight);
    color: $white;

    &:hover:not(:disabled) {
      background-color: var(--color-error);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
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
