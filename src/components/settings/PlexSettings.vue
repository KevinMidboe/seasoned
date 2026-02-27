<template>
  <div class="plex-settings">
    <!-- Unconnected state -->
    <PlexAuthButton
      v-if="!isPlexConnected"
      @auth-success="handleAuthSuccess"
      @auth-error="handleAuthError"
    />

    <!-- Connected state -->
    <div v-else class="plex-connected">
      <PlexProfileCard
        v-if="plexUsername"
        :username="plexUsername"
        :userData="plexUserData"
      />

      <PlexLibraryStats
        :movies="libraryStats.movies"
        :shows="libraryStats.shows"
        :music="libraryStats.music"
        :watchtime="libraryStats.watchtime"
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

  const messages: Ref<IErrorMessage[]> = ref([]);
  const loading = ref(false);
  const syncing = ref(false);
  const showConfirmModal = ref(false);
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
  const plexMachineId = ref("");
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
  const { getCookie, setPlexAuthCookie, cleanup } = usePlexAuth();
  const {
    fetchPlexUserData,
    fetchPlexServers,
    fetchLibrarySections,
    fetchLibraryDetails
  } = usePlexApi();
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
      plexMachineId.value = server.machineIdentifier;
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
        server.machineIdentifier,
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

  // ----- OAuth flow (handlers for PlexAuthButton events) -----
  async function handleAuthSuccess(authToken: string) {
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
      console.error("[PlexSettings] Error in handleAuthSuccess:", error);
      messages.value.push({
        type: ErrorMessageTypes.Error,
        title: "Authentication failed",
        message: "An error occurred while connecting to Plex"
      } as IErrorMessage);
    }
  }

  function handleAuthError(errorMessage: string) {
    messages.value.push({
      type: ErrorMessageTypes.Error,
      title: "Authentication failed",
      message: errorMessage
    } as IErrorMessage);
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
    document.getElementsByTagName("body")[0].classList.add("no-scroll");
    showLibraryModal.value = true;
  }
  function closeLibraryModal() {
    showLibraryModal.value = false;
    document.getElementsByTagName("body")[0].classList.remove("no-scroll");
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
    cleanup();
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
