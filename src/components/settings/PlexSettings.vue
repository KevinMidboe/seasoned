<template>
  <div class="plex-settings">
    <div v-if="!plexUserId" class="plex-connect">
      <div class="info-box">
        <IconInfo class="info-icon" />
        <p>
          Sign in to your Plex account to get information about recently added
          movies and to see your watch history
        </p>
      </div>

      <div class="signin-container">
        <button
          @click="authenticatePlex"
          :disabled="loading"
          class="plex-signin-btn"
        >
          <svg
            v-if="!loading"
            width="20"
            height="20"
            viewBox="0 0 256 256"
            fill="currentColor"
          >
            <path
              d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zm57.7 128.7l-48 48c-.4.4-.9.7-1.4.9-.5.2-1.1.4-1.6.4s-1.1-.1-1.6-.4c-.5-.2-1-.5-1.4-.9l-48-48c-1.6-1.6-1.6-4.1 0-5.7 1.6-1.6 4.1-1.6 5.7 0l41.1 41.1V80c0-2.2 1.8-4 4-4s4 1.8 4 4v84.1l41.1-41.1c1.6-1.6 4.1-1.6 5.7 0 .8.8 1.2 1.8 1.2 2.8s-.4 2.1-1.2 2.9z"
            />
          </svg>
          {{ loading ? "Connecting..." : "Sign in with Plex" }}
        </button>
        <p class="popup-note">A popup window will open for authentication</p>
      </div>
    </div>

    <div v-else class="plex-connected">
      <div class="success-box">
        <div class="success-icon">✓</div>
        <div class="success-content">
          <h4>Plex Account Connected</h4>
          <p>
            Your account is authenticated with Plex. Enjoy viewing your watch
            history and real-time torrent download progress.
          </p>
        </div>
      </div>

      <div class="plex-details">
        <div class="detail-row">
          <span class="detail-label">Server</span>
          <span class="detail-value">{{ plexServer }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Library Count</span>
          <span class="detail-value">{{ libraryCount }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Last Sync</span>
          <span class="detail-value">{{ lastSync }}</span>
        </div>
      </div>

      <div class="plex-actions">
        <seasoned-button @click="syncLibrary" :disabled="syncing">
          {{ syncing ? "Syncing..." : "Sync Library" }}
        </seasoned-button>
        <seasoned-button @click="confirmUnlink">
          Unlink Account
        </seasoned-button>
      </div>
    </div>

    <seasoned-messages v-model:messages="messages" />

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="modal-overlay" @click="cancelUnlink">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Unlink Plex Account</h3>
          <button class="close-btn" @click="cancelUnlink">
            <IconClose />
          </button>
        </div>
        <div class="modal-body">
          <p>
            Are you sure you want to unlink your Plex account? You will lose
            access to:
          </p>
          <ul>
            <li>Watch history tracking</li>
            <li>Recently added content notifications</li>
            <li>Real-time download progress</li>
          </ul>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="cancelUnlink">Cancel</button>
          <button class="confirm-btn" @click="unauthenticatePlex">
            Unlink Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from "vue";
  import { useStore } from "vuex";
  import SeasonedButton from "@/components/ui/SeasonedButton.vue";
  import SeasonedMessages from "@/components/ui/SeasonedMessages.vue";
  import IconInfo from "@/icons/IconInfo.vue";
  import IconClose from "@/icons/IconClose.vue";
  import type { Ref, ComputedRef } from "vue";
  import { linkPlexAccount, unlinkPlexAccount } from "../../api";
  import { ErrorMessageTypes } from "../../interfaces/IErrorMessage";
  import type { IErrorMessage } from "../../interfaces/IErrorMessage";

  interface Emit {
    (e: "reload");
  }

  const CLIENT_IDENTIFIER =
    "seasoned-plex-app-" + Math.random().toString(36).substring(7);
  const APP_NAME = "Seasoned";

  const messages: Ref<IErrorMessage[]> = ref([]);
  const loading = ref(false);
  const syncing = ref(false);
  const showConfirmModal = ref(false);
  const plexPopup = ref<Window | null>(null);
  const pollInterval = ref<number | null>(null);
  const currentPinId = ref<number | null>(null);

  // Mock data
  const plexServer = ref("Home Media Server");
  const libraryCount = ref("4 Libraries");
  const lastSync = ref("2 minutes ago");

  const store = useStore();
  const emit = defineEmits<Emit>();

  const plexUserId: ComputedRef<boolean> = computed(
    () => store.getters["user/plexUserId"]
  );

  // Generate a PIN for Plex OAuth
  async function generatePlexPin() {
    try {
      const response = await fetch("https://plex.tv/api/v2/pins?strong=true", {
        method: "POST",
        headers: {
          accept: "application/json",
          "X-Plex-Product": APP_NAME,
          "X-Plex-Client-Identifier": CLIENT_IDENTIFIER
        }
      });

      if (!response.ok) {
        throw new Error("Failed to generate PIN");
      }

      const data = await response.json();
      return { id: data.id, code: data.code };
    } catch (error) {
      console.error("Error generating Plex PIN:", error);
      return null;
    }
  }

  // Check PIN status to get auth token
  async function checkPin(pinId: number, pinCode: string) {
    try {
      const response = await fetch(
        `https://plex.tv/api/v2/pins/${pinId}?code=${pinCode}`,
        {
          headers: {
            accept: "application/json",
            "X-Plex-Client-Identifier": CLIENT_IDENTIFIER
          }
        }
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.authToken;
    } catch (error) {
      console.error("Error checking PIN:", error);
      return null;
    }
  }

  // Construct Plex Auth URL
  function constructAuthUrl(pinCode: string) {
    const params = new URLSearchParams({
      clientID: CLIENT_IDENTIFIER,
      code: pinCode,
      "context[device][product]": APP_NAME
    });

    return `https://app.plex.tv/auth#?${params.toString()}`;
  }

  // Start polling for PIN claim
  function startPolling(pinId: number, pinCode: string) {
    pollInterval.value = window.setInterval(async () => {
      const authToken = await checkPin(pinId, pinCode);

      if (authToken) {
        stopPolling();
        if (plexPopup.value && !plexPopup.value.closed) {
          plexPopup.value.close();
        }

        // Send token to backend
        await completePlexAuth(authToken);
      }
    }, 1000); // Poll every second
  }

  // Stop polling
  function stopPolling() {
    if (pollInterval.value) {
      clearInterval(pollInterval.value);
      pollInterval.value = null;
    }
  }

  // Complete authentication with backend
  async function completePlexAuth(authToken: string) {
    try {
      const { success, message } = await linkPlexAccount(authToken);

      if (success) {
        emit("reload");
        messages.value.push({
          type: ErrorMessageTypes.Success,
          title: "Authenticated with Plex",
          message: message || "Successfully connected your Plex account"
        } as IErrorMessage);
      } else {
        messages.value.push({
          type: ErrorMessageTypes.Error,
          title: "Authentication failed",
          message: message || "Could not connect to Plex"
        } as IErrorMessage);
      }
    } catch (error) {
      messages.value.push({
        type: ErrorMessageTypes.Error,
        title: "Authentication failed",
        message: "An error occurred while connecting to Plex"
      } as IErrorMessage);
    } finally {
      loading.value = false;
    }
  }

  // Main authentication function
  async function authenticatePlex() {
    loading.value = true;

    // Open popup immediately (Safari compatibility - must be synchronous with user click)
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    // Open with a loading page first
    plexPopup.value = window.open(
      "about:blank",
      "PlexAuth",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Check if popup was blocked
    if (!plexPopup.value) {
      messages.value.push({
        type: ErrorMessageTypes.Error,
        title: "Popup blocked",
        message: "Please allow popups for this site to authenticate with Plex"
      } as IErrorMessage);
      loading.value = false;
      return;
    }

    // Add a loading message to the popup
    if (plexPopup.value.document) {
      plexPopup.value.document.write(`
        <html>
          <head>
            <title>Connecting to Plex...</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                background: #1c3a13;
                color: #fcfcf7;
              }
              .loader {
                text-align: center;
              }
              .spinner {
                border: 4px solid rgba(252, 252, 247, 0.3);
                border-top: 4px solid #fcfcf7;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            </style>
          </head>
          <body>
            <div class="loader">
              <div class="spinner"></div>
              <p>Connecting to Plex...</p>
            </div>
          </body>
        </html>
      `);
    }

    // Generate PIN
    const pin = await generatePlexPin();
    if (!pin) {
      if (plexPopup.value && !plexPopup.value.closed) {
        plexPopup.value.close();
      }
      messages.value.push({
        type: ErrorMessageTypes.Error,
        title: "Connection failed",
        message: "Could not generate Plex authentication PIN"
      } as IErrorMessage);
      loading.value = false;
      return;
    }

    currentPinId.value = pin.id;
    const authUrl = constructAuthUrl(pin.code);

    // Navigate the already-open popup to the auth URL
    if (plexPopup.value && !plexPopup.value.closed) {
      plexPopup.value.location.href = authUrl;
    } else {
      // Popup was closed before we could navigate
      messages.value.push({
        type: ErrorMessageTypes.Warning,
        title: "Authentication cancelled",
        message: "Authentication window was closed"
      } as IErrorMessage);
      loading.value = false;
      return;
    }

    // Start polling for authentication
    startPolling(pin.id, pin.code);

    // Check if popup was closed manually
    const popupChecker = setInterval(() => {
      if (plexPopup.value && plexPopup.value.closed) {
        clearInterval(popupChecker);
        stopPolling();
        if (loading.value) {
          loading.value = false;
          messages.value.push({
            type: ErrorMessageTypes.Warning,
            title: "Authentication cancelled",
            message: "Plex authentication window was closed"
          } as IErrorMessage);
        }
      }
    }, 500);
  }

  function confirmUnlink() {
    showConfirmModal.value = true;
  }

  function cancelUnlink() {
    showConfirmModal.value = false;
  }

  async function unauthenticatePlex() {
    showConfirmModal.value = false;
    loading.value = true;

    const response = await unlinkPlexAccount();

    if (response?.success) {
      emit("reload");
    }

    messages.value.push({
      type: response.success
        ? ErrorMessageTypes.Success
        : ErrorMessageTypes.Error,
      title: response.success
        ? "Unlinked Plex account"
        : "Something went wrong",
      message: response.message
    } as IErrorMessage);

    loading.value = false;
  }

  async function syncLibrary() {
    syncing.value = true;

    // Mock sync
    await new Promise(resolve => setTimeout(resolve, 2000));

    lastSync.value = "Just now";

    messages.value.push({
      type: ErrorMessageTypes.Success,
      title: "Library synced",
      message: "Your Plex library has been successfully synced"
    } as IErrorMessage);

    syncing.value = false;
  }

  // Cleanup on unmount
  onUnmounted(() => {
    stopPolling();
    if (plexPopup.value && !plexPopup.value.closed) {
      plexPopup.value.close();
    }
  });
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .signin-container {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .plex-signin-btn {
    padding: 0.7rem 1.2rem;
    background-color: #c87818;
    color: $white;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.55rem;
    align-self: flex-start;
    box-shadow: 0 2px 6px rgba(200, 120, 24, 0.12);

    @include mobile-only {
      width: 100%;
      padding: 0.65rem 1.1rem;
    }

    &:hover:not(:disabled) {
      background-color: #b36a15;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(200, 120, 24, 0.3);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 6px rgba(200, 120, 24, 0.18);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    svg {
      flex-shrink: 0;
      width: 18px;
      height: 18px;
    }
  }

  .popup-note {
    margin: 0;
    font-size: 0.75rem;
    opacity: 0.6;
  }

  .info-box {
    display: flex;
    gap: 0.65rem;
    padding: 0.65rem;
    background-color: var(--background-ui);
    border-radius: 0.25rem;
    margin-bottom: 0.85rem;
    border-left: 3px solid var(--highlight-color);

    @include mobile-only {
      padding: 0.6rem;
      gap: 0.55rem;
      margin-bottom: 0.7rem;
    }

    p {
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.4;

      @include mobile-only {
        font-size: 0.85rem;
      }
    }
  }

  .info-icon {
    width: 20px;
    height: 20px;
    fill: var(--highlight-color);
    flex-shrink: 0;

    @include mobile-only {
      width: 18px;
      height: 18px;
    }
  }

  .plex-form {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .success-box {
    display: flex;
    gap: 0.65rem;
    padding: 0.65rem;
    background-color: var(--color-success);
    border-radius: 0.25rem;
    margin-bottom: 0.85rem;

    @include mobile-only {
      padding: 0.6rem;
      gap: 0.55rem;
      margin-bottom: 0.7rem;
    }
  }

  .success-icon {
    width: 28px;
    height: 28px;
    background-color: var(--color-success-highlight);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $white;
    font-size: 1.1rem;
    font-weight: bold;
    flex-shrink: 0;

    @include mobile-only {
      width: 26px;
      height: 26px;
      font-size: 1rem;
    }
  }

  .success-content {
    h4 {
      margin: 0 0 0.25rem 0;
      color: $white;
      font-weight: 500;
      font-size: 1rem;

      @include mobile-only {
        font-size: 0.95rem;
      }
    }

    p {
      margin: 0;
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.85rem;

      @include mobile-only {
        font-size: 0.8rem;
      }
    }
  }

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

    @include mobile-only {
      font-size: 0.8rem;
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
      margin: 0;
      padding-left: 1.5rem;

      @include mobile-only {
        font-size: 0.85rem;
      }
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

  .confirm-btn {
    background-color: var(--color-error-highlight);
    color: $white;

    &:hover {
      background-color: var(--color-error);
    }
  }
</style>
