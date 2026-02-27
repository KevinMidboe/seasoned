<template>
  <div class="graph-wrapper">
    <canvas ref="graphCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, onBeforeUnmount } from "vue";
  import {
    Chart,
    LineElement,
    BarElement,
    PointElement,
    LineController,
    BarController,
    LinearScale,
    CategoryScale,
    Legend,
    Title,
    Tooltip,
    Filler,
    ChartType
  } from "chart.js";
  import type { BarOptions, ChartOptions } from "chart.js";

  import type { Ref } from "vue";
  import { convertSecondsToHumanReadable } from "../utils";
  import { GraphTypes, GraphValueTypes } from "../interfaces/IGraph";
  import type { IGraphDataset, IGraphData } from "../interfaces/IGraph";

  Chart.register(
    LineElement,
    BarElement,
    PointElement,
    LineController,
    BarController,
    LinearScale,
    CategoryScale,
    Legend,
    Title,
    Tooltip,
    Filler
  );

  interface Props {
    name?: string;
    data: IGraphData;
    type: ChartType;
    stacked: boolean;
    datasetDescriptionSuffix: string;
    tooltipDescriptionSuffix: string;
    graphValueType?: GraphValueTypes;
  }

  const props = defineProps<Props>();
  const graphCanvas: Ref<HTMLCanvasElement | null> = ref(null);
  let graphInstance: Chart | null = null;

  /*
|--------------------------------------------------------------------------
| Modern Color System
|--------------------------------------------------------------------------
*/

  const graphTemplates = [
    {
      borderColor: "#6366F1",
      backgroundColor: "rgba(99,102,241,0.12)"
    },
    {
      borderColor: "#F59E0B",
      backgroundColor: "rgba(245,158,11,0.12)"
    },
    {
      borderColor: "#10B981",
      backgroundColor: "rgba(16,185,129,0.12)"
    }
  ];

  /*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

  onMounted(() => generateGraph());
  watch(() => props.data, generateGraph, { deep: true });

  onBeforeUnmount(() => {
    if (graphInstance) graphInstance.destroy();
  });

  /*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

  function removeEmptyDataset(dataset: IGraphDataset) {
    return dataset;
    return !dataset.data.every(point => point === 0);
  }

  function hydrateDataset(dataset: IGraphDataset, index: number) {
    const base = graphTemplates[index % graphTemplates.length];

    if (props.type === "bar") {
      return {
        label: `${dataset.name} ${props.datasetDescriptionSuffix}`,
        data: dataset.data,
        backgroundColor: base.borderColor,
        inflateAmount: 0,
        borderRadius: {
          topLeft: 8,
          topRight: 8,
          bottomLeft: 8,
          bottomRight: 8
        },

        borderSkipped: false,
        borderWidth: 2,
        borderColor: "transparent",

        // Slight spacing between categories
        barPercentage: 0.8,
        categoryPercentage: 0.9
      } as BarOptions;
    }

    // Line chart — subtle, minimal points
    return {
      label: `${dataset.name} ${props.datasetDescriptionSuffix}`,
      data: dataset.data,
      borderColor: base.borderColor,
      backgroundColor: base.backgroundColor,
      borderWidth: 2,
      tension: 0.35,
      fill: true,

      pointRadius: 2,
      pointHoverRadius: 5,
      pointHitRadius: 12,
      pointBackgroundColor: base.borderColor,
      pointBorderColor: base.borderColor,
      pointBorderWidth: 0
    };
  }

  /*
|--------------------------------------------------------------------------
| Chart Generator
|--------------------------------------------------------------------------
*/

  function generateGraph() {
    if (!graphCanvas.value) return;

    const datasets = props.data.series
      .filter(removeEmptyDataset)
      .map(hydrateDataset);

    const chartData = {
      labels: props.data.labels,
      datasets
    };

    const options: ChartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      layout: {
        padding: { top: 8 }
      },
      plugins: {
        legend: {
          display: true
        },

        tooltip: {
          backgroundColor: "#111827",
          bodyColor: "#e5e7eb",
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: (tooltipItem: any) => {
              const context = tooltipItem.dataset.label.split(" ")[0];

              let type = GraphTypes.Plays;
              let value = tooltipItem.raw;
              if (props.graphValueType === String(GraphTypes.Duration)) {
                value = convertSecondsToHumanReadable(value);
                type = GraphTypes.Duration;
              }

              const text = `${context} ${type}`;
              return `${text}: ${value}`;
            }
          }
        }
      },

      scales: {
        x: {
          stacked: props.stacked,
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            color: "#9CA3AF",
            font: { size: 11 }
          }
        },

        y: {
          stacked: props.stacked,
          beginAtZero: true,
          grid: {
            color: "rgba(0,0,0,0.04)",
            drawBorder: false
          },
          ticks: {
            color: "#9CA3AF",
            font: { size: 11 },
            padding: 8,
            callback: (value: number) => {
              if (props.graphValueType === String(GraphTypes.Duration)) {
                return convertSecondsToHumanReadable(value);
              }
              return value;
            }
          }
        }
      }
    };

    if (graphInstance) {
      graphInstance.data = chartData;
      graphInstance.update();
      return;
    }

    graphInstance = new Chart(graphCanvas.value, {
      type: props.type,
      data: chartData,
      options
    });
  }
</script>

<style scoped lang="scss">
  .graph-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 240px;
  }
</style>
