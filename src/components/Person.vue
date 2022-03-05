<template>
  <section class="person">
    <header ref="header">
      <div class="info">
        <h1 v-if="person">
          {{ person.title || person.name }}
        </h1>
        <loading-placeholder v-else :count="1" />

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
          src="/assets/placeholder.png"
        />
      </figure>
    </header>

    <div v-if="person">
      <MovieDetail v-if="age" title="Age" :detail="age" />

      <MovieDetail
        v-if="person"
        title="Born"
        :detail="person.place_of_birth ? person.place_of_birth : '(Not found)'"
      />

      <MovieDetail v-if="person.biography" title="Biography">
        <MovieDescription :description="person.biography" />
      </MovieDetail>

      <MovieDetail title="movies" v-if="credits">
        <Cast :cast="movieCredits" />
      </MovieDetail>

      <MovieDetail title="shows" v-if="credits">
        <Cast :cast="showCredits" />
      </MovieDetail>
    </div>
  </section>
</template>

<script>
import img from "@/directives/v-image";
import Cast from "./Cast";
import MovieDetail from "./ui/MovieDetail";
import MovieDescription from "./ui/MovieDescription";
import LoadingPlaceholder from "./ui/LoadingPlaceholder";

import { getPerson, getPersonCredits } from "@/api";

export default {
  props: {
    id: {
      required: true,
      type: Number
    },
    type: {
      required: false,
      type: String,
      default: "person"
    }
  },
  components: {
    MovieDetail,
    MovieDescription,
    Cast,
    LoadingPlaceholder
  },
  directives: { img: img }, // TODO decide to remove or use
  data() {
    return {
      ASSET_URL: "https://image.tmdb.org/t/p/",
      ASSET_SIZES: ["w500", "w780", "original"],
      person: undefined,
      loading: true,
      credits: undefined
    };
  },
  watch: {
    id: function (val) {
      if (this.type === "person") {
        this.fetchperson(val);
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
    age: function () {
      if (!this.person || !this.person.birthday) {
        return;
      }

      const today = new Date().getFullYear();
      const birthYear = new Date(this.person.birthday).getFullYear();
      return `${today - birthYear} years old`;
    },
    movieCredits: function () {
      const { cast } = this.credits;
      if (!cast) return;

      return cast
        .filter(l => l.media_type === "movie")
        .filter((item, pos, self) => self.indexOf(item) == pos)
        .sort((a, b) => a.popularity < b.popularity);
    },
    showCredits: function () {
      const { cast } = this.credits;
      if (!cast) return;

      const alreadyExists = (item, pos, self) => {
        const names = self.map(item => item.name);
        return names.indexOf(item.name) == pos;
      };

      return cast
        .filter(item => item.media_type === "tv")
        .filter(alreadyExists)
        .sort((a, b) => a.popularity < b.popularity);
    }
  },
  methods: {
    parseResponse(person) {
      this.loading = false;
      this.person = { ...person };
      this.title = person.title;
      this.poster = person.poster;

      this.setPosterSrc();
    },
    setPosterSrc() {
      const poster = this.$refs["poster-image"];
      if (this.poster == null) {
        poster.src = "/assets/no-image.svg";
        return;
      }

      poster.src = `${this.ASSET_URL}${this.ASSET_SIZES[0]}${this.poster}`;
    }
  },
  created() {
    getPerson(this.id, true)
      .then(this.parseResponse)
      .catch(error => {
        console.error(error);
        this.$router.push({ name: "404" });
      });

    getPersonCredits(this.id, true)
      .then(credits => (this.credits = credits))
      .catch(error => {
        console.error(error);
        this.$router.push({ name: "404" });
      });
  }
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

  > img {
    border-radius: 10px;
    width: 100%;

    @include mobile {
      max-width: 225px;
    }
  }
}
</style>
