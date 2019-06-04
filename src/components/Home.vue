<template>
  <section>
    <LandingBanner />

    <movies-list v-for="item in homepageLists" :propList="item" :shortList="true"></movies-list>
  </section>
</template>

<script>
import storage from '../storage.js'
import LandingBanner from '@/components/LandingBanner.vue'
import MoviesList from './MoviesList.vue'

export default {
  name: 'home',
  components: { LandingBanner, MoviesList },
  data(){
    return {
      homepageLists: storage.homepageLists,
      imageFile: 'dist/pulp-fiction.jpg'
    }
  },
  created(){
    document.title = 'TMDb';
    storage.backTitle = document.title;
  }
}
</script>