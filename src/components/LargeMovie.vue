<template>
  <div class="wrapper">
    <div class="backdrop" :style="backdropStyle"></div>

    <div class="title-container">
      <h1> {{ title }} </h1>
      <h2> ({{ movie.year }}) </h2>
    </div>
    
    <div class="opacity-overlay-bottom"></div>

    <div class="info-container">
      <div class="button">
        <svg class="action-icon">
          <use :xlink:href="'#iconSent'"></use>
        </svg>

        <span>Request movie</span>
      </div>
      <div class="button--grey">
        <svg class="action-icon">
          <use :xlink:href="'#icon_info'"></use>
        </svg>

        <span>See more info</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "./src/scss/variables";

$blue: rgb(0,122,255);
$blue-hover: rgb(10,132,255);
$grey: rgb(44,44,46);
$grey-hover: rgb(58,58,60);

.action-icon {
  transform: translateY(-0.2px);
  width: 19px;
  height: 19px;
  margin-right: 8px;
  // fill: rgba($c-dark, 0.5);
  fill: white;
  transition: fill 0.5s ease, transform 0.5s ease;
  &.waiting {
    transform: scale(0.8, 0.8);
  }
  &.pending {
    fill: #f8bd2d;
  }
}

@mixin button {
  width: 300px;
  min-height: 50px;
  border-radius: 5px;
  background-color: $blue;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: transform 0.5s ease, box-shadow 0.3s ease;


  &:hover {
    background-color: $blue-hover;
    transform: scale(1.03);
  }

  &:not(:last-of-type) {
    margin-bottom: 0.7rem;
  }
}

.title-container {
  width: 100%;
  position: absolute;
  top: 0;
  padding-left: 3rem;

  h1 {
    font-size: 5rem;
  display: inline;
    color: $c-green;
    -webkit-text-stroke: 1.1px $c-green-dark;
    // border: 1px solid $c-green;
    // text-shadow: -1px 0 $c-green-dark, 0 1px $c-green-dark, 1px 0 $c-green-dark, 0 -1px $c-green-dark;
  }

  h2 {
    font-size: 2.7rem;
  display: inline;
    color: $c-green;
    -webkit-text-stroke: 1.1px $c-green-dark;
    // border: 1px solid $c-green;
    // text-shadow: -1px 0 $c-green-dark, 0 1px $c-green-dark, 1px 0 $c-green-dark, 0 -1px $c-green-dark;
  }
}

.info-container {
  width: calc(100% - 80px);
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  // background-color: red;
  margin: 40px;

  .button {
    @include button;

    &--grey {
      @include button;
      background-color: $grey;
      
      &:hover{
        background-color: $grey-hover;
      }

      span { color: white; }
    }

    span { color: white; }
  }
}

.wrapper {
  $width: 88vw;

  position: absolute;
  left: calc(50% - #{$width} / 2);
  display: flex;
  flex-direction: column;
  width: $width;
  height: 82vh;
//  -webkit-mask-size: auto 50%;
}

.backdrop {
  width: 100%;
  height: 100%;
  // -webkit-mask-image: linear-gradient(to top, transparent 5%, black);
  border-radius: 0 0 8px 8px;
}

.opacity-overlay-bottom {
  // background-color: #0c0a09;
  position: absolute;
  bottom: 0;
  height: 55%;
  width: 100%;
  align-self: flex-end;
  -webkit-mask: linear-gradient(to bottom, transparent 0%, black 100%);
  mask: linear-gradient(to top, transparent 25%, black 75%);
  -webkit-mask: linear-gradient(transparent, black);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 0 0 8px 8px;

  // background: linear-gradient(180deg, rgba(0,0,0,0.29315476190476186) 0%, rgba(0,0,0,1) 100%, rgba(9,9,121,1) 100%, rgba(0,0,0,1) 100%);
}
</style>

<script>
import storage from '@/storage.js'
import img from '@/directives/v-image.js'
import TorrentList from './TorrentList.vue'
import Person from './Person.vue'
import SidebarAction from './movie/SidebarAction.vue'

import LoadingPlaceholder from './ui/LoadingPlaceholder.vue'

import { getMovie, getShow, request, getRequestStatus } from '@/api.js'

export default {
  props: ['id', 'type'],
  components: { TorrentList, Person, LoadingPlaceholder, SidebarAction },
  directives: { img: img }, // TODO decide to remove or use
  computed: {
    backdropStyle() {
      let value = ''
      if (this.movie && this.backdrop) {
        value = 'url(' + this.ASSET_URL + this.ASSET_SIZES[2] + this.backdrop + ')'
        // value = 'url(https://kevinmidboe.com/assets/arrival.jpg)'
        console.log('value', value)
      }
      console.log('bool', this.backdrop)
      return { 'background-image': value, 'background-size': 'cover', 'background-repeat': 'no-repeat'}
      return { 'background-image': movie && backdrop !== null ? 'url(' + this.ASSET_URL + ASSET_SIZES[1] + backdrop + ')' : '' } 
    }
  },
  data(){
    return{
      ASSET_URL: 'https://image.tmdb.org/t/p/',
      ASSET_SIZES: ['w500', 'w780', 'original'],
      movie: undefined,
      title: undefined,
      poster: undefined,
      backdrop: undefined,
      matched: false,
      userLoggedIn: storage.sessionId ? true : false,
      requested: false,
      admin: localStorage.getItem('admin'),
      showTorrents: false
    }
  },
  methods: {
    parseResponse(resp) {
      const l = {fe: 0}

      console.log('resp', resp)
      let movie = resp.data;
      this.movie = { ...movie }
      this.title = movie.title
      this.poster = movie.poster
      this.backdrop = movie.backdrop
      this.matched = movie.existsInPlex
      this.checkIfRequested(movie)
        .then(status => this.requested = status)

      document.title = movie.title + storage.pageTitlePostfix
    },
    async checkIfRequested(movie) {
      return await getRequestStatus(movie.id, movie.type)
    },
    nestedDataToString(data) {
      let nestedArray = []
      data.forEach(item => nestedArray.push(item));
      return nestedArray.join(', ');
    },
    sendRequest(){
      request(this.id, this.type, storage.token)
        .then(resp => {
          if (resp.success) {
            this.requested = true
          }
        })
    },
    openTmdb(){
      const tmdbType = this.type === 'show' ? 'tv' : this.type
      window.location.href = 'https://www.themoviedb.org/' + tmdbType + '/' + this.id
    },
  },
  watch: {
    id: function(val){
      if (this.type === 'movie') {
        this.fetchMovie(val);
      } else {
        this.fetchShow(val)
      }
    }
  },
  beforeDestroy() {
    document.title = this.prevDocumentTitle
  },
  created(){
    console.log('👋')
    this.prevDocumentTitle = document.title

    if (this.type === 'movie') {
      getMovie(this.id)
        .then(this.parseResponse)
        .catch(error => {
          this.$router.push({ name: '404' });
        })
    } else if (this.type === 'show') {
      getShow(this.id)
        .then(this.parseResponse)
        .catch(error => {
          this.$router.push({ name: '404' });
        })
    } else {
      console.error('No type found, unable to fetch item')
    }

    console.log('admin: ', this.admin)
  }
}
</script>

<style lang="scss" scoped>
@import "./src/scss/loading-placeholder";
@import "./src/scss/variables";
@import "./src/scss/media-queries";

.movie {
  &__wrap {
    display: flex;
    &--header {
      align-items: center;
      height: 100%;
    }
    &--main {
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      @include tablet-min{
        flex-direction: row;
      }
    }
  }
  &__header {
    height: 250px;
    position: relative;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-color: $c-dark;
    @include tablet-min {
      height: 350px;
    }
    &:before {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
      width: 100%;
      height: 100%;
      background: rgba($c-dark, 0.85);
    }
  }

  &__poster {
    display: none;
    @include tablet-min {
      background: $c-white;
      height: 0;
      display: block;
      position: absolute;
      width: calc(45% - 40px);
      top: 40px;
      left: 40px;

    }
  }

  &__img {
    display: block;
    width: 100%;
    opacity: 0;
    transform: scale(0.97) translateZ(0);
    transition: opacity 0.5s ease, transform 0.5s ease;

    &.is-loaded {
      opacity: 1;
      transform: scale(1);
    }
  }

  &__title {
    position: relative;
    padding: 20px;
    color: $c-green;
    text-align: center;
    width: 100%;
    @include tablet-min {
      width: 55%;
      text-align: left;
      margin-left: 45%;
      padding: 30px 30px 30px 40px;
    }
    h1 {
      font-weight: 500;
      line-height: 1.4;
      font-size: 24px;
      @include tablet-min {
        font-size: 30px;
      }
    }
    span {
      display: block;
      font-size: 14px;
      font-weight: 300;
      color: rgba($c-white, 0.7);
      margin-top: 10px;
    }
  }
  &__main {
    background: $c-light;
    min-height: calc(100vh - 250px);
    @include tablet-min {
      min-height: 0;
    }

    height: 100%;
  }
    &__actions {
      text-align: center;
      // min-height: 394px;
      width: 100%;
      order: 2;
      padding: 20px;
      border-top: 1px solid rgba($c-dark, 0.05);
      @include tablet-min {
        order: 1;
        width: 45%;
        padding: 185px 0 40px 40px;
        border-top: 0;
      }
      &-link {
        display: flex;
        align-items: center;
        text-decoration: none;
        text-transform: uppercase;
        color: rgba($c-dark, 0.5);
        transition: color 0.5s ease;
        font-size: 11px;
        padding: 5px 0;
        border-bottom: 1px solid rgba($c-dark, 0.05);
        &:hover {
          color: rgba($c-dark, 0.75);
        }
        &.active {
          color: $c-dark;
        }
        &.pending {
          color: #f8bd2d;
        }
      }
      &-icon {
        width: 18px;
        height: 18px;
        margin: 0 10px 0 0;
        fill: rgba($c-dark, 0.5);
        transition: fill 0.5s ease, transform 0.5s ease;
        &.waiting {
          transform: scale(0.8, 0.8);
        }
        &.pending {
          fill: #f8bd2d;
        }
      }
      &-link:hover &-icon {
        fill: rgba($c-dark, 0.75);
        cursor: pointer;
      }
      &-link.active &-icon {
        fill: $c-green;
      }
      &-text {
        display: block;
        padding-top: 2px;
        cursor: pointer;
        margin:4.4px;
        margin-left: -3px;
      }
    }
    &__info {
      width: 100%;
      padding: 20px;
      order: 1;
      @include tablet-min {
        order: 2;
        padding: 40px;
        width: 55%;
        margin-left: 45%;
      }
    }
    &__actions + &__info {
      margin-left: 0;
    }
    &__description {
      font-weight: 300;
      font-size: 13px;
      line-height: 1.8;
      margin-bottom: 20px;
      @include tablet-min {
        margin-bottom: 30px;
        font-size: 14px;
      }
    }
    &__details {
      &-block {
        float: left;
      }
      &-block:not(:last-child) {
        margin-bottom: 20px;
        margin-right: 20px;
        @include tablet-min {
          margin-bottom: 30px;
          margin-right: 30px;
        }
      }
      &-title {
        margin: 0;
        font-weight: 400;
        text-transform: uppercase;
        font-size: 14px;
        color: $c-green;
        @include tablet-min {
          font-size: 16px;
        }
      }
      &-text {
        font-weight: 300;
        font-size: 14px;
        margin-top: 5px;
      }
    }
    &__admin {
      width: 100%;
      padding: 20px;
      order: 2;
      @include tablet-min {
        order: 3;
        padding: 40px;
        padding-top: 0px;
        width: 100%;
      }
      &-title {
          margin: 0;
          font-weight: 400;
          text-transform: uppercase;
          text-align: center;
          font-size: 14px;
          color: $c-green;
          padding-bottom: 20px;
          @include tablet-min {
            font-size: 16px;
          }
        }
    }
}
</style>
