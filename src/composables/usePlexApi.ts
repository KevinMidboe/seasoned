import { ref } from "vue";

// Shared constants - generated once and reused
export const CLIENT_IDENTIFIER =
  "seasoned-plex-app-" + Math.random().toString(36).substring(7);
export const APP_NAME = window.location.hostname;

export function usePlexApi() {
  const plexServerUrl = ref("");

  // Fetch Plex user data
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

      if (!response.ok) {
        throw new Error("Failed to fetch Plex user info");
      }

      const data = await response.json();
      console.log("[PlexAPI] Raw Plex API response:", data);

      // Convert Unix timestamp to ISO date string if needed
      let joinedDate = null;
      if (data.joinedAt) {
        if (typeof data.joinedAt === "number") {
          joinedDate = new Date(data.joinedAt * 1000).toISOString();
        } else {
          joinedDate = data.joinedAt;
        }
      }

      const userData = {
        id: data.id,
        uuid: data.uuid,
        username: data.username || data.title || "Plex User",
        email: data.email,
        thumb: data.thumb,
        joined_at: joinedDate,
        two_factor_enabled: data.twoFactorEnabled || false,
        experimental_features: data.experimentalFeatures || false,
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
        entitlements: data.entitlements || [],
        roles: data.roles || [],
        created_at: new Date().toISOString()
      };

      console.log("[PlexAPI] Processed user data:", userData);
      localStorage.setItem("plex_user_data", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("[PlexAPI] Error fetching Plex user data:", error);
      return null;
    }
  }

  // Fetch Plex servers
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

      if (!response.ok) {
        throw new Error("Failed to fetch Plex servers");
      }

      const servers = await response.json();
      const ownedServer = servers.find(
        (s: any) => s.owned && s.provides === "server"
      );

      if (ownedServer) {
        const connection =
          ownedServer.connections?.find((c: any) => c.local === false) ||
          ownedServer.connections?.[0];
        if (connection) {
          plexServerUrl.value = connection.uri;
        }
        return { name: ownedServer.name, url: plexServerUrl.value };
      }

      return null;
    } catch (error) {
      console.error("[PlexAPI] Error fetching Plex servers:", error);
      return null;
    }
  }

  // Fetch library sections
  async function fetchLibrarySections(authToken: string, serverUrl: string) {
    if (!serverUrl) return [];

    try {
      const response = await fetch(`${serverUrl}/library/sections`, {
        method: "GET",
        headers: {
          accept: "application/json",
          "X-Plex-Token": authToken
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch library sections");
      }

      const data = await response.json();
      return data.MediaContainer?.Directory || [];
    } catch (error) {
      console.error("[PlexAPI] Error fetching library sections:", error);
      return [];
    }
  }

  // Fetch library details
  async function fetchLibraryDetails(
    authToken: string,
    serverUrl: string,
    sectionKey: string
  ) {
    if (!serverUrl) return null;

    try {
      // Fetch all items
      const allResponse = await fetch(
        `${serverUrl}/library/sections/${sectionKey}/all`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "X-Plex-Token": authToken
          }
        }
      );

      if (!allResponse.ok) throw new Error("Failed to fetch all items");
      const allData = await allResponse.json();

      // Fetch recently added
      const size = 20;
      const recentResponse = await fetch(
        `${serverUrl}/library/sections/${sectionKey}/recentlyAdded?X-Plex-Container-Start=0&X-Plex-Container-Size=${size}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "X-Plex-Token": authToken
          }
        }
      );

      if (!recentResponse.ok) throw new Error("Failed to fetch recently added");
      const recentData = await recentResponse.json();

      return {
        all: allData,
        recent: recentData,
        metadata: allData.MediaContainer?.Metadata || [],
        recentMetadata: recentData.MediaContainer?.Metadata || []
      };
    } catch (error) {
      console.error("[PlexAPI] Error fetching library details:", error);
      return null;
    }
  }

  return {
    plexServerUrl,
    fetchPlexUserData,
    fetchPlexServers,
    fetchLibrarySections,
    fetchLibraryDetails
  };
}
