<template>
  <div>
    <div class="search" :class="{ active: focusingInput }">
      <IconSearch class="search-icon" tabindex="-1" />

      <input
        ref="input"
        type="text"
        placeholder="Search for movie or show"
        aria-label="Search input for finding a movie or show"
        autocorrect="off"
        autocapitalize="off"
        tabindex="0"
        v-model="query"
        @input="handleInput"
        @click="focusingInput = true"
        @keydown.escape="handleEscape"
        @keyup.enter="handleSubmit"
        @keydown.up="navigateUp"
        @keydown.down="navigateDown"
        @focus="focusingInput = true"
        @blur="focusingInput = false"
      />

      <IconClose
        tabindex="0"
        aria-label="button"
        v-if="query && query.length"
        @click="resetQuery"
        @keydown.enter.stop="resetQuery"
        class="close-icon"
      />
    </div>

    <AutocompleteDropdown
      v-if="showAutocompleteResults"
      :query="query"
      :index="dropdownIndex"
      :results.sync="dropdownResults"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import SeasonedButton from "@/components/ui/SeasonedButton";
import AutocompleteDropdown from "@/components/AutocompleteDropdown";

import IconSearch from "src/icons/IconSearch";
import IconClose from "src/icons/IconClose";
import config from "@/config.json";

export default {
  name: "SearchInput",
  components: {
    SeasonedButton,
    AutocompleteDropdown,
    IconClose,
    IconSearch
  },
  data() {
    return {
      query: null,
      disabled: false,
      dropdownIndex: -1,
      dropdownResults: [],
      focusingInput: false,
      showAutocomplete: false
    };
  },
  computed: {
    ...mapGetters("popup", ["isOpen"]),
    showAutocompleteResults() {
      return (
        !this.disabled &&
        this.focusingInput &&
        this.query &&
        this.query.length > 0
      );
    }
  },
  created() {
    const params = new URLSearchParams(window.location.search);
    if (params && params.has("query")) {
      this.query = decodeURIComponent(params.get("query"));
    }

    const elasticUrl = config.ELASTIC_URL;
    if (elasticUrl === undefined || elasticUrl === false || elasticUrl === "") {
      this.disabled = true;
    }
  },
  methods: {
    ...mapActions("popup", ["open"]),
    navigateDown() {
      if (this.dropdownIndex < this.dropdownResults.length - 1) {
        this.dropdownIndex++;
      }
    },
    navigateUp() {
      if (this.dropdownIndex > -1) this.dropdownIndex--;

      const input = this.$refs.input;
      const textLength = input.value.length;

      setTimeout(() => {
        input.focus();
        input.setSelectionRange(textLength, textLength + 1);
      }, 1);
    },
    search() {
      const encodedQuery = encodeURI(this.query.replace('/ /g, "+"'));

      this.$router.push({
        name: "search",
        query: {
          ...this.$route.query,
          query: encodedQuery
        }
      });
    },
    resetQuery(event) {
      this.query = "";
      this.$refs.input.focus();
    },
    handleInput(e) {
      this.$emit("input", this.query);
      this.dropdownIndex = -1;
    },
    handleSubmit() {
      if (!this.query || this.query.length == 0) return;

      if (this.dropdownIndex >= 0) {
        const resultItem = this.dropdownResults[this.dropdownIndex];

        console.log("resultItem:", resultItem);
        this.open({
          id: resultItem.id,
          type: resultItem.type
        });
        return;
      }

      this.search();
      this.$refs.input.blur();
      this.dropdownIndex = -1;
    },
    handleEscape() {
      if (!this.isOpen) {
        this.$refs.input.blur();
        this.dropdownIndex = -1;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/scss/variables";
@import "src/scss/media-queries";
@import "src/scss/main";

.close-icon {
  position: absolute;
  top: calc(50% - 12px);
  right: 0;
  cursor: pointer;
  fill: var(--text-color);
  height: 24px;
  width: 24px;

  @include tablet-min {
    right: 6px;
  }
}

.filter {
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

.search.active {
  input {
    border-color: var(--color-green);
  }

  .search-icon {
    fill: var(--color-green);
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
  top: 0;
  right: 55px;

  @include tablet-min {
    position: relative;
    width: 100%;
    right: 0px;
  }

  input {
    display: block;
    width: 100%;
    padding: 13px 28px 13px 45px;
    outline: none;
    margin: 0;
    border: 0;
    background-color: $background-color-secondary;
    font-weight: 300;
    font-size: 18px;
    color: $text-color;
    border-bottom: 1px solid transparent;

    &:focus {
      // border-bottom: 1px solid var(--color-green);
      border-color: var(--color-green);
    }

    @include tablet-min {
      font-size: 24px;
      padding: 13px 40px 13px 60px;
    }
  }

  &-icon {
    width: 20px;
    height: 20px;
    fill: var(--text-color-50);
    pointer-events: none;
    position: absolute;
    left: 15px;
    top: calc(50% - 10px);

    @include tablet-min {
      width: 24px;
      height: 24px;
      top: calc(50% - 12px);
      left: 22px;
    }
  }
}
</style>
