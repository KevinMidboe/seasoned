const TAUTULLI_API_KEY = "28494032b47542278fe76c6ccd1f0619";
const TAUTULLI_BASE_URL = "http://plex.schleppe:8181/api/v2";

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

interface HomeStatItem {
  rating_key: number;
  title: string;
  total_plays?: number;
  total_duration?: number;
  users_watched?: string;
  last_play?: number;
  grandparent_thumb?: string;
  thumb?: string;
  content_rating?: string;
  labels?: string[];
  media_type?: string;
}

interface PlaysGraphData {
  categories: string[];
  series: Array<{
    name: string;
    data: number[];
  }>;
}

export function useTautulliStats() {
  // Helper function to make Tautulli API calls
  async function tautulliRequest(
    cmd: string,
    params: Record<string, any> = {}
  ) {
    try {
      const queryParams = new URLSearchParams({
        apikey: TAUTULLI_API_KEY,
        cmd,
        ...params
      });

      const url = `${TAUTULLI_BASE_URL}?${queryParams}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Tautulli API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.response?.result !== "success") {
        throw new Error(data.response?.message || "Unknown API error");
      }

      return data.response.data;
    } catch (error) {
      console.error(`[Tautulli] Error with ${cmd}:`, error);
      throw error;
    }
  }

  // Fetch home statistics (pre-aggregated by Tautulli!)
  async function fetchHomeStats(
    userId?: number,
    timeRange: number = 30,
    statsType: "plays" | "duration" = "plays"
  ): Promise<WatchStats> {
    try {
      const params: Record<string, any> = {
        time_range: timeRange,
        stats_type: statsType,
        grouping: 0
      };

      if (userId) {
        params.user_id = userId;
      }

      const stats = await tautulliRequest("get_home_stats", params);

      // Extract stats from the response
      let totalPlays = 0;
      let totalHours = 0;
      let moviePlays = 0;
      let episodePlays = 0;
      let musicPlays = 0;

      // Find the relevant stat sections
      const topMovies = stats.find((s: any) => s.stat_id === "top_movies");
      const topTV = stats.find((s: any) => s.stat_id === "top_tv");
      const topMusic = stats.find((s: any) => s.stat_id === "top_music");

      if (topMovies?.rows) {
        moviePlays = topMovies.rows.reduce(
          (sum: number, item: any) => sum + (item.total_plays || 0),
          0
        );
      }

      if (topTV?.rows) {
        episodePlays = topTV.rows.reduce(
          (sum: number, item: any) => sum + (item.total_plays || 0),
          0
        );
      }

      if (topMusic?.rows) {
        musicPlays = topMusic.rows.reduce(
          (sum: number, item: any) => sum + (item.total_plays || 0),
          0
        );
      }

      totalPlays = moviePlays + episodePlays + musicPlays;

      // Calculate total hours from duration
      if (statsType === "duration") {
        const totalDuration = [topMovies, topTV, topMusic].reduce(
          (sum, stat) => {
            if (!stat?.rows) return sum;
            return (
              sum +
              stat.rows.reduce(
                (s: number, item: any) => s + (item.total_duration || 0),
                0
              )
            );
          },
          0
        );
        totalHours = Math.round(totalDuration / 3600); // Convert seconds to hours
      }

      return {
        totalHours,
        totalPlays,
        moviePlays,
        episodePlays,
        musicPlays
      };
    } catch (error) {
      console.error("[Tautulli] Error fetching home stats:", error);
      return {
        totalHours: 0,
        totalPlays: 0,
        moviePlays: 0,
        episodePlays: 0,
        musicPlays: 0
      };
    }
  }

  // Fetch plays by date (already aggregated by Tautulli!)
  async function fetchPlaysByDate(
    timeRange: number = 30,
    yAxis: "plays" | "duration" = "plays",
    userId?: number
  ): Promise<DayStats[]> {
    try {
      const params: Record<string, any> = {
        time_range: timeRange,
        y_axis: yAxis,
        grouping: 0
      };

      if (userId) {
        params.user_id = userId;
      }

      const data: PlaysGraphData = await tautulliRequest(
        "get_plays_by_date",
        params
      );

      // Sum all series data for each date
      return data.categories.map((date, index) => {
        const totalValue = data.series.reduce(
          (sum, series) => sum + (series.data[index] || 0),
          0
        );

        return {
          date,
          plays: yAxis === "plays" ? totalValue : 0,
          duration: yAxis === "duration" ? totalValue : 0
        };
      });
    } catch (error) {
      console.error("[Tautulli] Error fetching plays by date:", error);
      return [];
    }
  }

  // Fetch plays by day of week (already aggregated!)
  async function fetchPlaysByDayOfWeek(
    timeRange: number = 30,
    yAxis: "plays" | "duration" = "plays",
    userId?: number
  ): Promise<{
    labels: string[];
    movies: number[];
    episodes: number[];
    music: number[];
  }> {
    try {
      const params: Record<string, any> = {
        time_range: timeRange,
        y_axis: yAxis,
        grouping: 0
      };

      if (userId) {
        params.user_id = userId;
      }

      const data: PlaysGraphData = await tautulliRequest(
        "get_plays_by_dayofweek",
        params
      );

      // Map series names to our expected format
      const movies =
        data.series.find(s => s.name === "Movies")?.data ||
        new Array(7).fill(0);
      const episodes =
        data.series.find(s => s.name === "TV")?.data || new Array(7).fill(0);
      const music =
        data.series.find(s => s.name === "Music")?.data || new Array(7).fill(0);

      return {
        labels: data.categories,
        movies,
        episodes,
        music
      };
    } catch (error) {
      console.error("[Tautulli] Error fetching plays by day of week:", error);
      return {
        labels: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        movies: new Array(7).fill(0),
        episodes: new Array(7).fill(0),
        music: new Array(7).fill(0)
      };
    }
  }

  // Fetch plays by hour of day (already aggregated!)
  async function fetchPlaysByHourOfDay(
    timeRange: number = 30,
    yAxis: "plays" | "duration" = "plays",
    userId?: number
  ): Promise<{ labels: string[]; data: number[] }> {
    try {
      const params: Record<string, any> = {
        time_range: timeRange,
        y_axis: yAxis,
        grouping: 0
      };

      if (userId) {
        params.user_id = userId;
      }

      const data: PlaysGraphData = await tautulliRequest(
        "get_plays_by_hourofday",
        params
      );

      // Sum all series data for each hour
      const hourlyData = data.categories.map((hour, index) => {
        return data.series.reduce(
          (sum, series) => sum + (series.data[index] || 0),
          0
        );
      });

      return {
        labels: data.categories.map(h => `${h}:00`),
        data: hourlyData
      };
    } catch (error) {
      console.error("[Tautulli] Error fetching plays by hour:", error);
      return {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        data: new Array(24).fill(0)
      };
    }
  }

  // Fetch top watched content from home stats
  async function fetchTopContent(
    timeRange: number = 30,
    limit: number = 10,
    userId?: number
  ) {
    try {
      const params: Record<string, any> = {
        time_range: timeRange,
        stats_type: "plays",
        stats_count: limit,
        grouping: 0
      };

      if (userId) {
        params.user_id = userId;
      }

      const stats = await tautulliRequest("get_home_stats", params);

      // Get "last_watched" stat which contains recent items
      const lastWatched = stats.find((s: any) => s.stat_id === "last_watched");

      if (!lastWatched?.rows) {
        return [];
      }

      return lastWatched.rows.slice(0, limit).map((item: any) => ({
        title: item.title || item.full_title || "Unknown",
        plays: item.total_plays || 0,
        duration: Math.round((item.total_duration || 0) / 60), // Convert to minutes
        type: item.media_type || "unknown"
      }));
    } catch (error) {
      console.error("[Tautulli] Error fetching top content:", error);
      return [];
    }
  }

  return {
    fetchHomeStats,
    fetchPlaysByDate,
    fetchPlaysByDayOfWeek,
    fetchPlaysByHourOfDay,
    fetchTopContent
  };
}
