<template>
  <section class="movie">

    <!-- HEADER w/ POSTER -->
    <header class="movie__header" :style="{ 'background-image': movie && backdrop !== null ? 'url(' + ASSET_URL + ASSET_SIZES[1] + backdrop + ')' : '' }" :class="compact ? 'compact' : ''" @click="compact=!compact">
      <div class="movie__wrap movie__wrap--header">
        <figure class="movie__poster">
          <img v-if="movie && poster === null"
            class="movies-item__img is-loaded"
            alt="movie poster image"
            src="~assets/no-image.png">
          <img v-else-if="poster === undefined"
            class="movies-item__img grey"
            alt="movie poster image">
            <!-- src="~assets/placeholder.png"> -->
          <img v-else
            class="movies-item__img is-loaded"
            alt="movie poster image"
            :src="ASSET_URL + ASSET_SIZES[0] + poster">
        </figure>

        <div class="movie__title">
          <h1>{{ title }}</h1>
        </div>
      </div>
    </header>

    <!-- Siderbar and movie info -->
    <div class="movie__main">
      <div class="movie__wrap movie__wrap--main">

        <!-- SIDEBAR ACTIONS -->
        <div class="movie__actions" v-if="movie">

          <sidebar-list-element :iconRef="'#iconNot_exsits'" :active="matched"
            :iconRefActive="'#iconExists'" :textActive="'Already in plex 🎉'">

            Not yet in plex
          </sidebar-list-element>
          <sidebar-list-element @click="sendRequest" :iconRef="'#iconSent'"
            :active="requested" :textActive="'Requested to be downloaded'">

            Request to be downloaded?
          </sidebar-list-element>
          <sidebar-list-element v-if="admin" @click="showTorrents=!showTorrents"
            :iconRef="'#icon_torrents'" :active="showTorrents"
            :supplementaryText="'23 results'">

            Search for torrents
          </sidebar-list-element>
          <sidebar-list-element @click="openTmdb" :iconRef="'#icon_info'">
            See more info
          </sidebar-list-element>
        </div>

        <!-- Loading placeholder -->
        <div class="movie__actions text-input__loading" v-else>
          <div class="movie__actions-link" v-for="_ in admin ? Array(4) : Array(3)">
            <div class="movie__actions-text text-input__loading--line" style="margin:9px; margin-left: -3px;"></div>
          </div>
        </div>


        <!-- MOVIE INFO -->
        <div class="movie__info">
          <div class="movie__description" v-if="movie"> {{ movie.overview }}</div>

          <!-- Loading placeholder -->
          <div v-else class="movie__description">
            <loading-placeholder :count="12" />
          </div>

          <div class="movie__details" v-if="movie">
            <div v-if="movie.year" class="movie__details-block">
              <h2 class="movie__details-title">Release Date</h2>
              <div class="movie__details-text">{{ movie.year }}</div>
            </div>

             <div v-if="movie.rank" class="movie__details-block">
              <h2 class="movie__details-title">Rating</h2>
              <div class="movie__details-text">{{ movie.rank }}</div>
            </div>

            <div v-if="movie.type == 'show'" class="movie__details-block">
              <h2 class="movie__details-title">Seasons</h2>
              <div class="movie__details-text">{{ movie.seasons }}</div>
            </div>

            <div v-if="movie.genres" class="movie__details-block">
              <h2 class="movie__details-title">Genres</h2>
              <div class="movie__details-text">{{ nestedDataToString(movie.genres) }}</div>
            </div>
          </div>

        </div>

        <!-- TODO: change this classname, this is general  -->

        <div class="movie__admin" v-if="movie && movie.credits">
          <h2 class="movie__details-title">Cast</h2>
          <div style="display: flex; flex-wrap: wrap;">
            <person v-for="cast in movie.credits.cast" :info="cast"
              style="flex-basis: 0;"></person>
            </div>
        </div>

      </div>

      <!-- TORRENT LIST -->
      <TorrentList v-if="movie" :show="showTorrents" :query="title" :tmdb_id="id"
                   :admin="admin"></TorrentList>
    </div>
  </section>
</template>

<script>
import storage from '@/storage.js'
import img from '@/directives/v-image.js'
import TorrentList from './TorrentList.vue'
import Person from './Person.vue'
import SidebarListElement from './ui/sidebarListElem.vue'

import LoadingPlaceholder from './ui/LoadingPlaceholder.vue'

import { getMovie, getShow, request, getRequestStatus } from '@/api.js'

export default {
  props: ['id', 'type'],
  components: { TorrentList, Person, LoadingPlaceholder, SidebarListElement },
  directives: { img: img }, // TODO decide to remove or use
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
      showTorrents: false,
      compact: false
    }
  },
  methods: {
    parseResponse(resp) {
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
    this.prevDocumentTitle = document.title

    if (this.type === 'movie') {
      getMovie(this.id)
        .then(this.parseResponse)
        .catch(error => {
          this.$router.push({ name: '404' });
        })
    } else {
      getShow(this.id)
        .then(this.parseResponse)
        .catch(error => {
          this.$router.push({ name: '404' });
        })
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
    $duration: 0.2s;
    height: 250px;
    transform: scaleY(1);
    transition: height $duration ease;
    transform-origin: top;
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
    &.compact {
      height: 100px;
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
