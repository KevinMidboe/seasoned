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
          src="/assets/placeholder.png"
        />
      </figure>

      <div v-if="movie" class="movie__title">
        <h1>{{ movie.title || movie.name }}</h1>
        <i>{{ movie.tagline }}</i>
      </div>
      <loading-placeholder v-else :count="2" />
    </header>

    <!-- Siderbar and movie info -->
    <div class="movie__main">
      <div class="movie__wrap movie__wrap--main">
        <!-- SIDEBAR ACTIONS -->
        <div class="movie__actions" v-if="movie">
          <action-button :active="matched" :disabled="true">
            <IconThumbsUp v-if="matched" />
            <IconThumbsDown v-else />
            {{ !matched ? "Not yet available" : "Already available 🎉" }}
          </action-button>

          <action-button @click="sendRequest" :active="requested">
            <transition name="fade" mode="out-in">
              <div v-if="!requested" key="request"><IconRequest /></div>
              <div v-else key="requested"><IconRequested /></div>
            </transition>
            {{ !requested ? `Request ${this.type}?` : "Already requested" }}
          </action-button>

          <action-button v-if="plexId && matched" @click="openInPlex">
            <IconPlay />
            Open and watch in plex now!
          </action-button>

          <action-button
            v-if="credits && credits.cast && credits.cast.length"
            :active="showCast"
            @click="() => (showCast = !showCast)"
          >
            <IconProfile class="icon" />
            {{ showCast ? "Hide cast" : "Show cast" }}
          </action-button>

          <action-button
            v-if="admin === true"
            @click="showTorrents = !showTorrents"
            :active="showTorrents"
          >
            <IconBinoculars />
            Search for torrents
            <span v-if="numberOfTorrentResults" class="meta">{{
              numberOfTorrentResults
            }}</span>
          </action-button>

          <action-button @click="openTmdb">
            <IconInfo />
            See more info
          </action-button>
        </div>

        <!-- Loading placeholder -->
        <div class="movie__actions text-input__loading" v-else>
          <div
            v-for="index in admin ? Array(4) : Array(3)"
            class="movie__actions-link"
            :key="index"
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
          <div v-if="loading">
            <loading-placeholder :count="5" />
          </div>

          <Description
            v-if="!loading && movie && movie.overview"
            :description="movie.overview"
          />

          <div class="movie__details" v-if="movie">
            <Detail
              v-if="movie.year"
              title="Release date"
              :detail="movie.year"
            />
            <Detail v-if="movie.rating" title="Rating" :detail="movie.rating" />
            <Detail
              v-if="movie.type == 'show'"
              title="Seasons"
              :detail="movie.seasons"
            />
            <Detail
              v-if="movie.genres && movie.genres.length"
              title="Genres"
              :detail="movie.genres.join(', ')"
            />
            <Detail
              v-if="
                movie.production_status &&
                movie.production_status !== 'Released'
              "
              title="Production status"
              :detail="movie.production_status"
            />
            <Detail
              v-if="movie.runtime"
              title="Runtime"
              :detail="humanMinutes(movie.runtime)"
            />
          </div>
        </div>

        <!-- TODO: change this classname, this is general  -->

        <div
          class="movie__admin"
          v-if="showCast && credits && credits.cast && credits.cast.length"
        >
          <Detail title="cast">
            <CastList :cast="credits.cast" />
          </Detail>
        </div>
      </div>

      <!-- TORRENT LIST -->
      <TorrentList
        v-if="movie && admin"
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
import IconProfile from "@/icons/IconProfile";
import IconThumbsUp from "@/icons/IconThumbsUp";
import IconThumbsDown from "@/icons/IconThumbsDown";
import IconInfo from "@/icons/IconInfo";
import IconRequest from "@/icons/IconRequest";
import IconRequested from "@/icons/IconRequested";
import IconBinoculars from "@/icons/IconBinoculars";
import IconPlay from "@/icons/IconPlay";
import TorrentList from "@/components/TorrentList";
import CastList from "@/components/CastList";
import Detail from "@/components/popup/Detail";
import ActionButton from "@/components/popup/ActionButton";
import Description from "@/components/popup/Description";
import store from "@/store";
import LoadingPlaceholder from "@/components/ui/LoadingPlaceholder";

import {
  getMovie,
  getShow,
  getPerson,
  getCredits,
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
  components: {
    Description,
    Detail,
    ActionButton,
    IconProfile,
    IconThumbsUp,
    IconThumbsDown,
    IconRequest,
    IconRequested,
    IconInfo,
    IconBinoculars,
    IconPlay,
    TorrentList,
    CastList,
    LoadingPlaceholder
  },
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
      showCast: false,
      credits: [],
      compact: false,
      loading: true
    };
  },
  watch: {
    id: function (val) {
      this.fetchByType();
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
    ...mapGetters("user", ["loggedIn", "admin", "plexId"]),
    numberOfTorrentResults: () => {
      let numTorrents = store.getters["torrentModule/resultCount"];
      return numTorrents !== null ? numTorrents + " results" : null;
    }
  },
  methods: {
    async fetchByType() {
      try {
        let response;
        if (this.type === "movie") {
          response = await getMovie(this.id, true, false);
        } else if (this.type === "show") {
          response = await getShow(this.id, false, false);
        } else {
          this.$router.push({ name: "404" });
        }

        this.parseResponse(response);
      } catch (error) {
        this.$router.push({ name: "404" });
      }

      // async get credits
      getCredits(this.type, this.id).then(credits => (this.credits = credits));
    },
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
        poster.src = "/assets/no-image.svg";
        return;
      }

      poster.src = `${this.ASSET_URL}${this.ASSET_SIZES[0]}${this.poster}`;
    },
    humanMinutes(minutes) {
      if (minutes instanceof Array) {
        minutes = minutes[0];
      }

      const hours = Math.floor(minutes / 60);
      const minutesLeft = minutes - hours * 60;

      if (minutesLeft == 0) {
        return hours > 1 ? `${hours} hours` : `${hours} hour`;
      } else if (hours == 0) {
        return `${minutesLeft} min`;
      }

      return `${hours}h ${minutesLeft}m`;
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
    store.dispatch("torrentModule/setResultCount", null);
    this.prevDocumentTitle = store.getters["documentTitle/title"];
    this.fetchByType();
  },
  beforeDestroy() {
    store.dispatch("documentTitle/updateTitle", this.prevDocumentTitle);
  }
};
</script>

<style lang="scss" scoped>
@import "src/scss/loading-placeholder";
@import "src/scss/variables";
@import "src/scss/media-queries";
@import "src/scss/main";

header {
  $duration: 0.2s;
  transform: scaleY(1);
  transition: height $duration ease;
  transform-origin: top;
  position: relative;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-color: $background-color;
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 350px;

  @include mobile {
    grid-template-columns: 1fr;
    height: 250px;
    place-items: center;
  }

  * {
    z-index: 2;
  }

  &::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
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
    background: var(--background-color);
    height: auto;
    display: block;
    width: calc(100% - 80px);
    margin: 40px;

    > img {
      width: 100%;
      border-radius: 10px;
    }
  }
}

.movie {
  &__wrap {
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
    text-align: center;
    width: 100%;
    height: fit-content;

    @include tablet-min {
      text-align: left;
      padding: 140px 30px 0 40px;
    }
    h1 {
      color: var(--color-green);
      font-weight: 500;
      line-height: 1.4;
      font-size: 24px;
      margin-bottom: 0;

      @include tablet-min {
        font-size: 30px;
      }
    }

    i {
      display: block;
      color: rgba(255, 255, 255, 0.8);
      margin-top: 1rem;
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
  &__details {
    display: flex;
    flex-wrap: wrap;

    > * {
      margin-right: 30px;

      @include mobile {
        margin-right: 20px;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
