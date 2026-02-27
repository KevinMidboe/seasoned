<template>
  <div v-if="plexUserId && plexUsername" class="wrapper">
    <h1>Your watch activity</h1>

    <!-- Stats Overview -->
    <div v-if="watchStats" class="stats-overview">
      <div class="stat-card">
        <div class="stat-value">{{ watchStats.totalPlays }}</div>
        <div class="stat-label">Total Plays</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ watchStats.totalHours }}h</div>
        <div class="stat-label">Watch Time</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ watchStats.moviePlays }}</div>
        <div class="stat-label">Movies</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ watchStats.episodePlays }}</div>
        <div class="stat-label">Episodes</div>
      </div>
    </div>

    <div style="display: flex; flex-direction: row">
      <label class="filter" for="dayinput">
        <span>Days:</span>
        <input
          id="dayinput"
          v-model="days"
          class="dayinput"
          placeholder="days"
          type="number"
          pattern="[0-9]*"
          @change="fetchChartData"
        />
      </label>

      <div class="filter">
        <span>Data sorted by:</span>
        <toggle-button
          v-model:selected="graphViewMode"
          class="filter-item"
          :options="[GraphTypes.Plays, GraphTypes.Duration]"
          @change="fetchChartData"
        />
      </div>
    </div>

    <div class="chart-section">
      <h3 class="chart-header">Activity per day:</h3>
      <div class="graph">
        <Graph
          v-if="playsByDayData"
          :data="playsByDayData"
          type="line"
          :stacked="false"
          :dataset-description-suffix="`watch last ${days} days`"
          :tooltip-description-suffix="selectedGraphViewMode.tooltipLabel"
          :graph-value-type="selectedGraphViewMode.valueType"
        />
      </div>

      <h3 class="chart-header">Activity by media type:</h3>
      <div class="graph">
        <Graph
          v-if="playsByDayofweekData"
          :data="playsByDayofweekData"
          type="bar"
          :stacked="true"
          :dataset-description-suffix="`watch last ${days} days`"
          tooltip-description-suffix="plays"
          :graph-value-type="GraphValueTypes.Number"
        />
      </div>

      <h3 class="chart-header">Watch time by hour:</h3>
      <div class="graph">
        <Graph
          v-if="hourlyData"
          :data="hourlyData"
          type="bar"
          :stacked="false"
          :dataset-description-suffix="`last ${days} days`"
          tooltip-description-suffix="plays"
          :graph-value-type="GraphValueTypes.Number"
        />
      </div>
    </div>

    <!-- Top Content -->
    <div v-if="topContent.length > 0" class="top-content-section">
      <h3 class="chart-header">Most watched:</h3>
      <div class="top-content-list">
        <div
          v-for="(item, index) in topContent"
          :key="index"
          class="top-content-item"
        >
          <div class="content-rank">{{ index + 1 }}</div>
          <div class="content-details">
            <div class="content-title">{{ item.title }}</div>
            <div class="content-meta">
              {{ item.type }} • {{ item.plays }} plays • {{ item.duration }}min
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="not-authenticated">
    <h1><IconStop /> Must be authenticated with Plex</h1>
    <p>Go to Settings to link your Plex account</p>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  import { useStore } from "vuex";
  import Graph from "@/components/Graph.vue";
  import ToggleButton from "@/components/ui/ToggleButton.vue";
  import IconStop from "@/icons/IconStop.vue";
  import type { Ref } from "vue";
  import { useTautulliStats } from "@/composables/useTautulliStats";
  import {
    GraphTypes,
    GraphValueTypes,
    IGraphData
  } from "../interfaces/IGraph";

  const store = useStore();

  const days: Ref<number> = ref(30);
  const graphViewMode: Ref<GraphTypes> = ref(GraphTypes.Plays);
  const plexUserId = computed(() => store.getters["user/plexUserId"]);
  const plexUsername = computed(() => {
    const userData = localStorage.getItem("plex_user_data");
    if (userData) {
      try {
        return JSON.parse(userData).username;
      } catch {
        return null;
      }
    }
    return null;
  });

  const graphValueViewMode = [
    {
      type: GraphTypes.Plays,
      tooltipLabel: "play count",
      valueType: GraphValueTypes.Number
    },
    {
      type: GraphTypes.Duration,
      tooltipLabel: "watched duration",
      valueType: GraphValueTypes.Time
    }
  ];

  const playsByDayData: Ref<IGraphData> = ref(null);
  const playsByDayofweekData: Ref<IGraphData> = ref(null);
  const hourlyData: Ref<IGraphData> = ref(null);
  const watchStats = ref(null);
  const topContent = ref([]);

  const selectedGraphViewMode = computed(() =>
    graphValueViewMode.find(viewMode => viewMode.type === graphViewMode.value)
  );

  const {
    fetchUserHistory,
    calculateWatchStats,
    groupByDay,
    groupByDayOfWeek,
    getTopContent,
    getHourlyDistribution
  } = useTautulliStats();

  function convertDateStringToDayMonth(date: string): string {
    if (!date.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)) {
      return date;
    }

    const [, month, day] = date.split("-");
    return `${day}.${month}`;
  }

  async function fetchChartData() {
    if (!plexUsername.value) return;

    try {
      const history = await fetchUserHistory(plexUsername.value, days.value);

      // Calculate overall stats
      watchStats.value = calculateWatchStats(history);

      // Get top content
      topContent.value = getTopContent(history, 10);

      // Activity per day
      const dayData = groupByDay(history, days.value);
      playsByDayData.value = {
        labels: dayData.map(d => convertDateStringToDayMonth(d.date)),
        series: [
          {
            name: "Activity",
            data:
              graphViewMode.value === GraphTypes.Plays
                ? dayData.map(d => d.plays)
                : dayData.map(d => d.duration)
          }
        ]
      };

      // Activity by day of week (stacked by media type)
      const weekData = groupByDayOfWeek(history);
      playsByDayofweekData.value = {
        labels: weekData.labels,
        series: [
          { name: "Movies", data: weekData.movies },
          { name: "Episodes", data: weekData.episodes },
          { name: "Music", data: weekData.music }
        ]
      };

      // Hourly distribution
      const hourData = getHourlyDistribution(history);
      hourlyData.value = {
        labels: hourData.labels,
        series: [{ name: "Plays", data: hourData.data }]
      };
    } catch (error) {
      console.error("[ActivityPage] Error fetching chart data:", error);
    }
  }

  onMounted(() => {
    if (plexUsername.value) {
      fetchChartData();
    }
  });
</script>

<style lang="scss" scoped>
  @import "scss/variables";

  .wrapper {
    padding: 2rem;

    @include mobile-only {
      padding: 0 0.8rem;
    }
  }

  .filter {
    margin-top: 0.5rem;
    display: inline-flex;
    flex-direction: column;
    font-size: 1.2rem;

    &:not(:first-of-type) {
      margin-left: 1.25rem;
    }

    input {
      width: 100%;
      font-size: inherit;
      max-width: 6rem;
      background-color: $background-ui;
      color: $text-color;
    }

    span {
      font-size: inherit;
      line-height: 1;
      margin: 0.5rem 0;
      font-weight: 300;
    }
  }

  // .filter {
  //   display: flex;
  //   flex-direction: row;
  //   flex-wrap: wrap;
  //   align-items: center;
  //   margin-bottom: 2rem;

  //   h2 {
  //     margin-bottom: 0.5rem;
  //     width: 100%;
  //     font-weight: 400;
  //   }

  //   &-item:not(:first-of-type) {
  //     margin-left: 1rem;
  //   }

  //   .dayinput {
  //     font-size: 1.2rem;
  //     max-width: 3rem;
  //     background-color: $background-ui;
  //     color: $text-color;
  //   }
  // }

  .chart-section {
    display: flex;
    flex-wrap: wrap;

    .graph {
      position: relative;
      height: 35vh;
      width: 90vw;
      margin-bottom: 2rem;
    }

    .chart-header {
      font-weight: 300;
    }
  }

  .stats-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;

    @include mobile-only {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }

  .stat-card {
    background: var(--background-ui);
    padding: 1.5rem;
    border-radius: 12px;
    text-align: center;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-4px);
    }

    @include mobile-only {
      padding: 1rem;
    }
  }

  .stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--highlight-color);
    margin-bottom: 0.5rem;

    @include mobile-only {
      font-size: 2rem;
    }
  }

  .stat-label {
    font-size: 0.9rem;
    color: var(--text-color-60);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 300;

    @include mobile-only {
      font-size: 0.8rem;
    }
  }

  .top-content-section {
    margin-top: 3rem;
  }

  .top-content-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .top-content-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: var(--background-ui);
    padding: 1rem;
    border-radius: 8px;
    transition: background 0.2s;

    &:hover {
      background: var(--background-40);
    }
  }

  .content-rank {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--highlight-color);
    min-width: 2.5rem;
    text-align: center;
  }

  .content-details {
    flex: 1;
  }

  .content-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 0.25rem;
  }

  .content-meta {
    font-size: 0.85rem;
    color: var(--text-color-60);
  }

  .not-authenticated {
    padding: 2rem;
    text-align: center;

    h1 {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      margin-bottom: 1rem;

      svg {
        margin-right: 1rem;
        height: 3rem;
        width: 3rem;
      }
    }

    p {
      font-size: 1.2rem;
      color: var(--text-color-60);
    }

    @include mobile {
      padding: 1rem;
      padding-right: 0;

      h1 {
        font-size: 1.65rem;

        svg {
          margin-right: 1rem;
          height: 2rem;
          width: 2rem;
        }
      }
    }
  }
</style>
