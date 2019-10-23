<template>
  <header :class="{ 'sticky': sticky }">
    <h2>{{ title }}</h2>

    <span v-if="info" class="result-count">{{ info }}</span>
    <router-link v-else-if="link" :to="link" class='view-more'>
      View All
    </router-link>
  </header>  
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    sticky: {
      type: Boolean,
      required: false,
      default: false
    },
    info: {
      type: String,
      required: false
    },
    link: {
      type: String,
      required: false
    }
  }
}
</script>


<style lang="scss" scoped>
@import './src/scss/variables';
@import './src/scss/media-queries';

header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 1.8rem 12px;

  &.sticky {
    background-color: $background-color;

    position: sticky;
    position: -webkit-sticky;
    top: $header-size;
    z-index: 4;

    padding-bottom: 1rem;
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: 18px;
    font-weight: 300;
    text-transform: capitalize;
    line-height: 18px;
    margin: 0;
    color: $text-color;
  }

  .view-more {
    font-size: 13px;
    font-weight: 300;
    letter-spacing: .5px;
    color: $text-color-70;
    text-decoration: none;
    transition: color .5s ease;
    cursor: pointer;

    &:after{
      content: " →";
    }
    &:hover{
      color: $text-color;
    }
  }

  .result-count {
    font-size: 13px;
    font-weight: 300;
    letter-spacing: .5px;
    color: $text-color;
    text-decoration: none;
  }

  @include tablet-min {
    padding-left: 1.25rem;;
  }
  @include desktop-lg-min {
    padding-left: 1.75rem;
  }
}

</style>