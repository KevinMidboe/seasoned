<template>
  <div class="data-export">
    <div class="export-options">
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

      <div class="export-card export-card--danger">
        <div class="export-header">
          <h4>Delete Account</h4>
          <p>
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>
        </div>

        <button class="delete-btn" @click="confirmDelete">
          Delete My Account
        </button>
      </div>
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
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import IconActivity from "@/icons/IconActivity.vue";
  import IconClose from "@/icons/IconClose.vue";

  const router = useRouter();

  const exporting = ref(false);
  const showDeleteModal = ref(false);
  const deleteConfirmation = ref("");

  const requestStats = ref({
    total: 45,
    approved: 38,
    pending: 7
  });

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
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

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

    &--danger {
      border-left-color: var(--color-error-highlight);
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

  .delete-btn {
    width: 100%;
    padding: 0.55rem 0.85rem;
    background-color: var(--color-error-highlight);
    color: $white;
    border: none;
    border-radius: 0.25rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: var(--color-error);
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
