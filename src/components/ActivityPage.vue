<template>
  <div class="wrapper">
    <h1>Your activity</h1>

    Number of days: <input v-model="days" placeholder="number of days" type="number" />

    <div class="chart-section">
      <div class="chart">
        <canvas ref="activityCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
var Chart = require('chart.js');

export default {
  data() {
    return {
      days: 30,
      series: undefined,
      categories: undefined,
      activityChart: undefined
    }
  },
  watch: {
    days: function(newValue) {
      if (newValue !== '')
        this.fetchActivity()
    }
  },
  beforeMount() {
    this.fetchActivity()
  },
  methods: {
    generateChart(canvas, labels, datasets) {
      this.activityChart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
          maintainAspectRatio: false,
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
        }
      });
    },
    fetchActivity() {
      const url = new URL('api/v1/user/plays_by_day', 'http://localhost:31459')
      url.searchParams.append('days', this.days)

      const headers = {
        authorization: localStorage.getItem('token')
      }

      fetch(url.href, { headers })
        .then(resp => resp.json())
        .then(data => {
          console.log('data from plays by day', data)

          this.series = data.data.series.filter(group => group.name === 'TV')[0].data;      // plays pr date in groups (movie/tv/music)
          this.categories = data.data.categories;  // dates

          const x_labels = data.data.categories.map(date => date.replace('2019-', ''))
          const y_activityMovies = data.data.series.filter(group => group.name === 'Movies')[0].data
          const y_activityTV = data.data.series.filter(group => group.name === 'TV')[0].data

          const datasets = [{
              label: `Movies watch last ${ this.days } days`,
              data: y_activityMovies,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            },
            {
              label: `Shows watch last ${ this.days } days`,
              data: y_activityTV,
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1
            }
          ]

          if (this.activityChart === undefined) {
            this.generateChart(this.$refs.activityCanvas, x_labels, datasets)
          } else {
            console.log('this.act', this.activityChart.data)
            this.activityChart.data.labels = x_labels;
            this.activityChart.data.datasets = datasets;
            this.activityChart.update();
          }

        })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 2rem;
}

.chart-section {
  display: flex;
  flex-wrap: wrap;

  .chart {
    position: relative;
    height: 50vh;
    width: 90vw;
  }
}

</style>