<template>
  <div>
    <div class="search">
      <input
        ref="input"
        type="text"
        placeholder="Search for movie or show"
        aria-label="Search input for finding a movie or show"
        autocorrect="off"
        autocapitalize="off"
        tabindex="1"
        v-model="query"
        @input="handleInput"
        @click="focus = true"
        @keydown.escape="handleEscape"
        @keyup.enter="handleSubmit"
        @keydown.up="navigateUp"
        @keydown.down="navigateDown"
      />

      <svg class="search-icon" fill="currentColor" @click="handleSubmit">
        <use xlink:href="#iconSearch"></use>
      </svg>
    </div>

    <transition name="fade">
      <div class="dropdown" v-if="!disabled && focus && query.length > 0">
        <div class="filter">
          <h2>Filter your search:</h2>

          <div class="filter-items">
            <toggle-button
              :options="searchTypes"
              :selected.sync="selectedSearchType"
            />

            <label
              >Adult
              <input type="checkbox" value="adult" v-model="adult" />
            </label>
          </div>
        </div>

        <hr />

        <div class="dropdown-results" v-if="elasticSearchResults.length">
          <ul
            v-for="(item, index) in elasticSearchResults"
            @click="openResult(item, index + 1)"
            :class="{ active: index + 1 === selectedResult }"
          >
            {{
              item.name
            }}
          </ul>
        </div>

        <div v-else class="dropdown">
          <div class="dropdown-results">
            <h2 class="not-found">
              No results for query: <b>{{ query }}</b>
            </h2>
          </div>
        </div>

        <seasoned-button
          class="end-section"
          fullWidth="true"
          @click="focus = false"
          :active="elasticSearchResults.length + 1 === selectedResult"
        >
          close
        </seasoned-button>
      </div>
    </transition>
  </div>
</template>

<script>
import SeasonedButton from "@/components/ui/SeasonedButton";
import ToggleButton from "@/components/ui/ToggleButton";

import { elasticSearchMoviesAndShows } from "@/api";
import config from "@/config.json";

export default {
  name: "SearchInput",
  components: {
    SeasonedButton,
    ToggleButton
  },
  props: ["value"],
  data() {
    return {
      adult: true,
      searchTypes: ["all", "movie", "show", "person"],
      selectedSearchType: "all",

      query: this.value,
      focus: false,
      disabled: false,
      scrollListener: undefined,
      scrollDistance: 0,
      elasticSearchResults: [],
      selectedResult: 0
    };
  },
  watch: {
    focus: function (val) {
      if (val === true) {
        window.addEventListener("scroll", this.disableFocus);
      } else {
        window.removeEventListener("scroll", this.disableFocus);
        this.scrollDistance = 0;
      }
    },
    adult: function (value) {
      this.handleInput();
    }
  },
  beforeMount() {
    const elasticUrl = config.ELASTIC_URL;
    if (elasticUrl === undefined || elasticUrl === false || elasticUrl === "") {
      this.disabled = true;
    }
  },
  beforeDestroy() {
    console.log("scroll eventlistener not removed, destroying!");
    window.removeEventListener("scroll", this.disableFocus);
  },
  methods: {
    navigateDown() {
      this.focus = true;
      this.selectedResult++;
    },
    navigateUp() {
      this.focus = true;
      this.selectedResult--;
      const input = this.$refs.input;
      const textLength = input.value.length;

      setTimeout(() => {
        input.focus();
        input.setSelectionRange(textLength, textLength + 1);
      }, 1);
    },
    openResult(item, index) {
      this.selectedResult = index;
      this.$popup.open(item.id, item.type);
    },
    handleInput(e) {
      this.selectedResult = 0;
      this.$emit("input", this.query);

      if (!this.focus) {
        this.focus = true;
      }

      elasticSearchMoviesAndShows(this.query).then(resp => {
        const data = resp.hits.hits;

        let results = data.map(item => {
          const index = item._index.slice(0, -1);
          if (index === "movie" || item._source.original_title) {
            return {
              name: item._source.original_title,
              id: item._source.id,
              adult: item._source.adult,
              type: "movie"
            };
          } else if (index === "show" || item._source.original_name) {
            return {
              name: item._source.original_name,
              id: item._source.id,
              adult: item._source.adult,
              type: "show"
            };
          }
        });
        results = this.removeDuplicates(results);
        this.elasticSearchResults = results;
      });
    },
    removeDuplicates(searchResults) {
      let filteredResults = [];
      searchResults.map(result => {
        const numberOfDuplicates = filteredResults.filter(
          filterItem => filterItem.id == result.id
        );
        if (numberOfDuplicates.length >= 1) {
          return null;
        }
        filteredResults.push(result);
      });

      if (this.adult == false) {
        filteredResults = filteredResults.filter(
          result => result.adult == false
        );
      }

      return filteredResults;
    },
    handleSubmit() {
      let searchResults = this.elasticSearchResults;

      if (this.selectedResult > searchResults.length) {
        this.focus = false;
        this.selectedResult = 0;
      } else if (this.selectedResult > 0) {
        const resultItem = searchResults[this.selectedResult - 1];
        this.$popup.open(resultItem.id, resultItem.type);
      } else {
        const encodedQuery = encodeURI(this.query.replace('/ /g, "+"'));
        const media_type =
          this.selectedSearchType !== "all" ? this.selectedSearchType : null;
        this.$router.push({
          name: "search",
          query: { query: encodedQuery, adult: this.adult, media_type }
        });
        this.focus = false;
        this.selectedResult = 0;
      }
    },
    handleEscape() {
      if (this.$popup.isOpen) {
        console.log("THIS WAS FUCKOING OPEN!");
      } else {
        this.focus = false;
      }
    },
    disableFocus(_) {
      this.focus = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./src/scss/variables";
@import "./src/scss/media-queries";
@import "./src/scss/main";

.fade-enter-active {
  transition: opacity 0.2s;
}
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.filter {
  // background-color: rgba(004, 122, 125, 0.2);
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 1rem 2rem;

  h2 {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    font-weight: 400;
  }

  &-items {
    display: flex;
    flex-direction: row;
    align-items: center;

    > :not(:first-child) {
      margin-left: 1rem;
    }
  }
}

hr {
  display: block;
  height: 1px;
  border: 0;
  border-bottom: 1px solid $text-color-50;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 90%;
}

.dropdown {
  width: 100%;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  z-index: 5;
  min-height: $header-size;
  right: 0px;
  background-color: $background-color-secondary;

  @include mobile-only {
    position: fixed;
    top: 50px;
    padding-top: 20px;
    width: calc(100%);
  }

  .not-found {
    font-weight: 400;
  }

  &-results {
    padding-left: 60px;
    width: 100%;

    @include mobile-only {
      padding-left: 45px;
    }

    > ul {
      font-size: 1.3rem;
      padding: 0;
      margin: 0.2rem 0;
      width: calc(100% - 25px);
      max-width: fit-content;

      list-style: none;
      color: rgba(0, 0, 0, 0.5);
      text-transform: capitalize;
      cursor: pointer;
      border-bottom: 2px solid transparent;

      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      color: $text-color-50;

      &.active,
      &:hover,
      &:active {
        color: $text-color;
        border-bottom: 2px solid $text-color;
      }
    }
  }
}

.search {
  height: $header-size;
  display: flex;
  position: fixed;
  flex-wrap: wrap;
  z-index: 5;
  border: 0;
  background-color: $background-color-secondary;

  // TODO check if this is for mobile
  width: calc(100% - 110px);
  bottom: 0;
  right: 55px;

  @include tablet-min {
    position: relative;
    width: 100%;
    right: 0px;
  }

  input {
    display: block;
    width: 100%;
    padding: 13px 0 13px 45px;
    outline: none;
    margin: 0;
    border: 0;
    background-color: $background-color-secondary;
    font-weight: 300;
    font-size: 19px;
    color: $text-color;
    transition: background-color 0.5s ease, color 0.5s ease;

    @include tablet-min {
      padding: 13px 30px 13px 60px;
    }
  }

  &-icon {
    width: 20px;
    height: 20px;
    fill: $text-color-50;
    transition: fill 0.5s ease;
    pointer-events: none;
    position: absolute;
    left: 15px;
    top: 15px;

    @include tablet-min {
      top: 27px;
      left: 25px;
    }
  }
}
</style>
