<template>
  <div class="wrapper" v-if="plexId">
    <h1>Your watch activity</h1>

    <div style="display: flex; flex-direction: row">
      <label class="filter">
        <span>Days:</span>
        <input
          class="dayinput"
          v-model="days"
          placeholder="number of days"
          type="number"
          pattern="[0-9]*"
          :style="{ maxWidth: `${3 + 0.5 * days.length}rem` }"
        />
      </label>

      <label class="filter">
        <span>Data sorted by:</span>
        <toggle-button
          class="filter-item"
          :options="chartTypes"
          :selected.sync="selectedChartDataType"
        />
      </label>
    </div>

    <div class="chart-section">
      <h3 class="chart-header">Activity per day:</h3>
      <div class="chart">
        <canvas ref="activityCanvas"></canvas>
      </div>

      <h3 class="chart-header">Activity per day of week:</h3>
      <div class="chart">
        <canvas ref="playsByDayOfWeekCanvas"></canvas>
      </div>
    </div>
  </div>
  <div v-else>
    <h1>Must be authenticated</h1>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ToggleButton from "@/components/ui/ToggleButton";
import { fetchChart } from "@/api";

var Chart = require("chart.js");
Chart.defaults.global.elements.point.radius = 0;
Chart.defaults.global.elements.point.hitRadius = 10;
Chart.defaults.global.elements.point.pointHoverRadius = 10;
Chart.defaults.global.elements.point.hoverBorderWidth = 4;

export default {
  components: { ToggleButton },
  data() {
    return {
      days: 30,
      selectedChartDataType: "plays",
      charts: [
        {
          name: "Watch activity",
          ref: "activityCanvas",
          data: null,
          urlPath: "/plays_by_day",
          graphType: "line"
        },
        {
          name: "Plays by day of week",
          ref: "playsByDayOfWeekCanvas",
          data: null,
          urlPath: "/plays_by_dayofweek",
          graphType: "bar"
        }
      ],
      chartData: [
        {
          type: "plays",
          tooltipLabel: "Play count"
        },
        {
          type: "duration",
          tooltipLabel: "Watched duration",
          valueConvertFunction: this.convertSecondsToHumanReadable
        }
      ],
      gridColor: getComputedStyle(document.documentElement).getPropertyValue(
        "--text-color-5"
      )
    };
  },
  computed: {
    ...mapGetters("user", ["plexId"]),
    chartTypes() {
      return this.chartData.map(chart => chart.type);
    },
    selectedChartType() {
      return this.chartData.filter(
        data => data.type == this.selectedChartDataType
      )[0];
    }
  },
  watch: {
    days(newValue) {
      if (newValue !== "") {
        this.fetchChartData(this.charts);
      }
    },
    selectedChartDataType(selectedChartDataType) {
      this.fetchChartData(this.charts);
    },
    plexId(newValue) {
      if (newValue) return this.fetchChartData(this.charts);
    }
  },
  beforeMount() {
    if (typeof this.days == "number") {
      this.days = this.days.toString();
    }
  },
  methods: {
    fetchChartData(charts) {
      if (!this.plexId) {
        console.log("NF plexID:", this.plexId);
        return;
      }

      for (let chart of charts) {
        fetchChart(chart.urlPath, this.days, this.selectedChartType.type).then(
          data => {
            this.series = data.data.series.filter(
              group => group.name === "TV"
            )[0].data; // plays pr date in groups (movie/tv/music)
            this.categories = data.data.categories; // dates

            const x_labels = data.data.categories.map(date => {
              if (date.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)) {
                const [year, month, day] = date.split("-");
                return `${day}.${month}`;
              }

              return date;
            });
            let y_activityMovies = data.data.series.filter(
              group => group.name === "Movies"
            )[0].data;
            let y_activityTV = data.data.series.filter(
              group => group.name === "TV"
            )[0].data;

            const datasets = [
              {
                label: `Movies watch last ${this.days} days`,
                data: y_activityMovies,
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1
              },
              {
                label: `Shows watch last ${this.days} days`,
                data: y_activityTV,
                backgroundColor: "rgba(255, 159, 64, 0.2)",
                borderColor: "rgba(255, 159, 64, 1)",
                borderWidth: 1
              }
            ];

            if (chart.data == null) {
              this.generateChart(chart, x_labels, datasets);
            } else {
              chart.data.clear();
              chart.data.data.labels = x_labels;
              chart.data.data.datasets = datasets;
              chart.data.update();
            }
          }
        );
      }
    },
    generateChart(chart, labels, datasets) {
      const chartInstance = new Chart(this.$refs[chart.ref], {
        type: chart.graphType,
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
          // hitRadius: 8,
          maintainAspectRatio: false,
          tooltips: {
            callbacks: {
              title: (tooltipItem, data) =>
                `Watch date: ${tooltipItem[0].label}`,
              label: (tooltipItem, data) => {
                let label = data.datasets[tooltipItem.datasetIndex].label;
                let value = tooltipItem.value;
                let text = "Duration watched";

                const context = label.split(" ")[0];
                if (context) {
                  text = `${context} ${this.selectedChartType.tooltipLabel.toLowerCase()}`;
                }

                if (this.selectedChartType.valueConvertFunction) {
                  value = this.selectedChartType.valueConvertFunction(
                    tooltipItem.value
                  );
                }

                return ` ${text}: ${value}`;
              }
            }
          },
          scales: {
            yAxes: [
              {
                gridLines: {
                  color: this.gridColor
                },
                stacked: chart.graphType === "bar",
                ticks: {
                  // suggestedMax: 10000,
                  callback: (value, index, values) => {
                    if (this.selectedChartType.valueConvertFunction) {
                      return this.selectedChartType.valueConvertFunction(
                        value,
                        values
                      );
                    }
                    return value;
                  },
                  beginAtZero: true
                }
              }
            ],
            xAxes: [
              {
                stacked: chart.graphType === "bar",
                gridLines: {
                  display: false
                }
              }
            ]
          }
        }
      });

      chart.data = chartInstance;
    },
    convertSecondsToHumanReadable(value, values = null) {
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
  }
};
</script>

<style lang="scss" scoped>
@import "./src/scss/variables";

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
    max-width: 3rem;
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

  .chart {
    position: relative;
    height: 35vh;
    width: 90vw;
    margin-bottom: 2rem;
  }

  .chart-header {
    font-weight: 300;
  }
}
</style>
