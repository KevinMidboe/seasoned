import { ref } from "vue";
import { CLIENT_IDENTIFIER, APP_NAME } from "./usePlexApi";

export function usePlexAuth() {
  const loading = ref(false);
  const plexPopup = ref<Window | null>(null);
  const pollInterval = ref<number | null>(null);

  // Generate a PIN for Plex OAuth
  async function generatePlexPin() {
    try {
      console.log(
        "[PlexAuth] Generating PIN with CLIENT_IDENTIFIER:",
        CLIENT_IDENTIFIER
      );
      const response = await fetch("https://plex.tv/api/v2/pins?strong=true", {
        method: "POST",
        headers: {
          accept: "application/json",
          "X-Plex-Product": APP_NAME,
          "X-Plex-Client-Identifier": CLIENT_IDENTIFIER
        }
      });

      if (!response.ok) throw new Error("Failed to generate PIN");
      const data = await response.json();
      console.log("[PlexAuth] PIN generated successfully:", {
        id: data.id,
        code: data.code
      });
      return { id: data.id, code: data.code };
    } catch (error) {
      console.error("[PlexAuth] Error generating PIN:", error);
      return null;
    }
  }

  // Check PIN status
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
        console.log("[PlexAuth] PIN check response not OK:", response.status);
        return null;
      }
      const data = await response.json();
      if (data.authToken) {
        console.log(
          "[PlexAuth] ✅ Auth token received:",
          data.authToken.substring(0, 10) + "..."
        );
      }
      return data.authToken;
    } catch (error) {
      console.error("[PlexAuth] Error checking PIN:", error);
      return null;
    }
  }

  // Construct auth URL
  function constructAuthUrl(pinCode: string) {
    const params = new URLSearchParams({
      clientID: CLIENT_IDENTIFIER,
      code: pinCode,
      "context[device][product]": APP_NAME
    });
    return `https://app.plex.tv/auth#?${params.toString()}`;
  }

  // Start polling for PIN
  function startPolling(
    pinId: number,
    pinCode: string,
    onSuccess: (token: string) => void
  ) {
    console.log("[PlexAuth] Starting polling for PIN:", pinId);
    pollInterval.value = window.setInterval(async () => {
      const authToken = await checkPin(pinId, pinCode);
      if (authToken) {
        console.log(
          "[PlexAuth] 🎉 Authentication successful! Calling onSuccess callback"
        );
        stopPolling();
        if (plexPopup.value && !plexPopup.value.closed) {
          plexPopup.value.close();
        }
        onSuccess(authToken);
      }
    }, 1000);
  }

  // Stop polling
  function stopPolling() {
    if (pollInterval.value) {
      clearInterval(pollInterval.value);
      pollInterval.value = null;
    }
  }

  // Set cookie
  function setPlexAuthCookie(authToken: string) {
    console.log(
      "[PlexAuth] Setting cookie for token:",
      authToken.substring(0, 10) + "..."
    );
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    const cookieString = `plex_auth_token=${authToken}; path=/; expires=${expires.toUTCString()}; SameSite=Strict`;
    document.cookie = cookieString;
    console.log("[PlexAuth] Cookie set. Verifying...");
    const verification = getCookie("plex_auth_token");
    console.log(
      "[PlexAuth] Cookie verification:",
      verification ? "✅ SUCCESS" : "❌ FAILED"
    );
  }

  // Get cookie
  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }
    return null;
  }

  // Open authentication popup
  async function openAuthPopup(
    onSuccess: (token: string) => void,
    onError: (msg: string) => void
  ) {
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
      onError("Please allow popups for this site to authenticate with Plex");
      loading.value = false;
      return;
    }

    // Add loading screen
    if (plexPopup.value.document) {
      plexPopup.value.document.write(`
        <html>
          <head>
            <title>Connecting to Plex...</title>
            <style>
              body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; 
                     height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
                     background: #1c3a13; color: #fcfcf7; }
              .spinner { border: 4px solid rgba(252, 252, 247, 0.3); border-top: 4px solid #fcfcf7; 
                         border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; 
                         margin: 0 auto 20px; }
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
          </head>
          <body><div class="loader"><div class="spinner"></div><p>Connecting to Plex...</p></div></body>
        </html>
      `);
    }

    const pin = await generatePlexPin();
    if (!pin) {
      if (plexPopup.value && !plexPopup.value.closed) plexPopup.value.close();
      onError("Could not generate Plex authentication PIN");
      loading.value = false;
      return;
    }

    const authUrl = constructAuthUrl(pin.code);
    if (plexPopup.value && !plexPopup.value.closed) {
      plexPopup.value.location.href = authUrl;
    } else {
      onError("Authentication window was closed");
      loading.value = false;
      return;
    }

    startPolling(pin.id, pin.code, onSuccess);

    // Check if popup closed
    const popupChecker = setInterval(() => {
      if (plexPopup.value && plexPopup.value.closed) {
        clearInterval(popupChecker);
        stopPolling();
        if (loading.value) {
          loading.value = false;
          onError("Plex authentication window was closed");
        }
      }
    }, 500);
  }

  // Cleanup
  function cleanup() {
    stopPolling();
    if (plexPopup.value && !plexPopup.value.closed) {
      plexPopup.value.close();
    }
  }

  return {
    loading,
    setPlexAuthCookie,
    getCookie,
    openAuthPopup,
    cleanup
  };
}
