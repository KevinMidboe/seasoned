<template>
  <div class="container info">
    <movie :id="$route.params.id" :type="'page'"></movie>
  </div>
</template>

<script>
import Movie from './Movie';
export default {
  components: { Movie }
}
</script>
