<template>
  <div id="app">

    <!-- Header and hamburger navigation -->
    <navigation></navigation>

    <!-- Header with search field -->
    <header class="header">
      <search-input v-model="query"></search-input>
    </header>

    <!-- Movie popup that will show above existing rendered content -->
    <movie-popup v-if="moviePopupIsVisible" :id="popupID" :type="popupType"></movie-popup>

    <!-- Display the component assigned to the given route (default: home) -->
    <router-view class="content"></router-view>

  </div>
</template>

<script>
import Vue from 'vue'
import Navigation from '@/components/Navigation.vue'
import MoviePopup from '@/components/MoviePopup.vue'
import SearchInput from '@/components/SearchInput.vue'

export default {
  name: 'app',
  components: {
    Navigation,
    MoviePopup,
    SearchInput
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
    padding-top: $header-size;
    margin-left: 95px;
    position: relative;
  }
}
</style>

<style lang="scss">
@import "./src/scss/main";
@import "./src/scss/variables";
@import "./src/scss/media-queries";
*{
  box-sizing: border-box;
}
html, body{
  height: 100%;
}
body{
  font-family: 'Roboto', sans-serif;
  line-height: 1.6;
  background: $c-light;
  color: $c-dark;
  &.hidden{
    overflow: hidden;
  }
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
  background: $c-white;
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
  &__search{
    display: flex;
    position: relative;
    z-index: 5;
    width: 100%;
    position: fixed;
    top: 0;
    right: 55px;
    @include tablet-min{
      position: relative;
      height: 75px;
      right: 0;
    }
    &-input{
      display: block;
      width: 100%;
      padding: 15px 20px 15px 45px;
      outline: none;
      border: 0;
      background-color: transparent;
      color: $c-dark;
      font-weight: 300;
      font-size: 16px;
      @include tablet-min{
        padding: 15px 30px 15px 60px;
      }
      @include tablet-landscape-min{
        padding: 15px 30px 15px 80px;
      }
      @include desktop-min{
        padding: 15px 30px 15px 90px;
      }
    }
    &-arrow {
      height: 19px;
      width: 30px;
      display: flex;
      align-self: center;
      margin-right: 30px;

      -moz-transition: all 0.5s ease;
      -webkit-transition: all 0.5s ease;
      transition: all 0.5s ease;

      &.down {
        -ms-transform: rotate(180deg);
        -moz-transform: rotate(180deg);
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg);
      }
    }
    &-input:focus + &-icon{
      fill: $c-dark;
    }
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
