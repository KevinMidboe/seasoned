<template>
  <canvas ref="graphCanvas"></canvas>
</template>

<script setup lang="ts">
  import { ref, computed, defineProps, onMounted, watch } from "vue";
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
    ChartType
  } from "chart.js";

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
    Tooltip
  );
  import {} from "chart.js";
  import type { Ref } from "vue";

  enum GraphValueTypes {
    Number = "number",
    Time = "time"
  }

  interface IGraphDataset {
    name: string;
    data: Array<number>;
  }

  interface IGraphData {
    labels: Array<string>;
    series: Array<IGraphDataset>;
  }

  interface Props {
    name?: string;
    data: IGraphData;
    type: ChartType;
    stacked: boolean;

    datasetDescriptionSuffix: string;
    tooltipDescriptionSuffix: string;
    graphValueType?: GraphValueTypes;
  }

  Chart.defaults.elements.point.radius = 0;
  Chart.defaults.elements.point.hitRadius = 10;
  // Chart.defaults.elements.point.pointHoverRadius = 10;
  Chart.defaults.elements.point.hoverBorderWidth = 4;

  const props = defineProps<Props>();
  const graphCanvas: Ref<HTMLCanvasElement> = ref(null);
  let graphInstance = null;

  onMounted(() => generateGraph());
  watch(() => props.data, generateGraph);

  const graphTemplates = [
    {
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
      tension: 0.4
    },
    {
      backgroundColor: "rgba(255, 159, 64, 0.2)",
      borderColor: "rgba(255, 159, 64, 1)",
      borderWidth: 1,
      tension: 0.4
    },
    {
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
      tension: 0.4
    }
  ];
  const gridColor = getComputedStyle(document.documentElement).getPropertyValue(
    "--text-color-5"
  );

  function hydrateGraphLineOptions(dataset: IGraphDataset, index: number) {
    return {
      label: `${dataset.name} ${props.datasetDescriptionSuffix}`,
      data: dataset.data,
      ...graphTemplates[index]
    };
  }

  function removeEmptyDataset(dataset: IGraphDataset) {
    return dataset.data.every(point => point === 0) ? false : true;
  }

  function generateGraph() {
    const datasets = props.data.series
      .filter(removeEmptyDataset)
      .map(hydrateGraphLineOptions);

    const graphOptions = {
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            // title: (tooltipItem, data) => `Watch date: ${tooltipItem[0].label}`,
            label: tooltipItem => {
              const context = tooltipItem.dataset.label.split(" ")[0];
              const text = `${context} ${props.tooltipDescriptionSuffix}`;

              let value = tooltipItem.raw;
              if (props.graphValueType === GraphValueTypes.Time) {
                value = convertSecondsToHumanReadable(value);
              }

              return ` ${text}: ${value}`;
            }
          }
        }
      },
      scales: {
        xAxes: {
          stacked: props.stacked,
          gridLines: {
            display: false
          }
        },
        yAxes: {
          stacked: props.stacked,
          ticks: {
            callback: (value, index, values) => {
              if (props.graphValueType === GraphValueTypes.Time) {
                return convertSecondsToHumanReadable(value);
              }

              return value;
            },
            beginAtZero: true
          }
        }
      }
    };

    const chartData = {
      labels: props.data.labels.toString().split(","),
      datasets
    };

    if (graphInstance) {
      graphInstance.clear();
      graphInstance.data = chartData;
      graphInstance.update("none");
      return;
    }

    graphInstance = new Chart(graphCanvas.value, {
      type: props.type,
      data: chartData,
      options: graphOptions
    });
  }

  function convertSecondsToHumanReadable(value, values = null) {
    const highestValue = values ? values[0] : value;

    // minutes
    if (highestValue < 3600) {
      const minutes = Math.floor(value / 60);

      value = `${minutes} m`;
    }
    // hours and minutes
    else if (highestValue > 3600 && highestValue < 86400) {
      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value % 3600) / 60);

      value = hours != 0 ? `${hours} h ${minutes} m` : `${minutes} m`;
    }
    // days and hours
    else if (highestValue > 86400 && highestValue < 31557600) {
      const days = Math.floor(value / 86400);
      const hours = Math.floor((value % 86400) / 3600);

      value = days != 0 ? `${days} d ${hours} h` : `${hours} h`;
    }
    // years and days
    else if (highestValue > 31557600) {
      const years = Math.floor(value / 31557600);
      const days = Math.floor((value % 31557600) / 86400);

      value = years != 0 ? `${years} y ${days} d` : `${days} d`;
    }

    return value;
  }
</script>

<style lang="scss" scoped></style>
