<template>
  <div class="container info">
    <!--    <movie :id="$route.params.id" :type="'page'"></movie> -->
    <LargeMovie :id"$route.params.id"></LargeMovie>
  </div>
</template>

<script>
import Movie from './Movie.vue';
import LargeMovie from './LargeMovie.vue';
export default {
  components: { Movie, LargeMovie }
}
</script>
