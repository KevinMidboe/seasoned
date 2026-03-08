import { ref } from "vue";
import { API_HOSTNAME } from "../api";

// Shared constants - generated once and reused
export const CLIENT_IDENTIFIER = `seasoned-plex-app-${Math.random().toString(36).substring(7)}`;
export const APP_NAME = window.location.hostname;

async function fetchPlexServers(authToken: string) {
  try {
    const url =
      "https://plex.tv/api/v2/resources?includeHttps=1&includeRelay=1";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-Plex-Token": authToken,
        "X-Plex-Client-Identifier": CLIENT_IDENTIFIER
      }
    };

    const response = await fetch(url, options);

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

      return {
        name: ownedServer.name,
        url: connection?.uri,
        machineIdentifier: ownedServer.clientIdentifier
      };
    }

    return null;
  } catch (error) {
    console.error("[PlexAPI] Error fetching Plex servers:", error);
    return null;
  }
}

async function fetchPlexUserData(authToken: string) {
  try {
    const url = "https://plex.tv/api/v2/user";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-Plex-Product": APP_NAME,
        "X-Plex-Client-Identifier": CLIENT_IDENTIFIER,
        "X-Plex-Token": authToken
      }
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("Failed to fetch Plex user info");
    }

    const data = await response.json();

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

    return userData;
  } catch (error) {
    console.error("[PlexAPI] Error fetching Plex user data:", error);
    return null;
  }
}

// Fetch library details
async function fetchLibraryDetails() {
  try {
    const url = `${API_HOSTNAME}/api/v2/plex/library`;
    const options: RequestInit = { credentials: "include" };
    return await fetch(url, options).then(resp => resp.json());
  } catch (error) {
    console.error("[PlexAPI] error fetching library:", error);
    return null;
  }
}

export { fetchPlexServers, fetchPlexUserData, fetchLibraryDetails };
