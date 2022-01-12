<template>
  <section class="movie">
    <!-- HEADER w/ POSTER -->
    <header
      ref="header"
      :class="compact ? 'compact' : ''"
      @click="compact = !compact"
    >
      <figure class="movie__poster">
        <img
          class="movie-item__img is-loaded"
          ref="poster-image"
          src="~assets/placeholder.png"
        />
      </figure>

      <h1 class="movie__title" v-if="movie">{{ movie.title }}</h1>
      <loading-placeholder v-else :count="1" />
    </header>

    <!-- Siderbar and movie info -->
    <div class="movie__main">
      <div class="movie__wrap movie__wrap--main">
        <!-- SIDEBAR ACTIONS -->
        <div class="movie__actions" v-if="movie">
          <sidebar-list-element
            :iconRef="'#iconNot_exsits'"
            :active="matched"
            :iconRefActive="'#iconExists'"
            :textActive="'Already in plex 🎉'"
          >
            Not yet in plex
          </sidebar-list-element>
          <sidebar-list-element
            @click="sendRequest"
            :iconRef="'#iconSent'"
            :active="requested"
            :textActive="'Requested to be downloaded'"
          >
            Request to be downloaded?
          </sidebar-list-element>

          <sidebar-list-element
            v-if="isPlexAuthenticated && matched"
            @click="openInPlex"
            :iconString="'⏯ '"
          >
            Watch in plex now!
          </sidebar-list-element>

          <sidebar-list-element
            v-if="admin"
            @click="showTorrents = !showTorrents"
            :iconRef="'#icon_torrents'"
            :active="showTorrents"
            :supplementaryText="numberOfTorrentResults"
          >
            Search for torrents
          </sidebar-list-element>
          <sidebar-list-element @click="openTmdb" :iconRef="'#icon_info'">
            See more info
          </sidebar-list-element>
        </div>

        <!-- Loading placeholder -->
        <div class="movie__actions text-input__loading" v-else>
          <div
            class="movie__actions-link"
            v-for="_ in admin ? Array(4) : Array(3)"
          >
            <div
              class="movie__actions-text text-input__loading--line"
              style="margin: 9px; margin-left: -3px"
            ></div>
          </div>
        </div>

        <!-- MOVIE INFO -->
        <div class="movie__info">
          <!-- Loading placeholder -->
          <div
            class="movie__description noselect"
            @click="truncatedDescription = !truncatedDescription"
            v-if="!loading"
          >
            <span :class="truncatedDescription ? 'truncated' : null">{{
              movie.overview
            }}</span>
            <button
              v-if="movie.overview && movie.overview.length > 220"
              class="truncate-toggle"
            >
              <i>⬆</i>
            </button>
          </div>
          <div v-else class="movie__description">
            <loading-placeholder :count="5" />
          </div>

          <div class="movie__details" v-if="movie">
            <div v-if="movie.year">
              <h2 class="title">Release Date</h2>
              <span class="info">{{ movie.year }}</span>
            </div>

            <div v-if="movie.rating">
              <h2 class="title">Rating</h2>
              <span class="info">{{ movie.rating }}</span>
            </div>

            <div v-if="movie.type == 'show'">
              <h2 class="title">Seasons</h2>
              <span class="info">{{ movie.seasons }}</span>
            </div>

            <div v-if="movie.genres">
              <h2 class="title">Genres</h2>
              <span class="info">{{ movie.genres.join(", ") }}</span>
            </div>

            <div v-if="movie.type == 'show'">
              <h2 class="title">Production status</h2>
              <span class="info">{{ movie.production_status }}</span>
            </div>

            <div v-if="movie.type == 'show'">
              <h2 class="title">Runtime</h2>
              <span class="info">{{ movie.runtime[0] }} minutes</span>
            </div>
          </div>
        </div>

        <!-- TODO: change this classname, this is general  -->

        <div
          class="movie__admin"
          v-if="
            movie &&
            movie.credits &&
            movie.credits.cast &&
            movie.credits.cast.length
          "
        >
          <h2 class="title">Cast</h2>
          <Cast :cast="movie.credits.cast" />
        </div>
      </div>

      <!-- TORRENT LIST -->
      <TorrentList
        v-if="movie"
        :show="showTorrents"
        :query="title"
        :tmdb_id="id"
        :admin="admin"
      ></TorrentList>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import img from "@/directives/v-image";
import TorrentList from "./TorrentList";
import Cast from "./Cast";
import SidebarListElement from "./ui/sidebarListElem";
import store from "@/store";
import LoadingPlaceholder from "./ui/LoadingPlaceholder";

import {
  getMovie,
  getPerson,
  getShow,
  request,
  getRequestStatus,
  watchLink
} from "@/api";

export default {
  // props: ['id', 'type'],
  props: {
    id: {
      required: true,
      type: Number
    },
    type: {
      required: false,
      type: String
    }
  },
  components: { TorrentList, Cast, LoadingPlaceholder, SidebarListElement },
  directives: { img: img }, // TODO decide to remove or use
  data() {
    return {
      ASSET_URL: "https://image.tmdb.org/t/p/",
      ASSET_SIZES: ["w500", "w780", "original"],
      movie: undefined,
      title: undefined,
      poster: undefined,
      backdrop: undefined,
      matched: false,
      requested: false,
      showTorrents: false,
      compact: false,
      loading: true,
      truncatedDescription: true
    };
  },
  watch: {
    id: function (val) {
      if (this.type === "movie") {
        this.fetchMovie(val);
      } else {
        this.fetchShow(val);
      }
    },
    backdrop: function (backdrop) {
      if (backdrop != null) {
        const style = {
          backgroundImage:
            "url(" + this.ASSET_URL + this.ASSET_SIZES[1] + backdrop + ")"
        };

        Object.assign(this.$refs.header.style, style);
      }
    }
  },
  computed: {
    ...mapGetters("user", ["loggedIn", "admin"]),
    numberOfTorrentResults: () => {
      let numTorrents = store.getters["torrentModule/resultCount"];
      return numTorrents !== null ? numTorrents + " results" : null;
    },
    isPlexAuthenticated: () => {
      return store.getters["userModule/isPlexAuthenticated"];
    }
  },
  methods: {
    parseResponse(movie) {
      this.loading = false;
      this.movie = { ...movie };
      this.title = movie.title;
      this.poster = movie.poster;
      this.backdrop = movie.backdrop;
      this.matched = movie.exists_in_plex || false;
      this.checkIfRequested(movie).then(status => (this.requested = status));

      store.dispatch("documentTitle/updateTitle", movie.title);
      this.setPosterSrc();
    },
    async checkIfRequested(movie) {
      return await getRequestStatus(movie.id, movie.type);
    },
    setPosterSrc() {
      const poster = this.$refs["poster-image"];
      if (this.poster == null) {
        poster.src = "/no-image.png";
        return;
      }

      poster.src = `${this.ASSET_URL}${this.ASSET_SIZES[0]}${this.poster}`;
    },
    sendRequest() {
      request(this.id, this.type).then(resp => {
        if (resp.success) {
          this.requested = true;
        }
      });
    },
    openInPlex() {
      watchLink(this.title, this.movie.year).then(
        watchLink => (window.location = watchLink)
      );
    },
    openTmdb() {
      const tmdbType = this.type === "show" ? "tv" : this.type;
      window.location.href =
        "https://www.themoviedb.org/" + tmdbType + "/" + this.id;
    }
  },
  created() {
    this.prevDocumentTitle = store.getters["documentTitle/title"];

    if (this.type === "movie") {
      getMovie(this.id, true)
        .then(this.parseResponse)
        .catch(error => {
          this.$router.push({ name: "404" });
        });
    } else if (this.type == "person") {
      getPerson(this.id, true)
        .then(this.parseResponse)
        .catch(error => {
          this.$router.push({ name: "404" });
        });
    } else {
      getShow(this.id, true)
        .then(this.parseResponse)
        .catch(error => {
          this.$router.push({ name: "404" });
        });
    }
  },
  beforeDestroy() {
    store.dispatch("documentTitle/updateTitle", this.prevDocumentTitle);
  }
};
</script>

<style lang="scss" scoped>
@import "./src/scss/loading-placeholder";
@import "./src/scss/variables";
@import "./src/scss/media-queries";
@import "./src/scss/main";

header {
  $duration: 0.2s;
  height: 250px;
  transform: scaleY(1);
  transition: height $duration ease;
  transform-origin: top;
  position: relative;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-color: $background-color;
  display: flex;
  align-items: center;

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
    background: $background-dark-85;
  }
  @include mobile {
    &.compact {
      height: 100px;
    }
  }
}

.movie__poster {
  display: none;

  @include desktop {
    background: $background-color;
    height: 0;
    display: block;
    position: absolute;
    width: calc(45% - 40px);
    top: 40px;
    left: 40px;

    > img {
      width: 100%;
    }
  }
}

.truncate-toggle {
  border: none;
  background: none;
  width: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  color: $text-color;

  > i {
    font-style: unset;
    font-size: 0.7rem;
    transition: 0.3s ease all;
    transform: rotateY(180deg);
  }

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid $text-color-50;
  }
  &::before {
    margin-right: 1rem;
  }
  &::after {
    margin-left: 1rem;
  }
}

h2.title {
  margin: 0;
  font-weight: 400;
  text-transform: uppercase;
  font-size: 1.2rem;
  color: $green;
}

span.info {
  font-weight: 300;
  font-size: 1rem;
  letter-spacing: 0.8px;
  margin-top: 5px;
}

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
      @include tablet-min {
        flex-direction: row;
      }

      background-color: $background-color;
      color: $text-color;
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
    color: $green;
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
  }

  &__actions {
    text-align: center;
    width: 100%;
    order: 2;
    padding: 20px;
    border-top: 1px solid $text-color-5;
    @include tablet-min {
      order: 1;
      width: 45%;
      padding: 185px 0 40px 40px;
      border-top: 0;
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
  &__info {
    margin-left: 0;
  }
  &__description {
    font-weight: 300;
    font-size: 13px;
    line-height: 1.8;
    margin-bottom: 20px;

    & .truncated {
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;

      & + .truncate-toggle > i {
        transform: rotateY(0deg) rotateZ(180deg);
      }
    }

    @include tablet-min {
      margin-bottom: 30px;
      font-size: 14px;
    }
  }
  &__details {
    display: flex;
    flex-wrap: wrap;

    > div {
      margin-bottom: 20px;
      margin-right: 20px;
      @include tablet-min {
        margin-bottom: 30px;
        margin-right: 30px;
      }
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
      color: $green;
      padding-bottom: 20px;
      @include tablet-min {
        font-size: 16px;
      }
    }
  }
}
</style>
