const TAUTULLI_API_KEY = "28494032b47542278fe76c6ccd1f0619";
const TAUTULLI_BASE_URL = "http://plex.schleppe:8181/api/v2";

interface TautulliHistoryItem {
  date: number;
  duration: number;
  media_type: string;
  title: string;
  year?: number;
  rating_key: string;
  parent_rating_key?: string;
  grandparent_rating_key?: string;
  full_title: string;
  started: number;
  stopped: number;
  watched_status: number;
  user: string;
}

interface WatchStats {
  totalHours: number;
  totalPlays: number;
  moviePlays: number;
  episodePlays: number;
  musicPlays: number;
}

interface DayStats {
  date: string;
  plays: number;
  duration: number;
}

interface MediaTypeStats {
  movies: number;
  episodes: number;
  tracks: number;
}

export function useTautulliStats() {
  // Fetch user history from Tautulli
  async function fetchUserHistory(username: string, days: number = 30) {
    try {
      const length = days * 50; // Approximate plays per day
      const url = `${TAUTULLI_BASE_URL}?apikey=${TAUTULLI_API_KEY}&cmd=get_history&user=${encodeURIComponent(
        username
      )}&length=${length}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch Tautulli history");
      }

      const data = await response.json();
      return (data.response?.data?.data || []) as TautulliHistoryItem[];
    } catch (error) {
      console.error("[Tautulli] Error fetching history:", error);
      return [];
    }
  }

  // Calculate overall watch statistics
  function calculateWatchStats(history: TautulliHistoryItem[]): WatchStats {
    const totalMs = history.reduce(
      (sum, item) => sum + (item.duration || 0) * 1000,
      0
    );

    return {
      totalHours: Math.round(totalMs / (1000 * 60 * 60)),
      totalPlays: history.length,
      moviePlays: history.filter(item => item.media_type === "movie").length,
      episodePlays: history.filter(item => item.media_type === "episode")
        .length,
      musicPlays: history.filter(item => item.media_type === "track").length
    };
  }

  // Group plays by day
  function groupByDay(
    history: TautulliHistoryItem[],
    days: number
  ): DayStats[] {
    const now = new Date();
    const dayMap = new Map<string, { plays: number; duration: number }>();

    // Initialize all days in range
    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      dayMap.set(dateStr, { plays: 0, duration: 0 });
    }

    // Populate with actual data
    history.forEach(item => {
      const date = new Date(item.date * 1000);
      const dateStr = date.toISOString().split("T")[0];
      if (dayMap.has(dateStr)) {
        const current = dayMap.get(dateStr)!;
        current.plays += 1;
        current.duration += item.duration || 0;
      }
    });

    // Convert to array and sort by date
    return Array.from(dayMap.entries())
      .map(([date, stats]) => ({
        date,
        plays: stats.plays,
        duration: stats.duration
        // duration: Math.round(stats.duration / 60) // Convert to minutes
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  // Group plays by day of week
  function groupByDayOfWeek(history: TautulliHistoryItem[]): {
    labels: string[];
    movies: number[];
    episodes: number[];
    music: number[];
  } {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    const dayStats = new Map<
      number,
      { movies: number; episodes: number; music: number }
    >();

    // Initialize all days
    for (let i = 0; i < 7; i++) {
      dayStats.set(i, { movies: 0, episodes: 0, music: 0 });
    }

    // Populate with actual data
    history.forEach(item => {
      const date = new Date(item.date * 1000);
      const dayOfWeek = date.getDay();
      const stats = dayStats.get(dayOfWeek)!;

      if (item.media_type === "movie") {
        stats.movies += 1;
      } else if (item.media_type === "episode") {
        stats.episodes += 1;
      } else if (item.media_type === "track") {
        stats.music += 1;
      }
    });

    return {
      labels: dayNames,
      movies: dayNames.map((_, i) => dayStats.get(i)!.movies),
      episodes: dayNames.map((_, i) => dayStats.get(i)!.episodes),
      music: dayNames.map((_, i) => dayStats.get(i)!.music)
    };
  }

  // Get top watched content
  function getTopContent(history: TautulliHistoryItem[], limit: number = 10) {
    const contentMap = new Map<
      string,
      { title: string; plays: number; duration: number; type: string }
    >();

    history.forEach(item => {
      const key = item.rating_key;
      if (!contentMap.has(key)) {
        contentMap.set(key, {
          title: item.full_title || item.title,
          plays: 0,
          duration: 0,
          type: item.media_type
        });
      }
      const content = contentMap.get(key)!;
      content.plays += 1;
      content.duration += item.duration || 0;
    });

    return Array.from(contentMap.values())
      .sort((a, b) => b.plays - a.plays)
      .slice(0, limit)
      .map(item => ({
        ...item,
        duration: Math.round(item.duration / 60) // Convert to minutes
      }));
  }

  // Get hourly distribution
  function getHourlyDistribution(history: TautulliHistoryItem[]) {
    const hours = new Array(24).fill(0);

    history.forEach(item => {
      const date = new Date(item.date * 1000);
      const hour = date.getHours();
      hours[hour] += 1;
    });

    return {
      labels: hours.map((_, i) => `${i}:00`),
      data: hours
    };
  }

  return {
    fetchUserHistory,
    calculateWatchStats,
    groupByDay,
    groupByDayOfWeek,
    getTopContent,
    getHourlyDistribution
  };
}
