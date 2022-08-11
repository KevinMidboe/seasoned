<template>
  <section class="person">
    <header ref="header">
      <div class="info">
        <h1 v-if="person">
          {{ person.name }}
        </h1>
        <div v-else>
          <loading-placeholder :count="1" />
          <loading-placeholder :count="1" lineClass="short" :top="3.5" />
        </div>

        <span class="known-for" v-if="person && person['known_for_department']">
          {{
            person.known_for_department === "Acting"
              ? "Actor"
              : person.known_for_department
          }}
        </span>
      </div>

      <figure class="person__poster">
        <img
          class="person-item__img is-loaded"
          ref="poster-image"
          :src="poster"
        />
      </figure>
    </header>

    <div v-if="loading">
      <loading-placeholder :count="6" />
      <loading-placeholder lineClass="short" :top="3" />
      <loading-placeholder :count="6" lineClass="fullwidth" />
      <loading-placeholder lineClass="short" :top="4.5" />
      <loading-placeholder />
    </div>

    <div v-if="person">
      <Detail v-if="age" title="Age" :detail="age" />

      <Detail
        v-if="person"
        title="Born"
        :detail="person.place_of_birth ? person.place_of_birth : '(Not found)'"
      />

      <Detail v-if="person.biography" title="Biography">
        <Description :description="person.biography" />
      </Detail>

      <Detail
        title="movies"
        :detail="`Credited in ${creditedMovies.length} movies`"
        v-if="creditedShows.length"
      >
        <CastList :cast="creditedMovies" />
      </Detail>

      <Detail
        title="shows"
        :detail="`Credited in ${creditedShows.length} shows`"
        v-if="creditedShows.length"
      >
        <CastList :cast="creditedShows" />
      </Detail>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { ref, computed, defineProps } from "vue";
  import img from "@/directives/v-image.vue";
  import CastList from "@/components/CastList.vue";
  import Detail from "@/components/popup/Detail.vue";
  import Description from "@/components/popup/Description.vue";
  import LoadingPlaceholder from "@/components/ui/LoadingPlaceholder.vue";
  import { getPerson, getPersonCredits } from "../../api";
  import type { Ref, ComputedRef } from "vue";
  import type {
    IPerson,
    IPersonCredits,
    ICast,
    IMovie,
    IShow
  } from "../../interfaces/IList";
  import { MediaTypes } from "../../interfaces/IList";

  interface Props {
    id: number;
  }

  const props = defineProps<Props>();
  const ASSET_URL = "https://image.tmdb.org/t/p/";
  const ASSET_SIZES = ["w500", "w780", "original"];

  const person: Ref<IPerson> = ref();
  const credits: Ref<IPersonCredits> = ref();
  const loading: Ref<boolean> = ref(false);
  const creditedMovies: Ref<Array<IMovie | IShow>> = ref([]);
  const creditedShows: Ref<Array<IMovie | IShow>> = ref([]);

  const poster: ComputedRef<string> = computed(() => computePoster());
  const age: ComputedRef<string> = computed(() => {
    if (!person.value?.birthday) return;

    const today = new Date().getFullYear();
    const birthYear = new Date(person.value.birthday).getFullYear();
    return `${today - birthYear} years old`;
  });

  // On create functions
  fetchPerson();
  //

  function fetchPerson() {
    if (!props.id) {
      console.error("Unable to fetch person, missing id!");
      return;
    }

    getPerson(props.id)
      .then(_person => (person.value = _person))
      .then(() => getPersonCredits(person.value?.id))
      .then(_credits => (credits.value = _credits))
      .then(() => personCreditedFrom(credits.value?.cast));
  }

  function sortPopularity(a: IMovie | IShow, b: IMovie | IShow): number {
    return a.popularity < b.popularity ? 1 : -1;
  }

  function alreadyExists(item: IMovie | IShow, pos: number, self: any[]) {
    const names = self.map(item => item.title);
    return names.indexOf(item.title) === pos;
  }

  function personCreditedFrom(cast: Array<IMovie | IShow>): void {
    creditedMovies.value = cast
      .filter(credit => credit.type === MediaTypes.Movie)
      .filter(alreadyExists)
      .sort(sortPopularity);

    creditedShows.value = cast
      .filter(credit => credit.type === MediaTypes.Show)
      .filter(alreadyExists)
      .sort(sortPopularity);
  }

  const computePoster = () => {
    if (!person.value) return "/assets/placeholder.png";
    else if (!person.value?.poster) return "/assets/no-image.svg";

    return `${ASSET_URL}${ASSET_SIZES[0]}${person.value.poster}`;
  };
</script>

<style lang="scss" scoped>
  @import "src/scss/loading-placeholder";
  @import "src/scss/variables";
  @import "src/scss/media-queries";
  @import "src/scss/main";

  section.person {
    overflow: hidden;
    position: relative;
    padding: 40px;
    background-color: var(--background-color);

    @include mobile {
      padding: 50px 20px 10px;
    }

    &:before {
      content: "";
      display: block;
      position: absolute;
      top: -130px;
      left: -100px;
      z-index: 1;
      width: 1000px;
      height: 500px;
      transform: rotate(21deg);
      background-color: #062541;

      @include mobile {
        // top: -52vw;
        top: -215px;
      }
    }
  }

  header {
    $duration: 0.2s;
    transition: height $duration ease;
    position: relative;
    background-color: transparent;
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 350px;
    z-index: 2;

    @include mobile {
      height: 180px;
    }

    .info {
      display: flex;
      flex-direction: column;
      padding: 30px;
      padding-left: 0;
      text-align: left;

      @include mobile {
        padding: 0;
      }
    }

    h1 {
      color: $green;
      width: 100%;
      font-weight: 500;
      line-height: 1.4;
      font-size: 30px;
      margin-top: 0;

      @include mobile {
        font-size: 24px;
        margin: 10px 0;
        // padding: 30px 30px 30px 40px;
      }
    }

    .known-for {
      color: rgba(255, 255, 255, 0.8);
      font-size: 1.2rem;
    }
  }

  .person__poster {
    display: block;
    margin: auto;
    width: fit-content;
    border-radius: 10px;
    background-color: grey;
    animation: pulse 1s infinite ease-in-out;

    @keyframes pulse {
      0% {
        background-color: rgba(165, 165, 165, 0.1);
      }
      50% {
        background-color: rgba(165, 165, 165, 0.3);
      }
      100% {
        background-color: rgba(165, 165, 165, 0.1);
      }
    }

    > img {
      border-radius: 10px;
      width: 100%;

      @include mobile {
        max-width: 225px;
      }
    }
  }
</style>
