<template>
  <section class="movie">
    <!-- HEADER w/ POSTER -->
    <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
    <header
      ref="backdropElement"
      :class="compact ? 'compact' : ''"
      @click="compact = !compact"
    >
      <figure class="movie__poster">
        <img
          ref="poster-image"
          class="movie-item__img is-loaded"
          alt="Movie poster"
          :src="poster"
        />
      </figure>

      <div v-if="media" class="movie__title">
        <h1>{{ media.title }}</h1>
        <i>{{ media.tagline }}</i>
      </div>
      <loading-placeholder v-else :count="2" />
    </header>

    <!-- Siderbar and movie info -->
    <div class="movie__main">
      <div class="movie__wrap movie__wrap--main">
        <!-- SIDEBAR ACTIONS -->
        <div v-if="media" class="movie__actions">
          <action-button :active="media?.exists_in_plex" :disabled="true">
            <IconThumbsUp v-if="media?.exists_in_plex" />
            <IconThumbsDown v-else />
            {{
              !media?.exists_in_plex
                ? "Not yet available"
                : "Already available 🎉"
            }}
          </action-button>

          <action-button :active="requested" @click="sendRequest">
            <transition name="fade" mode="out-in">
              <div v-if="!requested" key="request"><IconRequest /></div>
              <div v-else key="requested"><IconRequested /></div>
            </transition>
            {{ !requested ? `Request ${type}?` : "Already requested" }}
          </action-button>

          <action-button
            v-if="plexUserId && media?.exists_in_plex"
            @click="openInPlex"
          >
            <IconPlay />
            Open and watch in plex now!
          </action-button>

          <action-button
            v-if="cast?.length"
            :active="showCast"
            @click="() => (showCast = !showCast)"
          >
            <IconProfile class="icon" />
            {{ showCast ? "Hide cast" : "Show cast" }}
          </action-button>

          <action-button
            v-if="admin === true"
            :active="showTorrents"
            @click="showTorrents = !showTorrents"
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
        <div v-else class="movie__actions text-input__loading">
          <div
            v-for="index in admin ? Array(4) : Array(3)"
            :key="index"
            class="movie__actions-link"
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
            v-if="!loading && media && media.overview"
            :description="media.overview"
          />

          <div v-if="media" class="movie__details">
            <Detail
              v-if="media.year"
              title="Release date"
              :detail="media.year"
            />
            <Detail
              v-if="media.type === MediaTypes.Movie && media.rating"
              title="Rating"
              :detail="media.rating"
            />
            <Detail
              v-if="media.type == MediaTypes.Show"
              title="Seasons"
              :detail="media.seasons"
            />
            <Detail
              v-if="media.genres && media.genres.length"
              title="Genres"
              :detail="media.genres.join(', ')"
            />
            <Detail
              v-if="
                media.production_status &&
                media.production_status !== 'Released'
              "
              title="Production status"
              :detail="media.production_status"
            />
            <Detail
              v-if="media.runtime"
              title="Runtime"
              :detail="humanMinutes(media.runtime)"
            />
          </div>
        </div>

        <!-- TODO: change this classname, this is general  -->

        <div v-if="showCast && cast?.length" class="movie__admin">
          <Detail title="cast">
            <CastList :cast="cast" />
          </Detail>
        </div>
      </div>

      <!-- TORRENT LIST -->
      <TorrentList
        v-if="media && admin && showTorrents"
        class="torrents"
        :query="media?.title"
        :tmdb-id="id"
      ></TorrentList>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  import { useStore } from "vuex";

  // import img from "@/directives/v-image";
  import IconProfile from "../../icons/IconProfile.vue";
  import IconThumbsUp from "../../icons/IconThumbsUp.vue";
  import IconThumbsDown from "../../icons/IconThumbsDown.vue";
  import IconInfo from "../../icons/IconInfo.vue";
  import IconRequest from "../../icons/IconRequest.vue";
  import IconRequested from "../../icons/IconRequested.vue";
  import IconBinoculars from "../../icons/IconBinoculars.vue";
  import IconPlay from "../../icons/IconPlay.vue";
  import TorrentList from "../torrent/TruncatedTorrentResults.vue";
  import CastList from "../CastList.vue";
  import Detail from "./Detail.vue";
  import ActionButton from "./ActionButton.vue";
  import Description from "./Description.vue";
  import LoadingPlaceholder from "../ui/LoadingPlaceholder.vue";
  import type {
    IMovie,
    IShow,
    IMediaCredits,
    ICast
  } from "../../interfaces/IList";
  import type {
    IRequestStatusResponse,
    IRequestSubmitResponse
  } from "../../interfaces/IRequestResponse";
  import { MediaTypes } from "../../interfaces/IList";

  import { humanMinutes } from "../../utils";
  import {
    getMovie,
    getShow,
    getMovieCredits,
    getShowCredits,
    request,
    getRequestStatus
    // watchLink
  } from "../../api";

  interface Props {
    id: number;
    type: MediaTypes.Movie | MediaTypes.Show;
  }

  const props = defineProps<Props>();
  const ASSET_URL = "https://image.tmdb.org/t/p/";
  const ASSET_SIZES = ["w500", "w780", "original"];

  const media: Ref<IMovie | IShow> = ref();
  const requested: Ref<boolean> = ref();
  const showTorrents: Ref<boolean> = ref();
  const showCast: Ref<boolean> = ref();
  const cast: Ref<ICast[]> = ref([]);
  const compact: Ref<boolean> = ref();
  const loading: Ref<boolean> = ref();
  const backdropElement: Ref<HTMLElement> = ref();

  const store = useStore();

  const admin = computed(() => store.getters["user/admin"]);
  const plexUserId = computed(() => store.getters["user/plexUserId"]);

  const poster = computed(() => {
    if (!media.value) return "/assets/placeholder.png";
    if (!media.value?.poster) return "/assets/no-image.svg";

    return `${ASSET_URL}${ASSET_SIZES[0]}${media.value.poster}`;
  });

  const numberOfTorrentResults = computed(() => {
    const count = store.getters["torrentModule/resultCount"];
    return count ? `${count} results` : null;
  });

  function setCast(_cast: ICast[]) {
    cast.value = _cast;
  }
  function setRequested(
    requestResponse: IRequestStatusResponse | IRequestSubmitResponse
  ) {
    if (requestResponse?.success) {
      requested.value = requestResponse?.success;
      return;
    }

    requested.value = false;
  }

  function setBackdrop(): void {
    if (
      !media.value?.backdrop ||
      !backdropElement.value?.style ||
      backdropElement.value?.style?.backgroundImage !== ""
    )
      return;

    const backdropURL = `${ASSET_URL}${ASSET_SIZES[1]}${media.value.backdrop}`;
    backdropElement.value.style.backgroundImage = `url(${backdropURL})`;
  }

  function getCredits(
    type: MediaTypes.Movie | MediaTypes.Show
  ): Promise<IMediaCredits> {
    if (type === MediaTypes.Movie) {
      return getMovieCredits(props.id);
    }
    if (type === MediaTypes.Show) {
      return getShowCredits(props.id);
    }

    return Promise.reject();
  }

  function setAndReturnMedia(_media: IMovie | IShow) {
    media.value = _media;
    return _media;
  }

  function fetchMedia() {
    if (!props.id || !props.type) {
      console.error("Unable to fetch media, requires id & type"); // eslint-disable-line no-console
      return;
    }

    let apiFunction: typeof getMovie;
    let parameters: {
      checkExistance: boolean;
      credits: boolean;
      releaseDates?: boolean;
    };

    if (props.type === MediaTypes.Movie) {
      apiFunction = getMovie;
      parameters = { checkExistance: true, credits: false };
    } else if (props.type === MediaTypes.Show) {
      apiFunction = getShow;
      parameters = { checkExistance: true, credits: false };
    }

    apiFunction(props.id, { ...parameters })
      .then(setAndReturnMedia)
      .then(() => getCredits(props.type))
      .then(credits => setCast(credits?.cast || []))
      .then(() => getRequestStatus(props.id, props.type))
      .then(requestResponse => setRequested(requestResponse))
      .then(setBackdrop);
  }

  function sendRequest() {
    request(props.id, props.type).then(requestResponse =>
      setRequested(requestResponse)
    );
  }

  function openInPlex(): boolean {
    // watchLink()
    return false;
  }

  function openTmdb() {
    const tmdbType = props.type === MediaTypes.Show ? "tv" : props.type;
    const tmdbURL = `https://www.themoviedb.org/${tmdbType}/${props.id}`;
    window.location.href = tmdbURL;
  }

  // On created functions
  fetchMedia();
  store.dispatch("torrentModule/setResultCount", null);
  // End on create functions

  onMounted(setBackdrop);
</script>

<style lang="scss" scoped>
  @import "scss/loading-placeholder";
  @import "scss/variables";
  @import "scss/media-queries";
  @import "scss/main";

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

    .torrents {
      background-color: var(--background-color);
      padding: 0 1rem;

      @include mobile {
        padding: 0 0.5rem;
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
