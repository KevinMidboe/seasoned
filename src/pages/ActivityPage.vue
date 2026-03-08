<template>
  <div class="activity">
    <h1 class="activity__title">Watch Activity</h1>

    <!-- Stats Overview -->
    <stats-overview :watch-stats="watchStats" />

    <div class="controls">
      <div class="control-group">
        <label class="control-label">Time Range</label>
        <div class="input-wrapper">
          <input
            v-model.number="days"
            class="days-input"
            type="number"
            min="1"
            max="365"
            @change="fetchChartData"
          />
          <span class="input-suffix">days</span>
        </div>
      </div>

      <div class="control-group">
        <label class="control-label">View Mode</label>
        <toggle-button
          v-model:selected="graphViewMode"
          :options="[GraphTypes.Plays, GraphTypes.Duration]"
          @change="fetchChartData"
        />
      </div>
    </div>

    <div class="activity__charts">
      <div class="chart-card">
        <h3>Daily Activity</h3>
        <div class="chart-card__graph">
          <Graph
            v-if="playsByDayData"
            :data="playsByDayData"
            type="line"
            :stacked="false"
            :dataset-description-suffix="`watch last ${days} days`"
            :tooltip-description-suffix="selectedGraphViewMode.tooltipLabel"
            :graph-value-type="graphViewMode"
          />
        </div>
      </div>

      <div class="chart-card">
        <h3>Activity by Media Type</h3>
        <div class="chart-card__graph">
          <Graph
            v-if="playsByDayofweekData"
            :data="playsByDayofweekData"
            :graphValueType="graphViewMode"
            type="bar"
            :stacked="true"
            :dataset-description-suffix="`watch last ${days} days`"
            tooltip-description-suffix="plays"
          />
        </div>
      </div>

      <div class="chart-card">
        <h3>Viewing Patterns by Hour</h3>
        <div class="chart-card__graph">
          <Graph
            v-if="hourlyData"
            :data="hourlyData"
            type="bar"
            :stacked="false"
            :dataset-description-suffix="`last ${days} days`"
            tooltip-description-suffix="plays"
            :graph-value-type="graphViewMode"
          />
        </div>
      </div>
    </div>

    <!-- Top Content -->
    <watch-history :top-content="topContent" />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  import Graph from "@/components/Graph.vue";
  import ToggleButton from "@/components/ui/ToggleButton.vue";
  import StatsOverview from "@/components/activity/StatsOverview.vue";
  import WatchHistory from "@/components/activity/WatchHistory.vue";
  import {
    fetchHomeStats,
    fetchPlaysByDate,
    fetchPlaysByDayOfWeek,
    fetchPlaysByHourOfDay
  } from "../composables/useTautulliStats";
  import {
    GraphTypes,
    GraphValueTypes,
    IGraphData
  } from "../interfaces/IGraph";
  import type { Ref } from "vue";
  import type { WatchStats } from "../composables/useTautulliStats";

  const days: Ref<number> = ref(30);
  const graphViewMode: Ref<GraphTypes> = ref(GraphTypes.Plays);

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

  function convertDateStringToDayMonth(date: string, short = true): string {
    if (!date.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)) {
      return date;
    }

    const [year, month, day] = date.split("-");
    return short ? `${month}.${day}` : `${day}.${month}.${year}`;
  }

  function activityPerDay(dataPromise: Promise<any>) {
    dataPromise.then(dayData => {
      playsByDayData.value = {
        labels: dayData.map(d =>
          convertDateStringToDayMonth(d.date, dayData.length < 365)
        ),
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
    });
  }

  function playsByDayOfWeek(dataPromise: Promise<any>) {
    dataPromise.then(weekData => {
      playsByDayofweekData.value = {
        labels: weekData.labels,
        series: [
          { name: "Movies", data: weekData.movies },
          { name: "Episodes", data: weekData.episodes },
          { name: "Music", data: weekData.music }
        ]
      };
    });
  }

  function hourly(hourlyPromise: Promise<any>) {
    hourlyPromise.then(hourData => {
      hourlyData.value = {
        labels: hourData.labels,
        series: [{ name: "Plays", data: hourData.data }]
      };
    });
  }

  async function fetchChartData() {
    try {
      const yAxis =
        graphViewMode.value === GraphTypes.Plays ? "plays" : "duration";

      // Fetch all data in parallel using efficient Tautulli APIs
      fetchHomeStats(days.value, "duration").then(
        (homeStats: WatchStats) => (watchStats.value = homeStats)
      );

      // Activity per day (line graph of last n days)
      activityPerDay(fetchPlaysByDate(days.value, yAxis));

      // Activity by day of week (stacked by media type)
      playsByDayOfWeek(fetchPlaysByDayOfWeek(days.value, yAxis));

      // Hourly distribution
      hourly(fetchPlaysByHourOfDay(days.value, yAxis));
    } catch (error) {
      console.error("[ActivityPage] Error fetching chart data:", error);
    }
  }

  onMounted(fetchChartData);
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .activity {
    padding: 3rem;
    max-width: 100%;

    @include mobile-only {
      padding: 0.75rem;
    }

    &__title {
      margin: 0 0 2rem 0;
      font-size: 2rem;
      font-weight: 300;
      color: $text-color;
      line-height: 1;

      @include mobile-only {
        font-size: 1.5rem;
        margin: 1rem 0;
      }
    }

    &__charts {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      @include mobile-only {
        gap: 1rem;
      }
    }
  }

  .chart-card {
    background: var(--background-ui);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid var(--text-color-50);

    @include mobile-only {
      padding: 1rem;
    }

    h3 {
      margin: 0 0 1rem 0;
      font-size: 1.2rem;
      font-weight: 500;
      color: $text-color;

      @include mobile-only {
        font-size: 1rem;
      }
    }

    &__graph {
      position: relative;
      height: 35vh;
      min-height: 300px;

      @include mobile-only {
        height: 30vh;
        min-height: 250px;
      }
    }
  }

  .controls {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;

    @include mobile-only {
      flex-direction: column;
      gap: 1rem;
    }
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 200px;

    @include mobile-only {
      min-width: 0;
      width: 100%;
    }
  }

  .control-label {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-color-60);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    background: var(--background-ui);
    border: 1px solid var(--text-color-50);
    border-radius: 8px;
    overflow: hidden;
    transition: border-color 0.2s;

    &:hover,
    &:focus-within {
      border-color: var(--text-color);
    }
  }

  .days-input {
    flex: 1;
    background: transparent;
    border: none;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    color: $text-color;
    outline: none;
    width: 80px;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      opacity: 1;
    }
  }

  .input-suffix {
    padding: 0 1rem;
    font-size: 0.9rem;
    color: var(--text-color-60);
    user-select: none;
  }
</style>
