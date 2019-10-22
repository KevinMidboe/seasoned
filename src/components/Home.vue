<template>
  <section>
    <LandingBanner />

    <div v-for="list in lists">
      <list-header :title="list.title" :link="'/list/' + list.route" />

      <results-list :results="list.data" :shortList="true" />
      <loader v-if="!list.data.length" />
    </div>
  </section>
</template>

<script>
import LandingBanner from '@/components/LandingBanner.vue'
import ListHeader from '@/components/ListHeader.vue'
import ResultsList from '@/components/ResultsList.vue'
import Loader from '@/components/ui/Loader.vue'

import { getTmdbMovieListByName, getRequests } from '@/api'

export default {
  name: 'home',
  components: { LandingBanner, ResultsList, ListHeader, Loader },
  data(){
    return {
      imageFile: 'dist/pulp-fiction.jpg',
      requests: [],
      nowplaying: [],
      upcoming: [],
      popular: []
    }
  },
  computed: {
    lists() {
      return [
        {
          title: 'Requests',
          route: 'request',
          data: this.requests
        },
        {
          title: 'Now playing',
          route: 'now_playing',
          data: this.nowplaying
        },
        {
          title: 'Upcoming',
          route: 'upcoming',
          data: this.upcoming
        },
        {
          title: 'Popular',
          route: 'popular',
          data: this.popular
        }
      ]
    }
  },
  methods: {
    fetchRequests() {
      getRequests()
        .then(results => this.requests = results.results)
    },
    fetchNowPlaying() {
      getTmdbMovieListByName('now_playing')
        .then(results => this.nowplaying = results.results)
    },
    fetchUpcoming() {
      getTmdbMovieListByName('upcoming')
        .then(results => this.upcoming = results.results)
    },
    fetchPopular() {
      getTmdbMovieListByName('popular')
        .then(results => this.popular = results.results)
    }
  },
  created(){
    this.fetchRequests()
    this.fetchNowPlaying()
    this.fetchUpcoming()
    this.fetchPopular()
  }
}
</script>
