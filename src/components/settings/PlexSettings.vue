<template>
  <div class="plex-settings">
    <!-- Unconnected state -->
    <div v-if="!isPlexConnected" class="plex-connect">
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

    <!-- Connected state -->
    <div v-else class="plex-connected">
      <!-- Plex User Profile Card -->
      <div v-if="plexUsername" class="plex-profile-card">
        <div class="profile-header">
          <img
            v-if="plexUserData?.thumb"
            :src="plexUserData.thumb"
            alt="Profile"
            class="profile-avatar"
          />
          <div v-else class="profile-avatar-placeholder">
            {{ plexUsername.charAt(0).toUpperCase() }}
          </div>
          <div class="profile-info">
            <div class="username-row">
              <h3 class="profile-username">{{ plexUsername }}</h3>
              <svg
                class="connected-checkmark"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div v-if="plexUserData?.email" class="profile-email">
              {{ plexUserData.email }}
            </div>
            <div class="profile-badges">
              <div
                v-if="plexUserData?.subscription?.active"
                class="profile-badge plex-pass"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                >
                  <path
                    d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zm0 230.4C66.9 230.4 25.6 189.1 25.6 128S66.9 25.6 128 25.6 230.4 66.9 230.4 128 189.1 230.4 128 230.4z"
                  />
                </svg>
                Plex Pass
              </div>
              <div
                v-if="plexUserData?.joined_at"
                class="profile-badge member-since"
              >
                {{ formatMemberSince(plexUserData.joined_at) }}
              </div>
              <div
                v-if="plexUserData?.two_factor_enabled"
                class="profile-badge two-factor"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                  ></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                2FA
              </div>
              <div
                v-if="plexUserData?.experimental_features"
                class="profile-badge experimental"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path
                    d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
                  ></path>
                </svg>
                Labs
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Library Stats Grid -->
      <div class="library-stats">
        <div
          class="stat-card"
          :class="{ disabled: libraryStats.movies === 0 || loadingLibraries }"
          @click="
            libraryStats.movies > 0 &&
            !loadingLibraries &&
            showLibraryDetails('movies')
          "
        >
          <div class="stat-icon">🎬</div>
          <div class="stat-content">
            <div class="stat-value" v-if="!loadingLibraries">
              {{ libraryStats.movies }}
            </div>
            <div class="stat-value loading-dots" v-else>...</div>
            <div class="stat-label">Movies</div>
          </div>
        </div>
        <div
          class="stat-card"
          :class="{ disabled: libraryStats.shows === 0 || loadingLibraries }"
          @click="
            libraryStats.shows > 0 &&
            !loadingLibraries &&
            showLibraryDetails('shows')
          "
        >
          <div class="stat-icon">📺</div>
          <div class="stat-content">
            <div class="stat-value" v-if="!loadingLibraries">
              {{ libraryStats.shows }}
            </div>
            <div class="stat-value loading-dots" v-else>...</div>
            <div class="stat-label">TV Shows</div>
          </div>
        </div>
        <div
          class="stat-card"
          :class="{ disabled: libraryStats.music === 0 || loadingLibraries }"
          @click="
            libraryStats.music > 0 &&
            !loadingLibraries &&
            showLibraryDetails('music')
          "
        >
          <div class="stat-icon">🎵</div>
          <div class="stat-content">
            <div class="stat-value" v-if="!loadingLibraries">
              {{ libraryStats.music }}
            </div>
            <div class="stat-value loading-dots" v-else>...</div>
            <div class="stat-label">Albums</div>
          </div>
        </div>
        <div class="stat-card disabled">
          <div class="stat-icon">⏱️</div>
          <div class="stat-content">
            <div class="stat-value" v-if="!loadingLibraries">
              {{ libraryStats.watchtime }}
            </div>
            <div class="stat-value loading-dots" v-else>...</div>
            <div class="stat-label">Hours Watched</div>
          </div>
        </div>
      </div>

      <!-- Server & Sync Info -->
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
          <span class="detail-value">{{ plexServer }}</span>
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
          <span class="detail-value">{{ lastSync }}</span>
        </div>
      </div>

      <div class="plex-actions">
        <SeasonedButton @click="syncLibrary" :disabled="syncing">
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
        </SeasonedButton>
        <SeasonedButton @click="confirmUnlink"> Unlink Account </SeasonedButton>
      </div>
    </div>

    <!-- Messages -->
    <SeasonedMessages v-model:messages="messages" />

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

    <!-- Library Details Modal -->
    <div
      v-if="showLibraryModal"
      class="modal-overlay library-modal-overlay"
      @click="closeLibraryModal"
    >
      <div class="library-modal-content" @click.stop>
        <div class="library-modal-header">
          <div class="library-header-title">
            <span class="library-icon-large">
              {{ getLibraryIcon(selectedLibrary) }}
            </span>
            <div>
              <h3>{{ getLibraryTitle(selectedLibrary) }}</h3>
              <p class="library-subtitle">
                {{ libraryDetails[selectedLibrary]?.total }} items
              </p>
            </div>
          </div>
          <button class="close-btn" @click="closeLibraryModal">
            <IconClose />
          </button>
        </div>
        <div class="library-modal-body">
          <!-- Stats Overview -->
          <div class="library-stats-overview">
            <div class="overview-stat">
              <span class="overview-label">Total Items</span>
              <span class="overview-value">
                {{ libraryDetails[selectedLibrary]?.total }}
              </span>
            </div>
            <div class="overview-stat" v-if="selectedLibrary === 'shows'">
              <span class="overview-label">Episodes</span>
              <span class="overview-value">
                {{ libraryDetails[selectedLibrary]?.totalEpisodes }}
              </span>
            </div>
            <div class="overview-stat" v-if="selectedLibrary === 'music'">
              <span class="overview-label">Tracks</span>
              <span class="overview-value">
                {{ libraryDetails[selectedLibrary]?.totalTracks }}
              </span>
            </div>
            <div class="overview-stat">
              <span class="overview-label">Duration</span>
              <span class="overview-value">
                {{ libraryDetails[selectedLibrary]?.totalDuration }}
              </span>
            </div>
          </div>

          <!-- Recently Added -->
          <div class="library-section">
            <h4 class="section-title">Recently Added</h4>
            <div class="recent-items">
              <div
                v-for="(item, index) in libraryDetails[selectedLibrary]
                  ?.recentlyAdded"
                :key="index"
                class="recent-item"
              >
                <div class="item-poster-container">
                  <img
                    v-if="item.poster"
                    :src="item.poster"
                    :alt="item.title"
                    class="item-poster-image"
                    @error="e => (e.target.style.display = 'none')"
                  />
                  <span v-if="!item.poster" class="item-poster-fallback">
                    {{ item.fallbackIcon }}
                  </span>
                </div>
                <div class="item-info">
                  <div class="item-title">{{ item.title }}</div>
                  <div class="item-meta">
                    <span v-if="selectedLibrary === 'music'">
                      {{ item.artist }} •
                    </span>
                    <span>{{ item.year }}</span>
                    <span v-if="item.episodes">
                      • {{ item.episodes }} episodes
                    </span>
                    <span v-if="item.tracks"> • {{ item.tracks }} tracks </span>
                  </div>
                </div>
                <div class="item-rating" v-if="item.rating">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <polygon
                      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                    />
                  </svg>
                  {{ item.rating }}
                </div>
              </div>
            </div>
          </div>

          <!-- Top Genres -->
          <div class="library-section">
            <h4 class="section-title">Top Genres</h4>
            <div class="genre-list">
              <div
                v-for="(genre, index) in libraryDetails[selectedLibrary]
                  ?.genres"
                :key="index"
                class="genre-item"
              >
                <span class="genre-name">{{ genre.name }}</span>
                <div class="genre-bar-container">
                  <div
                    class="genre-bar"
                    :style="{
                      width:
                        (genre.count / libraryDetails[selectedLibrary].total) *
                          100 +
                        '%'
                    }"
                  ></div>
                </div>
                <span class="genre-count">{{ genre.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from "vue";
  import { useStore } from "vuex";
  import SeasonedButton from "@/components/ui/SeasonedButton.vue";
  import SeasonedMessages from "@/components/ui/SeasonedMessages.vue";
  import IconInfo from "@/icons/IconInfo.vue";
  import IconClose from "@/icons/IconClose.vue";
  import type { Ref } from "vue";
  import { linkPlexAccount, unlinkPlexAccount } from "../../api";
  import { ErrorMessageTypes } from "../../interfaces/IErrorMessage";
  import type { IErrorMessage } from "../../interfaces/IErrorMessage";

  const CLIENT_IDENTIFIER =
    "seasoned-plex-app-" + Math.random().toString(36).substring(7);
  const APP_NAME = "Seasoned";
  const TAUTULLI_API_KEY = "28494032b47542278fe76c6ccd1f0619"; // Replace with your actual key
  const TAUTULLI_BASE_URL = "http://plex.schleppe:8181/api/v2";

  async function fetchTautulliHistory(username: string) {
    try {
      const url = `${TAUTULLI_BASE_URL}?apikey=${TAUTULLI_API_KEY}&cmd=get_history&user=${encodeURIComponent(username)}&length=8000`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch Tautulli history");
      const data = await response.json();
      return data.response.data || [];
    } catch (error) {
      console.error("Error fetching Tautulli history:", error);
      return [];
    }
  }

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

  // ----- Utility functions -----
  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  }

  // ---- Plex API interactions ----
  async function fetchPlexServers(authToken: string) {
    try {
      const response = await fetch(
        "https://plex.tv/api/v2/resources?includeHttps=1&includeRelay=1",
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "X-Plex-Token": authToken,
            "X-Plex-Client-Identifier": CLIENT_IDENTIFIER
          }
        }
      );
      if (!response.ok) throw new Error("Failed to fetch Plex servers");
      const servers = await response.json();
      const ownedServer = servers.find(
        (s: any) => s.owned && s.provides === "server"
      );
      if (ownedServer) {
        plexServer.value = ownedServer.name;
        const connection =
          ownedServer.connections?.find((c: any) => c.local === false) ||
          ownedServer.connections?.[0];
        if (connection) plexServerUrl.value = connection.uri;
      }
      return ownedServer;
    } catch (error) {
      console.error("[PlexSettings] Error fetching Plex servers:", error);
      return null;
    }
  }

  async function fetchPlexLibraries(authToken: string) {
    if (!plexServerUrl.value) {
      console.error("[PlexSettings] No server URL available");
      return;
    }
    try {
      loadingLibraries.value = true;
      const response = await fetch(`${plexServerUrl.value}/library/sections`, {
        method: "GET",
        headers: { accept: "application/json", "X-Plex-Token": authToken }
      });
      if (!response.ok) throw new Error("Failed to fetch Plex libraries");
      const data = await response.json();
      libraryStats.value = { movies: 0, shows: 0, music: 0, watchtime: 0 };
      const sections = data.MediaContainer?.Directory || [];
      for (const section of sections) {
        const type = section.type;
        const key = section.key;
        if (type === "movie")
          await fetchLibraryDetails(authToken, key, "movies", section.title);
        else if (type === "show")
          await fetchLibraryDetails(authToken, key, "shows", section.title);
        else if (type === "artist")
          await fetchLibraryDetails(authToken, key, "music", section.title);
      }
      lastSync.value = "Just now";

      // Example usage
      const history = await fetchTautulliHistory(plexUsername.value);
      let totalWatchTimeMs = 0;
      history.data.forEach((item: any) => {
        if (item.duration) totalWatchTimeMs += item.duration * 1000; // duration is in seconds
      });
      const totalWatchHours = Math.round(totalWatchTimeMs / (1000 * 60 * 60));
      console.log("Total watch time (hours):", totalWatchHours);
      libraryStats.value.watchtime = totalWatchHours;
    } catch (error) {
      console.error("[PlexSettings] Error fetching Plex libraries:", error);
      messages.value.push({
        type: ErrorMessageTypes.Error,
        title: "Failed to fetch libraries",
        message: "Could not load library data from Plex server"
      } as IErrorMessage);
    } finally {
      loadingLibraries.value = false;
    }
  }

  async function fetchLibraryDetails(
    authToken: string,
    sectionKey: string,
    libraryType: string,
    libraryName: string
  ) {
    try {
      const allResponse = await fetch(
        `${plexServerUrl.value}/library/sections/${sectionKey}/all`,
        {
          method: "GET",
          headers: { accept: "application/json", "X-Plex-Token": authToken }
        }
      );
      if (!allResponse.ok) throw new Error("Failed to fetch all items");
      const allData = await allResponse.json();
      const totalCount = allData.MediaContainer?.size || 0;
      const allMetadata = allData.MediaContainer?.Metadata || [];
      if (libraryType === "movies") libraryStats.value.movies += totalCount;
      else if (libraryType === "shows") libraryStats.value.shows += totalCount;
      else if (libraryType === "music") libraryStats.value.music += totalCount;

      const recentResponse = await fetch(
        `${plexServerUrl.value}/library/sections/${sectionKey}/recentlyAdded?X-Plex-Container-Start=0&X-Plex-Container-Size=5`,
        {
          method: "GET",
          headers: { accept: "application/json", "X-Plex-Token": authToken }
        }
      );
      if (!recentResponse.ok) throw new Error("Failed to fetch recently added");
      const recentData = await recentResponse.json();
      const metadata = recentData.MediaContainer?.Metadata || [];
      const recentItems = metadata.slice(0, 5).map((item: any) => {
        let posterUrl = null;
        if (item.thumb)
          posterUrl = `${plexServerUrl.value}${item.thumb}?X-Plex-Token=${authToken}`;
        else if (item.grandparentThumb)
          posterUrl = `${plexServerUrl.value}${item.grandparentThumb}?X-Plex-Token=${authToken}`;
        const baseItem = {
          title: item.title,
          year: item.year || item.parentYear || new Date().getFullYear(),
          poster: posterUrl,
          fallbackIcon: getLibraryIcon(libraryType),
          rating: item.rating ? Math.round(item.rating * 10) / 10 : null
        };
        if (libraryType === "shows")
          return { ...baseItem, episodes: item.leafCount || 0 };
        if (libraryType === "music")
          return {
            ...baseItem,
            artist: item.parentTitle || "Unknown Artist",
            tracks: item.leafCount || 0
          };
        return baseItem;
      });

      // Genre & duration stats
      const genreMap = new Map<string, number>();
      let totalDuration = 0;
      let totalEpisodes = 0;
      let totalTracks = 0;
      allMetadata.forEach((item: any) => {
        if (item.Genre)
          item.Genre.forEach((g: any) => {
            genreMap.set(g.tag, (genreMap.get(g.tag) ?? 0) + 1);
          });
        if (item.duration) totalDuration += item.duration;
        if (libraryType === "shows" && item.leafCount)
          totalEpisodes += item.leafCount;
        if (libraryType === "music" && item.leafCount)
          totalTracks += item.leafCount;
      });

      const topGenres = Array.from(genreMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

      const hours = Math.round(totalDuration / (1000 * 60 * 60));
      const formattedDuration = `${hours.toLocaleString()} hours`;

      libraryDetails.value[libraryType] = {
        total: totalCount,
        recentlyAdded: recentItems,
        genres: topGenres,
        totalDuration: formattedDuration,
        ...(libraryType === "shows" && { totalEpisodes }),
        ...(libraryType === "music" && { totalTracks })
      };
    } catch (error) {
      console.error(
        `[PlexSettings] Error fetching ${libraryType} library details:`,
        error
      );
    }
  }

  function checkPlexConnection() {
    const cachedData = localStorage.getItem("plex_user_data");
    const authToken = getCookie("plex_auth_token");
    const storeHasPlexUserId = store.getters["user/plexUserId"];
    hasLocalStorageData.value = !!cachedData;
    hasCookieData.value = !!authToken;
    isPlexConnected.value = !!(cachedData || authToken || storeHasPlexUserId);
    return isPlexConnected.value;
  }

  async function fetchPlexUserData(authToken: string) {
    try {
      const response = await fetch("https://plex.tv/api/v2/user", {
        method: "GET",
        headers: {
          accept: "application/json",
          "X-Plex-Product": APP_NAME,
          "X-Plex-Client-Identifier": CLIENT_IDENTIFIER,
          "X-Plex-Token": authToken
        }
      });
      if (!response.ok) throw new Error("Failed to fetch Plex user info");
      const data = await response.json();

      const joinedDate =
        typeof data.joinedAt === "number"
          ? new Date(data.joinedAt * 1000).toISOString()
          : (data.joinedAt ?? null);

      const userData = {
        id: data.id,
        uuid: data.uuid,
        username: data.username || data.title || "Plex User",
        email: data.email,
        thumb: data.thumb,
        joined_at: joinedDate,
        two_factor_enabled: data.twoFactorEnabled ?? false,
        experimental_features: data.experimentalFeatures ?? false,
        subscription: {
          active: data.subscription?.active,
          plan: data.subscription?.plan,
          features: data.subscription?.features
        },
        profile: {
          auto_select_audio: data.profile?.autoSelectAudio,
          default_audio_language: data.profile?.defaultAudioLanguage,
          default_subtitle_language: data.profile?.defaultSubtitleLanguage
        },
        entitlements: data.entitlements ?? [],
        roles: data.roles ?? [],
        created_at: new Date().toISOString()
      };
      localStorage.setItem("plex_user_data", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Error fetching Plex user data:", error);
      return null;
    }
  }

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
        const server = await fetchPlexServers(authToken);
        if (server) await fetchPlexLibraries(authToken);
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

  function setPlexAuthCookie(authToken: string) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    document.cookie = `plex_auth_token=${authToken}; path=/; expires=${expires.toUTCString()}; SameSite=Strict`;
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
        const server = await fetchPlexServers(authToken);
        if (server) await fetchPlexLibraries(authToken);
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

  // Helper formatting
  function formatMemberSince(dateString: string) {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const years = now.getFullYear() - date.getFullYear();
      if (years === 0) return "New Member";
      if (years === 1) return "1 Year";
      return `${years} Years`;
    } catch {
      return "Member";
    }
  }

  function showLibraryDetails(type: string) {
    selectedLibrary.value = type;
    showLibraryModal.value = true;
  }
  function closeLibraryModal() {
    showLibraryModal.value = false;
    selectedLibrary.value = "";
  }

  function getLibraryIcon(type: string) {
    const icons: Record<string, string> = {
      movies: "🎬",
      shows: "📺",
      music: "🎵"
    };
    return icons[type] ?? "📁";
  }
  function getLibraryTitle(type: string) {
    const titles: Record<string, string> = {
      movies: "Movies",
      shows: "TV Shows",
      music: "Music"
    };
    return titles[type] ?? type;
  }

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
      const server = await fetchPlexServers(authToken);
      if (server) {
        await fetchPlexLibraries(authToken);
        messages.value.push({
          type: ErrorMessageTypes.Success,
          title: "Library synced",
          message: "Your Plex library has been successfully synced"
        } as IErrorMessage);
      } else {
        messages.value.push({
          type: ErrorMessageTypes.Error,
          title: "Sync failed",
          message: "Could not connect to Plex server"
        } as IErrorMessage);
      }
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

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  /* --------------------------------------------------
   Recent‑Item poster
   -------------------------------------------------- */
  .recent-item {
    /* existing flex layout is kept – we just set a size for the poster container */
    .item-poster-container {
      width: 80px; /* you can adjust width / height as you like */
      height: 120px;
      flex-shrink: 0;
      margin-right: 1rem;

      /* image styling */
      .item-poster-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 4px;
        background: var(--background-40); /* fallback colour */
      }

      /* fallback icon when no poster is available */
      .item-poster-fallback {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: var(--background-40);
        border-radius: 4px;
        font-size: 1.5rem;
        color: var(--text-color-60);
      }
    }

    /* --------------------------------------------------
     Item info – title, rating & year on the same row
     -------------------------------------------------- */
    .item-info {
      flex: 1; /* take the remaining width */
      display: flex;
      flex-direction: column; /* title / rating line first, meta line second */
      justify-content: space-between;
    }

    .item-title {
      font-weight: 600;
      font-size: 1rem;
      display: flex;
      align-items: center; /* centre vertically with rating */
      gap: 0.4rem; /* space between title & rating */
      flex-wrap: wrap; /* allows long titles to wrap */
    }

    /* rating icon + value – inline with the title */
    .item-rating {
      font-size: 0.85rem;
      color: #fbbf24; /* gold‑yellow – change if you need a different colour */
      display: flex;
      align-items: center;
      gap: 0.2rem; /* small gap between icon & number */
    }

    /* meta line – year, episodes / tracks */
    .item-meta {
      font-size: 0.78rem;
      color: var(--text-color-60);
      margin-top: 0.2rem; /* a little space after the title line */
      line-height: 1.2;
      display: flex;
      flex-wrap: wrap; /* ensures the text stays in one line on small screens */

      /* the spans inside .item-meta are already inline, so we only need the spacing */
      span + span::before {
        content: "•";
        margin: 0 0.4rem;
      }
    }
  }

  /* -----------------------------------------------
   Optional – make the whole recent‑item clickable
   ----------------------------------------------- */
  .recent-item:hover {
    background-color: var(--background-40);
    border-color: var(--highlight-color);
    transform: translateX(4px);
  }

  .signin-container {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .plex-signin-btn {
    padding: 1rem 1.75rem;
    background-color: #c87818;
    color: $white;
    border: none;
    border-radius: 0.75rem;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    align-self: flex-start;
    box-shadow: 0 4px 12px rgba(200, 120, 24, 0.25);
    letter-spacing: -0.01em;

    @include mobile-only {
      width: 100%;
      padding: 0.9rem 1.4rem;
      font-size: 1rem;
    }

    &:hover:not(:disabled) {
      background-color: #b36a15;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(200, 120, 24, 0.4);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 4px 12px rgba(200, 120, 24, 0.3);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    svg {
      flex-shrink: 0;
      width: 22px;
      height: 22px;
    }
  }

  .popup-note {
    margin: 0;
    font-size: 0.85rem;
    opacity: 0.65;
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

  .plex-profile-card {
    background-color: var(--background-ui);
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 0.85rem;
    border: 1px solid var(--background-40);

    @include mobile-only {
      padding: 0.85rem;
    }
  }

  .profile-header {
    display: flex;
    gap: 0.85rem;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .profile-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--highlight-color);
    flex-shrink: 0;

    @include mobile-only {
      width: 50px;
      height: 50px;
    }
  }

  .profile-avatar-placeholder {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      var(--highlight-color),
      var(--background-40)
    );
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-color);
    flex-shrink: 0;

    @include mobile-only {
      width: 50px;
      height: 50px;
      font-size: 1.3rem;
    }
  }

  .profile-info {
    flex: 1;
    min-width: 0;
  }

  .username-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }

  .profile-username {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-color);

    @include mobile-only {
      font-size: 1.1rem;
    }
  }

  .connected-checkmark {
    color: var(--color-success-highlight);
    flex-shrink: 0;
    animation: checkmarkPop 0.3s ease-out;

    @include mobile-only {
      width: 18px;
      height: 18px;
    }
  }

  @keyframes checkmarkPop {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .profile-email {
    font-size: 0.85rem;
    color: var(--text-color-60);
    margin-bottom: 0.4rem;
    word-break: break-all;

    @include mobile-only {
      font-size: 0.8rem;
    }
  }

  .profile-badges {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 0.4rem;
  }

  .profile-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.25rem 0.65rem;
    border-radius: 1rem;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.02em;

    @include mobile-only {
      font-size: 0.65rem;
      padding: 0.2rem 0.55rem;
    }

    &.plex-pass {
      background-color: #cc7b19;
      color: $white;
      text-transform: uppercase;

      svg {
        width: 12px;
        height: 12px;

        @include mobile-only {
          width: 11px;
          height: 11px;
        }
      }
    }

    &.member-since {
      background-color: var(--background-40);
      color: var(--text-color-70);
    }

    &.two-factor {
      background-color: var(--color-success);
      color: $white;

      svg {
        width: 11px;
        height: 11px;

        @include mobile-only {
          width: 10px;
          height: 10px;
        }
      }
    }

    &.experimental {
      background-color: #8b5cf6;
      color: $white;

      svg {
        width: 11px;
        height: 11px;

        @include mobile-only {
          width: 10px;
          height: 10px;
        }
      }
    }
  }

  .library-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
    margin-bottom: 0.85rem;

    @include mobile-only {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.65rem;
    }
  }

  .stat-card {
    background-color: var(--background-ui);
    border-radius: 0.5rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;

    @include mobile-only {
      padding: 0.85rem 0.75rem;
    }

    &:hover:not(.disabled) {
      background-color: var(--background-40);
      border-color: var(--highlight-color);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &.disabled {
      cursor: default;
      opacity: 0.6;

      &:hover {
        transform: none;
        border-color: transparent;
      }
    }
  }

  .loading-dots {
    animation: loadingDots 1.5s infinite;
  }

  @keyframes loadingDots {
    0%,
    20% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.3;
    }
  }

  .stat-icon {
    font-size: 2rem;
    line-height: 1;

    @include mobile-only {
      font-size: 1.75rem;
    }
  }

  .stat-content {
    text-align: center;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-color);
    line-height: 1;
    margin-bottom: 0.25rem;

    @include mobile-only {
      font-size: 1.3rem;
    }
  }

  .stat-label {
    font-size: 0.75rem;
    color: var(--text-color-60);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.03em;

    @include mobile-only {
      font-size: 0.7rem;
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
    z-index: 9998;
    padding: 1rem;

    @include mobile-only {
      padding: 0.5rem;
      align-items: flex-end;
    }
  }

  // Library modal needs higher z-index than confirmation modal
  .library-modal-overlay {
    z-index: 9999;
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

  // Library Modal Styles
  .library-modal-overlay {
    backdrop-filter: blur(4px);
  }

  .library-modal-content {
    background-color: var(--background-color-secondary);
    border-radius: 1rem;
    max-width: 700px;
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);

    @include mobile-only {
      max-width: 100%;
      max-height: 100vh;
      border-radius: 0;
    }
  }

  .library-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid var(--background-40);
    background: linear-gradient(
      135deg,
      var(--background-ui),
      var(--background-color-secondary)
    );

    @include mobile-only {
      padding: 1.25rem;
    }
  }

  .library-header-title {
    display: flex;
    align-items: center;
    gap: 1rem;

    h3 {
      margin: 0;
      font-weight: 600;
      font-size: 1.5rem;

      @include mobile-only {
        font-size: 1.25rem;
      }
    }
  }

  .library-icon-large {
    font-size: 3rem;
    line-height: 1;

    @include mobile-only {
      font-size: 2.5rem;
    }
  }

  .library-subtitle {
    margin: 0.25rem 0 0 0;
    font-size: 0.9rem;
    color: var(--text-color-60);

    @include mobile-only {
      font-size: 0.85rem;
    }
  }

  .library-modal-body {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;

    @include mobile-only {
      padding: 1.25rem;
    }
  }

  .library-stats-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;

    @include mobile-only {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
  }

  .overview-stat {
    background-color: var(--background-ui);
    padding: 1rem;
    border-radius: 0.5rem;
    text-align: center;
    border: 1px solid var(--background-40);

    @include mobile-only {
      padding: 0.85rem;
    }
  }

  .overview-label {
    display: block;
    font-size: 0.75rem;
    color: var(--text-color-60);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
    font-weight: 600;

    @include mobile-only {
      font-size: 0.7rem;
    }
  }

  .overview-value {
    display: block;
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--highlight-color);

    @include mobile-only {
      font-size: 1.5rem;
    }
  }

  .library-section {
    margin-bottom: 2rem;

    @include mobile-only {
      margin-bottom: 1.5rem;
    }
  }

  .section-title {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-color);

    @include mobile-only {
      font-size: 1rem;
      margin-bottom: 0.85rem;
    }
  }

  .recent-items {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .recent-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.85rem;
    background-color: var(--background-ui);
    border-radius: 0.5rem;
    transition: all 0.2s;
    border: 1px solid transparent;

    @include mobile-only {
      padding: 0.75rem;
      gap: 0.85rem;
    }

    &:hover {
      background-color: var(--background-40);
      border-color: var(--highlight-color);
      transform: translateX(4px);
    }
  }

  .item-poster {
    font-size: 2.5rem;
    line-height: 1;
    flex-shrink: 0;

    @include mobile-only {
      font-size: 2rem;
    }
  }

  .item-info {
    flex: 1;
    min-width: 0;
  }

  .item-title {
    font-weight: 600;
    font-size: 1rem;
    color: var(--text-color);
    margin-bottom: 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @include mobile-only {
      font-size: 0.95rem;
    }
  }

  .item-meta {
    font-size: 0.8rem;
    color: var(--text-color-60);

    @include mobile-only {
      font-size: 0.75rem;
    }
  }

  .item-rating {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-weight: 600;
    font-size: 0.95rem;
    color: #fbbf24;
    flex-shrink: 0;

    @include mobile-only {
      font-size: 0.9rem;
    }

    svg {
      fill: #fbbf24;
    }
  }

  .genre-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .genre-item {
    display: grid;
    grid-template-columns: 100px 1fr 60px;
    align-items: center;
    gap: 1rem;

    @include mobile-only {
      grid-template-columns: 80px 1fr 50px;
      gap: 0.75rem;
    }
  }

  .genre-name {
    font-weight: 500;
    font-size: 0.9rem;
    color: var(--text-color);

    @include mobile-only {
      font-size: 0.85rem;
    }
  }

  .genre-bar-container {
    height: 8px;
    background-color: var(--background-40);
    border-radius: 4px;
    overflow: hidden;
  }

  .genre-bar {
    height: 100%;
    background: linear-gradient(
      90deg,
      var(--highlight-color),
      var(--color-green-70)
    );
    border-radius: 4px;
    transition: width 0.5s ease;
  }

  .genre-count {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--text-color-60);
    text-align: right;

    @include mobile-only {
      font-size: 0.85rem;
    }
  }
</style>
