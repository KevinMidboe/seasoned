import { ref } from "vue";
import { usePlexApi } from "./usePlexApi";
import {
  processLibraryItem,
  calculateGenreStats,
  calculateDuration
} from "@/utils/plexHelpers";

export function usePlexLibraries() {
  const { plexServerUrl, fetchLibrarySections, fetchLibraryDetails } =
    usePlexApi();

  const loading = ref(false);
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
    music: { total: 0, recentlyAdded: [], genres: [], totalTracks: 0 }
  });

  async function loadLibraries(authToken: string) {
    loading.value = true;

    // Reset stats
    libraryStats.value = { movies: 0, shows: 0, music: 0, watchtime: 0 };

    try {
      const sections = await fetchLibrarySections(authToken);

      for (const section of sections) {
        const type = section.type;
        const key = section.key;

        if (type === "movie") {
          await processLibrarySection(authToken, key, "movies");
        } else if (type === "show") {
          await processLibrarySection(authToken, key, "shows");
        } else if (type === "artist") {
          await processLibrarySection(authToken, key, "music");
        }
      }
    } catch (error) {
      console.error("[PlexLibraries] Error loading libraries:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function processLibrarySection(
    authToken: string,
    sectionKey: string,
    libraryType: string
  ) {
    try {
      const data = await fetchLibraryDetails(authToken, sectionKey);
      if (!data) return;

      const totalCount = data.all.MediaContainer?.size || 0;

      // Update stats
      if (libraryType === "movies") {
        libraryStats.value.movies += totalCount;
      } else if (libraryType === "shows") {
        libraryStats.value.shows += totalCount;
      } else if (libraryType === "music") {
        libraryStats.value.music += totalCount;
      }

      // Process recently added items
      const recentItems = data.recentMetadata
        .slice(0, 5)
        .map((item: any) =>
          processLibraryItem(item, libraryType, authToken, plexServerUrl.value)
        );

      // Calculate stats
      const genres = calculateGenreStats(data.metadata);
      const durations = calculateDuration(data.metadata, libraryType);

      // Update library details
      libraryDetails.value[libraryType] = {
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
    loading,
    libraryStats,
    libraryDetails,
    loadLibraries
  };
}
