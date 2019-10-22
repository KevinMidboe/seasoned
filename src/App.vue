<template>
  <div id="app">

    <!-- Header and hamburger navigation -->
    <navigation></navigation>

    <!-- Header with search field -->

    <!-- TODO move this to the navigation component -->
    <header class="header">
      <search-input v-model="query"></search-input>
    </header>

    <!-- Movie popup that will show above existing rendered content -->
    <movie-popup v-if="moviePopupIsVisible" :id="popupID" :type="popupType"></movie-popup>


    <darkmode-toggle />

    <!-- Display the component assigned to the given route (default: home) -->
    <router-view class="content" :key="$route.fullPath"></router-view>

  </div>
</template>

<script>
import Vue from 'vue'
import Navigation from '@/components/Navigation.vue'
import MoviePopup from '@/components/MoviePopup.vue'
import SearchInput from '@/components/SearchInput.vue'
import DarkmodeToggle from '@/components/ui/darkmodeToggle.vue'

export default {
  name: 'app',
  components: {
    Navigation,
    MoviePopup,
    SearchInput,
    DarkmodeToggle
  },
  data() {
    return {
      query: '',
      moviePopupIsVisible: false,
      popupID: 0,
      popupType: 'movie'
    }
  },
  created(){
    let that = this
    Vue.prototype.$popup = {
      get isOpen() {
        return that.moviePopupIsVisible
      },
      open: (id, type) => {
        this.popupID = id || this.popupID
        this.popupType = type || this.popupType
        this.moviePopupIsVisible = true
        console.log('opened')
      },
      close: () => {
        this.moviePopupIsVisible = false
        console.log('closed')
      }
    }
    console.log('MoviePopup registered at this.$popup and has state: ', this.$popup.isOpen)
  }
}
</script>

<style lang="scss" scoped>
@import "./src/scss/media-queries";
@import "./src/scss/variables";
.content {
    @include tablet-min{
    width: calc(100% - 95px);
    margin-top: $header-size;
    margin-left: 95px;
    position: relative;
  }
}
</style>

<style lang="scss">
// @import "./src/scss/main";
@import "./src/scss/variables";
@import "./src/scss/media-queries";

*{
  box-sizing: border-box;
}
html {
  height: 100%;
}
body{
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
  line-height: 1.6;
  background: $background-color;
  color: $text-color;
  transition: background-color .5s ease, color .5s ease;
  &.hidden{
    overflow: hidden;
  }
}
h1,h2,h3 {
  transition: color .5s ease;
}
a:any-link {
  color: inherit;
}
input, textarea, button{
  font-family: 'Roboto', sans-serif;
}
figure{
  padding: 0;
  margin: 0;
}
img{
  display: block;
  // max-width: 100%;
  height: auto;
}

.wrapper{
  position: relative;
}
.header{
  position: fixed;
  z-index: 15;
  display: flex;
  flex-direction: column;

  @include tablet-min{
    width: calc(100% - 170px);
    margin-left: 95px;
    border-top: 0;
    border-bottom: 0;
    top: 0;
  }
}

// router view transition
.fade-enter-active, .fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}
.fade-enter-active {
  transition-delay: 0.25s;
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>
