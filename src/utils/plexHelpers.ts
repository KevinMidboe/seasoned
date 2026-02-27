export function getLibraryIcon(type: string): string {
  const icons: Record<string, string> = {
    movies: "🎬",
    shows: "📺",
    music: "🎵"
  };
  return icons[type] || "📁";
}

export function getLibraryTitle(type: string): string {
  const titles: Record<string, string> = {
    movies: "Movies",
    shows: "TV Shows",
    music: "Music"
  };
  return titles[type] || type;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } catch {
    return dateString;
  }
}

export function formatMemberSince(dateString: string): string {
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

export function processLibraryItem(
  item: any,
  libraryType: string,
  authToken: string,
  serverUrl: string
) {
  // Get poster/thumbnail URL
  let posterUrl = null;
  if (item.thumb) {
    posterUrl = `${serverUrl}${item.thumb}?X-Plex-Token=${authToken}`;
  } else if (item.grandparentThumb) {
    posterUrl = `${serverUrl}${item.grandparentThumb}?X-Plex-Token=${authToken}`;
  }

  const baseItem = {
    title: item.title,
    year: item.year || item.parentYear || new Date().getFullYear(),
    poster: posterUrl,
    fallbackIcon: getLibraryIcon(libraryType),
    rating: item.rating ? Math.round(item.rating * 10) / 10 : null
  };

  if (libraryType === "shows") {
    return {
      ...baseItem,
      episodes: item.leafCount || 0
    };
  } else if (libraryType === "music") {
    return {
      ...baseItem,
      artist: item.parentTitle || "Unknown Artist",
      tracks: item.leafCount || 0
    };
  }

  return baseItem;
}

export function calculateGenreStats(metadata: any[]) {
  const genreMap = new Map<string, number>();

  metadata.forEach((item: any) => {
    if (item.Genre) {
      item.Genre.forEach((genre: any) => {
        genreMap.set(genre.tag, (genreMap.get(genre.tag) || 0) + 1);
      });
    }
  });

  return Array.from(genreMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
}

export function calculateDuration(metadata: any[], libraryType: string) {
  let totalDuration = 0;
  let totalEpisodes = 0;
  let totalTracks = 0;

  metadata.forEach((item: any) => {
    if (item.duration) {
      totalDuration += item.duration;
    }

    if (libraryType === "shows" && item.leafCount) {
      totalEpisodes += item.leafCount;
    } else if (libraryType === "music" && item.leafCount) {
      totalTracks += item.leafCount;
    }
  });

  const hours = Math.round(totalDuration / (1000 * 60 * 60));
  const formattedDuration = hours.toLocaleString() + " hours";

  return {
    totalDuration: formattedDuration,
    totalEpisodes,
    totalTracks
  };
}
