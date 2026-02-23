<template>
  <div v-if="plexUserId" class="wrapper">
    <h1>Your watch activity</h1>

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

      <h3 class="chart-header">Activity per day of week:</h3>
      <div class="graph">
        <Graph
          v-if="playsByDayofweekData"
          :data="playsByDayofweekData"
          type="bar"
          :stacked="true"
          :dataset-description-suffix="`watch last ${days} days`"
          :tooltip-description-suffix="selectedGraphViewMode.tooltipLabel"
          :graph-value-type="selectedGraphViewMode.valueType"
        />
      </div>
    </div>
  </div>
  <div v-else class="not-authenticated">
    <h1><IconStop /> Must be authenticated</h1>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from "vue";
  import { useStore } from "vuex";
  import Graph from "@/components/Graph.vue";
  import ToggleButton from "@/components/ui/ToggleButton.vue";
  import IconStop from "@/icons/IconStop.vue";
  import type { Ref } from "vue";
  import { fetchGraphData } from "../api";
  import {
    GraphTypes,
    GraphValueTypes,
    IGraphData
  } from "../interfaces/IGraph";

  const store = useStore();

  const days: Ref<number> = ref(30);
  const graphViewMode: Ref<GraphTypes> = ref(GraphTypes.Plays);
  const plexUserId = computed(() => store.getters["user/plexUserId"]);

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

  const selectedGraphViewMode = computed(() =>
    graphValueViewMode.find(viewMode => viewMode.type === graphViewMode.value)
  );

  function convertDateStringToDayMonth(date: string): string {
    if (!date.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)) {
      return date;
    }

    const [, month, day] = date.split("-");
    return `${day}.${month}`;
  }

  function convertDateLabels(data) {
    return {
      labels: data.categories.map(convertDateStringToDayMonth),
      series: data.series
    };
  }

  async function fetchPlaysByDay() {
    playsByDayData.value = await fetchGraphData(
      "plays_by_day",
      days.value,
      graphViewMode.value
    ).then(data => convertDateLabels(data?.data));
  }

  async function fetchPlaysByDayOfWeek() {
    playsByDayofweekData.value = await fetchGraphData(
      "plays_by_dayofweek",
      days.value,
      graphViewMode.value
    ).then(data => convertDateLabels(data?.data));
  }

  function fetchChartData() {
    fetchPlaysByDay();
    fetchPlaysByDayOfWeek();
  }

  fetchChartData();
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

  .not-authenticated {
    padding: 2rem;

    h1 {
      display: flex;
      align-items: center;
      font-size: 3rem;

      svg {
        margin-right: 1rem;
        height: 3rem;
        width: 3rem;
      }
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
