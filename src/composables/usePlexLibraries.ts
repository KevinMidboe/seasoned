import {
  processLibraryItem,
  calculateGenreStats,
  calculateDuration
} from "@/utils/plexHelpers";

export function usePlexLibraries() {
  async function loadLibraries(
    sections: any[],
    authToken: string,
    serverUrl: string,
    username: string,
    fetchLibraryDetailsFn: any
  ) {
    // Reset stats
    const stats = { movies: 0, shows: 0, music: 0, watchtime: 0 };
    const details: any = {
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
      music: { total: 0, recentlyAdded: [], genres: [], totalTracks: 0 }
    };

    try {
      for (const section of sections) {
        const type = section.type;
        const key = section.key;

        if (type === "movie") {
          await processLibrarySection(
            authToken,
            serverUrl,
            key,
            "movies",
            stats,
            details,
            fetchLibraryDetailsFn
          );
        } else if (type === "show") {
          await processLibrarySection(
            authToken,
            serverUrl,
            key,
            "shows",
            stats,
            details,
            fetchLibraryDetailsFn
          );
        } else if (type === "artist") {
          await processLibrarySection(
            authToken,
            serverUrl,
            key,
            "music",
            stats,
            details,
            fetchLibraryDetailsFn
          );
        }
      }

      // Calculate watchtime from Tautulli if username provided
      if (username) {
        try {
          const TAUTULLI_API_KEY = "28494032b47542278fe76c6ccd1f0619";
          const TAUTULLI_BASE_URL = "http://plex.schleppe:8181/api/v2";
          const url = `${TAUTULLI_BASE_URL}?apikey=${TAUTULLI_API_KEY}&cmd=get_history&user=${encodeURIComponent(
            username
          )}&length=8000`;
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            const history = data.response?.data?.data || [];
            const totalMs = history.reduce(
              (sum: number, item: any) => sum + (item.duration || 0) * 1000,
              0
            );
            stats.watchtime = Math.round(totalMs / (1000 * 60 * 60));
          }
        } catch (error) {
          console.error("[PlexLibraries] Error fetching watchtime:", error);
        }
      }

      return { stats, details };
    } catch (error) {
      console.error("[PlexLibraries] Error loading libraries:", error);
      throw error;
    }
  }

  async function processLibrarySection(
    authToken: string,
    serverUrl: string,
    sectionKey: string,
    libraryType: string,
    stats: any,
    details: any,
    fetchLibraryDetailsFn: any
  ) {
    try {
      const data = await fetchLibraryDetailsFn(
        authToken,
        serverUrl,
        sectionKey
      );
      if (!data) return;

      const totalCount = data.all.MediaContainer?.size || 0;

      // Update stats
      if (libraryType === "movies") {
        stats.movies += totalCount;
      } else if (libraryType === "shows") {
        stats.shows += totalCount;
      } else if (libraryType === "music") {
        stats.music += totalCount;
      }

      // Process recently added items
      const recentItems = data.recentMetadata.map((item: any) =>
        processLibraryItem(item, libraryType, authToken, serverUrl)
      );

      // Calculate stats
      const genres = calculateGenreStats(data.metadata);
      const durations = calculateDuration(data.metadata, libraryType);

      // Update library details
      details[libraryType] = {
        total: totalCount,
        recentlyAdded: recentItems,
        genres,
        totalDuration: durations.totalDuration,
        ...(libraryType === "shows" && {
          totalEpisodes: durations.totalEpisodes
        }),
        ...(libraryType === "music" && { totalTracks: durations.totalTracks })
      };
    } catch (error) {
      console.error(`[PlexLibraries] Error processing ${libraryType}:`, error);
    }
  }

  return {
    loadLibraries
  };
}
