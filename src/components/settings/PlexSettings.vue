<template>
  <div class="plex-settings">
    <!-- Unconnected state -->
    <PlexAuthButton
      v-if="!isPlexConnected"
      :loading="loading"
      @authenticate="authenticatePlex"
    />

    <!-- Connected state -->
    <div v-else class="plex-connected">
      <PlexProfileCard
        v-if="plexUsername"
        :username="plexUsername"
        :userData="plexUserData"
      />

      <PlexLibraryStats
        :stats="libraryStats"
        :loading="loadingLibraries"
        @open-library="showLibraryDetails"
      />

      <PlexServerInfo
        :serverName="plexServer"
        :lastSync="lastSync"
        :syncing="syncing"
        @sync="syncLibrary"
        @unlink="confirmUnlink"
      />
    </div>

    <!-- Messages -->
    <SeasonedMessages v-model:messages="messages" />

    <!-- Unlink Confirmation Modal -->
    <PlexUnlinkModal
      v-if="showConfirmModal"
      @confirm="unauthenticatePlex"
      @cancel="cancelUnlink"
    />

    <!-- Library Details Modal -->
    <PlexLibraryModal
      v-if="showLibraryModal && selectedLibrary"
      :libraryType="selectedLibrary"
      :details="libraryDetails[selectedLibrary]"
      @close="closeLibraryModal"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from "vue";
  import { useStore } from "vuex";
  import SeasonedMessages from "@/components/ui/SeasonedMessages.vue";
  import PlexAuthButton from "@/components/plex/PlexAuthButton.vue";
  import PlexProfileCard from "@/components/plex/PlexProfileCard.vue";
  import PlexLibraryStats from "@/components/plex/PlexLibraryStats.vue";
  import PlexServerInfo from "@/components/plex/PlexServerInfo.vue";
  import PlexUnlinkModal from "@/components/plex/PlexUnlinkModal.vue";
  import PlexLibraryModal from "@/components/plex/PlexLibraryModal.vue";
  import { usePlexAuth } from "@/composables/usePlexAuth";
  import { usePlexApi } from "@/composables/usePlexApi";
  import { usePlexLibraries } from "@/composables/usePlexLibraries";
  import type { Ref } from "vue";
  import { linkPlexAccount, unlinkPlexAccount } from "../../api";
  import { ErrorMessageTypes } from "../../interfaces/IErrorMessage";
  import type { IErrorMessage } from "../../interfaces/IErrorMessage";

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
  const plexUsername = ref<string>("");
  const plexUserData = ref<any>(null);
  const isPlexConnected = ref<boolean>(false);
  const hasLocalStorageData = ref<boolean>(false);
  const hasCookieData = ref<boolean>(false);
  const showLibraryModal = ref<boolean>(false);
  const selectedLibrary = ref<string>("");
  const loadingLibraries = ref<boolean>(false);

  const plexServer = ref("");
  const plexServerUrl = ref("");
  const lastSync = ref("");
  const libraryStats = ref({
    movies: 0,
    shows: 0,
    music: 0,
    watchtime: 0
  });
  const libraryDetails = ref<any>({
    movies: {
      total: 0,
      recentlyAdded: [],
      genres: [],
      totalDuration: "0 hours"
    },
    shows: {
      total: 0,
      recentlyAdded: [],
      genres: [],
      totalEpisodes: 0,
      totalDuration: "0 hours"
    },
    music: {
      total: 0,
      recentlyAdded: [],
      genres: [],
      totalTracks: 0
    }
  });

  const store = useStore();
  const emit = defineEmits<{
    (e: "reload"): void;
  }>();

  // Composables
  const { getCookie, setPlexAuthCookie } = usePlexAuth(
    CLIENT_IDENTIFIER,
    APP_NAME
  );
  const {
    fetchPlexUserData,
    fetchPlexServers,
    fetchLibrarySections,
    fetchLibraryDetails
  } = usePlexApi(CLIENT_IDENTIFIER, APP_NAME);
  const { loadLibraries } = usePlexLibraries();

  // ----- Connection check -----
  function checkPlexConnection() {
    const cachedData = localStorage.getItem("plex_user_data");
    const authToken = getCookie("plex_auth_token");
    const storeHasPlexUserId = store.getters["user/plexUserId"];
    hasLocalStorageData.value = !!cachedData;
    hasCookieData.value = !!authToken;
    isPlexConnected.value = !!(cachedData || authToken || storeHasPlexUserId);
    return isPlexConnected.value;
  }

  // ----- Library loading -----
  async function fetchPlexLibraries(authToken: string) {
    try {
      loadingLibraries.value = true;
      const server = await fetchPlexServers(authToken);
      if (!server) {
        console.error("No Plex server found");
        return;
      }

      plexServer.value = server.name;
      plexServerUrl.value = server.url;
      lastSync.value = new Date().toLocaleString();

      const sections = await fetchLibrarySections(authToken, server.url);
      if (!sections || sections.length === 0) {
        console.error("No library sections found");
        return;
      }

      const result = await loadLibraries(
        sections,
        authToken,
        server.url,
        plexUsername.value,
        fetchLibraryDetails
      );

      libraryStats.value = result.stats;
      libraryDetails.value = result.details;
    } catch (error) {
      console.error("[PlexSettings] Error fetching Plex libraries:", error);
    } finally {
      loadingLibraries.value = false;
    }
  }

  // ----- User data loading -----
  async function loadPlexUserData() {
    checkPlexConnection();
    const cachedData = localStorage.getItem("plex_user_data");
    hasLocalStorageData.value = !!cachedData;
    if (cachedData) {
      try {
        plexUserData.value = JSON.parse(cachedData);
        plexUsername.value = plexUserData.value.username;
        isPlexConnected.value = true;
      } catch (error) {
        console.error("[PlexSettings] Error parsing cached Plex data:", error);
      }
    }
    const authToken = getCookie("plex_auth_token");
    hasCookieData.value = !!authToken;
    if (authToken) {
      const userData = await fetchPlexUserData(authToken);
      if (userData) {
        plexUserData.value = userData;
        plexUsername.value = userData.username;
        isPlexConnected.value = true;
      } else if (!cachedData) {
        isPlexConnected.value = false;
      }
      if (isPlexConnected.value) {
        await fetchPlexLibraries(authToken);
      }
    } else {
      isPlexConnected.value = false;
    }
  }

  // ----- OAuth flow -----
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
      if (!response.ok) throw new Error("Failed to generate PIN");
      return response.json();
    } catch (error) {
      console.error("Error generating Plex PIN:", error);
      return null;
    }
  }

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
      if (!response.ok) return null;
      const data = await response.json();
      return data.authToken;
    } catch (error) {
      console.error("Error checking PIN:", error);
      return null;
    }
  }

  function constructAuthUrl(pinCode: string) {
    const params = new URLSearchParams({
      clientID: CLIENT_IDENTIFIER,
      code: pinCode,
      "context[device][product]": APP_NAME
    });
    return `https://app.plex.tv/auth#?${params.toString()}`;
  }

  function startPolling(pinId: number, pinCode: string) {
    pollInterval.value = window.setInterval(async () => {
      const authToken = await checkPin(pinId, pinCode);
      if (authToken) {
        stopPolling();
        if (plexPopup.value && !plexPopup.value.closed) plexPopup.value.close();
        await completePlexAuth(authToken);
      }
    }, 1000);
  }

  function stopPolling() {
    if (pollInterval.value) {
      clearInterval(pollInterval.value);
      pollInterval.value = null;
    }
  }

  async function completePlexAuth(authToken: string) {
    try {
      setPlexAuthCookie(authToken);
      const userData = await fetchPlexUserData(authToken);
      if (userData) {
        plexUserData.value = userData;
        plexUsername.value = userData.username;
        isPlexConnected.value = true;
      }
      const { success, message } = await linkPlexAccount(authToken);
      if (success) {
        emit("reload");
        await fetchPlexLibraries(authToken);
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

  async function authenticatePlex() {
    loading.value = true;
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    plexPopup.value = window.open(
      "about:blank",
      "PlexAuth",
      `width=${width},height=${height},left=${left},top=${top}`
    );
    if (!plexPopup.value) {
      messages.value.push({
        type: ErrorMessageTypes.Error,
        title: "Popup blocked",
        message: "Please allow popups for this site to authenticate with Plex"
      } as IErrorMessage);
      loading.value = false;
      return;
    }
    if (plexPopup.value.document) {
      plexPopup.value.document.write(`
      <html>
        <head>
          <title>Connecting to Plex...</title>
          <style>
            body{margin:0;padding:0;display:flex;justify-content:center;align-items:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#1c3a13;color:#fcfcf7;}
            .loader{text-align:center;}
            .spinner{border:4px solid rgba(252,252,247,0.3);border-top:4px solid #fcfcf7;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;margin:0 auto 20px;}
            @keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
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
    const pin = await generatePlexPin();
    if (!pin) {
      if (plexPopup.value && !plexPopup.value.closed) plexPopup.value.close();
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
    if (plexPopup.value && !plexPopup.value.closed)
      plexPopup.value.location.href = authUrl;
    else {
      messages.value.push({
        type: ErrorMessageTypes.Warning,
        title: "Authentication cancelled",
        message: "Authentication window was closed"
      } as IErrorMessage);
      loading.value = false;
      return;
    }
    startPolling(pin.id, pin.code);
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

  // ----- Unlink flow -----
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
      localStorage.removeItem("plex_user_data");
      document.cookie =
        "plex_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict";
      plexUserData.value = null;
      plexUsername.value = "";
      isPlexConnected.value = false;
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

  // ----- Library modal -----
  function showLibraryDetails(type: string) {
    selectedLibrary.value = type;
    showLibraryModal.value = true;
  }
  function closeLibraryModal() {
    showLibraryModal.value = false;
    selectedLibrary.value = "";
  }

  // ----- Sync -----
  async function syncLibrary() {
    syncing.value = true;
    const authToken = getCookie("plex_auth_token");
    if (!authToken) {
      messages.value.push({
        type: ErrorMessageTypes.Error,
        title: "Sync failed",
        message: "No authentication token found"
      } as IErrorMessage);
      syncing.value = false;
      return;
    }
    try {
      await fetchPlexLibraries(authToken);
      messages.value.push({
        type: ErrorMessageTypes.Success,
        title: "Library synced",
        message: "Your Plex library has been successfully synced"
      } as IErrorMessage);
    } catch (error) {
      messages.value.push({
        type: ErrorMessageTypes.Error,
        title: "Sync failed",
        message: "An error occurred while syncing your library"
      } as IErrorMessage);
    } finally {
      syncing.value = false;
    }
  }

  onMounted(() => {
    checkPlexConnection();
    loadPlexUserData();
  });
  onUnmounted(() => {
    stopPolling();
    if (plexPopup.value && !plexPopup.value.closed) plexPopup.value.close();
  });
</script>

<style scoped>
  .plex-settings {
    max-width: 800px;
  }

  .plex-connected {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
</style>
