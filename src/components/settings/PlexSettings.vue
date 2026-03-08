<template>
  <div class="plex-settings">
    <!-- Unconnected state -->
    <PlexAuthButton
      v-if="!showPlexInformation"
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
        :movies="libraryStats?.movies"
        :shows="libraryStats?.['tv shows']"
        :music="libraryStats?.music"
        :watchtime="libraryStats?.watchtime || 0"
        :loading="syncingLibrary"
        @open-library="showLibraryDetails"
      />

      <PlexServerInfo
        :serverName="plexServer"
        :lastSync="lastSync"
        :syncing="syncingServer"
        @sync="syncLibrary"
        @unlink="() => (showUnlinkModal = true)"
      />
    </div>

    <!-- Messages -->
    <SeasonedMessages v-model:messages="messages" />

    <!-- Unlink Confirmation Modal -->
    <PlexUnlinkModal
      v-if="showUnlinkModal"
      @confirm="unauthenticatePlex"
      @cancel="() => (showUnlinkModal = false)"
    />

    <!-- Library Details Modal -->
    <PlexLibraryModal
      v-if="showLibraryModal && selectedLibrary"
      :libraryType="selectedLibrary"
      :details="libraryStats[selectedLibrary]"
      :serverUrl="plexServerUrl"
      :serverMachineId="plexMachineId"
      @close="closeLibraryModal"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from "vue";
  import SeasonedMessages from "@/components/ui/SeasonedMessages.vue";
  import PlexAuthButton from "@/components/plex/PlexAuthButton.vue";
  import PlexProfileCard from "@/components/plex/PlexProfileCard.vue";
  import PlexLibraryStats from "@/components/plex/PlexLibraryStats.vue";
  import PlexServerInfo from "@/components/plex/PlexServerInfo.vue";
  import PlexUnlinkModal from "@/components/plex/PlexUnlinkModal.vue";
  import PlexLibraryModal from "@/components/plex/PlexLibraryModal.vue";
  import { usePlexAuth } from "@/composables/usePlexAuth";
  import {
    fetchPlexServers,
    fetchPlexUserData,
    fetchLibraryDetails
  } from "@/composables/usePlexApi";
  import type { Ref } from "vue";
  import { ErrorMessageTypes } from "../../interfaces/IErrorMessage";
  import type { IErrorMessage } from "../../interfaces/IErrorMessage";

  const messages: Ref<IErrorMessage[]> = ref([]);
  const syncingServer = ref(false);
  const syncingLibrary = ref(false);
  const showUnlinkModal = ref(false);
  const plexUsername = ref<string>("");
  const plexUserData = ref<any>(null);
  const showPlexInformation = ref<boolean>(false);
  const hasLocalStorageData = ref<boolean>(false);
  const showLibraryModal = ref<boolean>(false);
  const selectedLibrary = ref<string>("");

  const plexServer = ref("");
  const plexServerUrl = ref("");
  const plexMachineId = ref("");
  const lastSync = ref(sessionStorage.getItem("plex_library_last_sync"));
  const libraryStats = ref({
    movies: 0,
    shows: 0,
    music: 0,
    watchtime: 0
  });

  const emit = defineEmits<{
    (e: "reload"): void;
  }>();

  // Composables
  const { getPlexAuthCookie, setPlexAuthCookie, cleanup } = usePlexAuth();

  // ----- Connection check -----
  function checkPlexConnection() {
    const authToken = getPlexAuthCookie();
    showPlexInformation.value = !!authToken;
    return showPlexInformation.value;
  }

  // ----- Library loading -----
  async function loadPlexServer() {
    // return cached value from sessionStorage if exists
    const cacheKey = "plex_server_data";
    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) {
      const server = JSON.parse(cachedData);
      plexServer.value = server?.name;
      plexServerUrl.value = server?.url;
      plexMachineId.value = server?.machineIdentifier;
      return;
    }

    // get token from cookie
    const authToken = getPlexAuthCookie();
    if (!authToken) return;

    // make api call for data
    syncingServer.value = true;
    const server = await fetchPlexServers(authToken);

    if (server) {
      // set server name & id
      plexServer.value = server?.name;
      plexServerUrl.value = server?.url;
      plexMachineId.value = server?.machineIdentifier;
      // cache in sessionStorage
      sessionStorage.setItem(cacheKey, JSON.stringify(server));

      // set last-sync date
      const now = new Date().toLocaleString();
      lastSync.value = now;
      sessionStorage.setItem("plex_library_last_sync", now);
    } else {
      console.log("unable to load plex server informmation");
    }

    syncingServer.value = false;
  }

  // ----- User data loading -----
  async function loadPlexUserData() {
    // return cached value from sessionStorage if exists
    const cacheKey = "plex_user_data";
    const cachedData = sessionStorage.getItem(cacheKey);
    hasLocalStorageData.value = !!cachedData;
    if (cachedData) {
      plexUserData.value = JSON.parse(cachedData);
      plexUsername.value = plexUserData.value.username;
      return;
    }

    // get token from cookie
    const authToken = getPlexAuthCookie();
    if (!authToken) return;

    // make api call for data
    const userData = await fetchPlexUserData(authToken);

    if (userData) {
      // set plex user data
      plexUserData.value = userData;
      plexUsername.value = userData?.username;

      // cache in sessionStorage
      sessionStorage.setItem(cacheKey, JSON.stringify(userData));
    } else {
      console.log("unable to load user data from plex");
    }
  }

  // ----- Load plex libary details -----
  async function loadPlexLibraries() {
    // return cached value from sessionStorage if exists
    const cacheKey = "plex_library_data";
    const cachedData = sessionStorage.getItem(cacheKey);
    hasLocalStorageData.value = !!cachedData;
    if (cachedData) {
      libraryStats.value = JSON.parse(cachedData);
      return;
    }

    // get token from cookie
    const authToken = getPlexAuthCookie();
    if (!authToken) return;

    // make api call for data
    syncingLibrary.value = true;
    const library = await fetchLibraryDetails();

    if (library) {
      libraryStats.value = library;
      // cache in sessionStorage
      sessionStorage.setItem(cacheKey, JSON.stringify(library));
    } else {
      console.log("unable to load plex library details");
    }

    syncingLibrary.value = false;
  }

  // ----- OAuth flow (handlers for PlexAuthButton events) -----
  async function handleAuthSuccess(authToken: string) {
    setPlexAuthCookie(authToken);
    checkPlexConnection();
    const success = await loadAll();

    if (success) {
      messages.value.push({
        type: ErrorMessageTypes.Success,
        title: "Authenticated with Plex",
        message: "Successfully connected your Plex account"
      } as IErrorMessage);
    } else {
      console.error("[PlexSettings] Error in handleAuthSuccess:");

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
  async function unauthenticatePlex() {
    showUnlinkModal.value = false;
    sessionStorage.removeItem("plex_user_data");
    sessionStorage.removeItem("plex_server_data");
    sessionStorage.removeItem("plex_library_data");
    sessionStorage.removeItem("plex_library_last_sync");
    document.cookie =
      "plex_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict";
    plexUserData.value = null;
    plexUsername.value = "";
    showPlexInformation.value = false;
    emit("reload");

    messages.value.push({
      type: ErrorMessageTypes.Success,
      title: "Unlinked Plex account",
      message: "All browser storage has been clear of plex account"
    } as IErrorMessage);
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
    const authToken = getPlexAuthCookie();
    if (!authToken) {
      messages.value.push({
        type: ErrorMessageTypes.Error,
        title: "Sync failed",
        message: "No authentication token found"
      } as IErrorMessage);
      return;
    }

    sessionStorage.removeItem("plex_user_data");
    sessionStorage.removeItem("plex_server_data");
    sessionStorage.removeItem("plex_library_data");

    const success = await loadAll();

    if (success) {
      messages.value.push({
        type: ErrorMessageTypes.Success,
        title: "Library synced",
        message: "Your Plex library has been successfully synced"
      } as IErrorMessage);
    } else {
      messages.value.push({
        type: ErrorMessageTypes.Error,
        title: "Sync failed",
        message: "An error occurred while syncing your library"
      } as IErrorMessage);
    }
  }

  // ---- Helper load all ----
  async function loadAll() {
    let success = false;

    try {
      await Promise.all([
        loadPlexServer(),
        loadPlexUserData(),
        loadPlexLibraries()
      ]);

      success = true;
    } catch (error) {
      console.log("loadall error, some info might be missing");
    }

    checkPlexConnection();
    return success;
  }

  // ---- Lifecycle functions ----
  onMounted(loadAll);

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
