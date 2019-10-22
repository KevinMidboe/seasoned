<template> 
  <ul class="results" :class="{'shortList': shortList}">
    <movies-list-item v-for='movie in results' :movie="movie" />
  </ul>
</template>


<script>
import MoviesListItem from '@/components/MoviesListItem'

export default {
  components: { MoviesListItem },
  props: {
    results: {
      type: Array,
      required: true
    },
    shortList: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}  
</script>


<style lang="scss" scoped>
@import './src/scss/media-queries';

.results {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  list-style: none;

  &.shortList > li {
    display: none;

    &:nth-child(-n+4) {
      display: block;
    }
  }
}

@include tablet-min {
  .results.shortList > li:nth-child(-n+6) {
    display: block;
  }
}
@include tablet-landscape-min {
  .results.shortList > li:nth-child(-n+8) {
    display: block;
  }
}
@include desktop-min {
  .results.shortList > li:nth-child(-n+10) {
    display: block;
  }
}
@include desktop-lg-min {
  .results.shortList > li:nth-child(-n+16) {
    display: block;
  }
}

</style>