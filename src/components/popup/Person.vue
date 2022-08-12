<template>
  <section class="person">
    <header ref="header">
      <div class="info">
        <h1 v-if="person">
          {{ person.name }}
        </h1>
        <div v-else>
          <loading-placeholder :count="1" />
          <loading-placeholder :count="1" line-class="short" :top="3.5" />
        </div>

        <span v-if="person && person['known_for_department']" class="known-for">
          {{
            person.known_for_department === "Acting"
              ? "Actor"
              : person.known_for_department
          }}
        </span>
      </div>

      <figure class="person__poster">
        <img
          ref="poster-image"
          class="person-item__img is-loaded"
          :alt="`Image of ${person.name}`"
          :src="poster"
        />
      </figure>
    </header>

    <div v-if="loading">
      <loading-placeholder :count="6" />
      <loading-placeholder line-class="short" :top="3" />
      <loading-placeholder :count="6" line-class="fullwidth" />
      <loading-placeholder line-class="short" :top="4.5" />
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
        v-if="creditedShows.length"
        title="movies"
        :detail="`Credited in ${creditedMovies.length} movies`"
      >
        <CastList :cast="creditedMovies" />
      </Detail>

      <Detail
        v-if="creditedShows.length"
        title="shows"
        :detail="`Credited in ${creditedShows.length} shows`"
      >
        <CastList :cast="creditedShows" />
      </Detail>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { ref, computed, defineProps } from "vue";
  import CastList from "@/components/CastList.vue";
  import Detail from "@/components/popup/Detail.vue";
  import Description from "@/components/popup/Description.vue";
  import LoadingPlaceholder from "@/components/ui/LoadingPlaceholder.vue";
  import type { Ref, ComputedRef } from "vue";
  import { getPerson, getPersonCredits } from "../../api";
  import type {
    IPerson,
    IPersonCredits,
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

  const poster: ComputedRef<string> = computed(() => {
    if (!person.value) return "/assets/placeholder.png";
    if (!person.value?.poster) return "/assets/no-image.svg";

    return `${ASSET_URL}${ASSET_SIZES[0]}${person.value.poster}`;
  });

  const age: ComputedRef<string> = computed(() => {
    if (!person.value?.birthday) return "";

    const today = new Date().getFullYear();
    const birthYear = new Date(person.value.birthday).getFullYear();
    return `${today - birthYear} years old`;
  });

  function setCredits(_credits: IPersonCredits) {
    credits.value = _credits;
  }

  function setPerson(_person: IPerson) {
    person.value = _person;
  }

  function sortPopularity(a: IMovie | IShow, b: IMovie | IShow): number {
    return a.popularity < b.popularity ? 1 : -1;
  }

  function alreadyExists(
    item: IMovie | IShow,
    pos: number,
    self: Array<IMovie | IShow>
  ) {
    const names = self.map(_item => _item.title);
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

  function fetchPerson() {
    if (!props.id) {
      console.error("Unable to fetch person, missing id!"); // eslint-disable-line no-console
      return;
    }

    getPerson(props.id)
      .then(setPerson)
      .then(() => getPersonCredits(person.value?.id))
      .then(setCredits)
      .then(() => personCreditedFrom(credits.value?.cast));
  }

  // On create functions
  fetchPerson();
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
