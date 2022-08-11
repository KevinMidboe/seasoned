<template>
  <div>
    <div class="search" :class="{ active: inputIsActive }">
      <IconSearch class="search-icon" tabindex="-1" />

      <input
        ref="inputElement"
        type="text"
        placeholder="Search for movie or show"
        aria-label="Search input for finding a movie or show"
        autocorrect="off"
        autocapitalize="off"
        tabindex="0"
        v-model="query"
        @input="handleInput"
        @click="focus"
        @keydown.escape="handleEscape"
        @keyup.enter="handleSubmit"
        @keydown.up="navigateUp"
        @keydown.down="navigateDown"
        @focus="focus"
        @blur="blur"
      />

      <IconClose
        tabindex="0"
        aria-label="button"
        v-if="query && query.length"
        @click="clearInput"
        @keydown.enter.stop="clearInput"
        class="close-icon"
      />
    </div>

    <AutocompleteDropdown
      v-if="showAutocompleteResults"
      :query="query"
      :index="dropdownIndex"
      v-model:results="dropdownResults"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from "vue";
  import { useStore } from "vuex";
  import { useRouter } from "vue-router";
  import { useRoute } from "vue-router";
  import SeasonedButton from "@/components/ui/SeasonedButton.vue";
  import AutocompleteDropdown from "@/components/header/AutocompleteDropdown.vue";
  import IconSearch from "@/icons/IconSearch.vue";
  import IconClose from "@/icons/IconClose.vue";
  import config from "../../config";
  import type { Ref } from "vue";
  import type { MediaTypes } from "../../interfaces/IList";

  interface ISearchResult {
    title: string;
    id: number;
    adult: boolean;
    type: MediaTypes;
  }

  const store = useStore();
  const router = useRouter();
  const route = useRoute();

  const query: Ref<string> = ref(null);
  const disabled: Ref<boolean> = ref(false);
  const dropdownIndex: Ref<number> = ref(-1);
  const dropdownResults: Ref<ISearchResult[]> = ref([]);
  const inputIsActive: Ref<boolean> = ref(false);
  const showAutocomplete: Ref<boolean> = ref(false);
  const inputElement: Ref<any> = ref(null);

  const isOpen = computed(() => store.getters["popup/isOpen"]);
  const showAutocompleteResults = computed(() => {
    return (
      !disabled.value &&
      inputIsActive.value &&
      query.value &&
      query.value.length > 0
    );
  });

  const params = new URLSearchParams(window.location.search);
  if (params && params.has("query")) {
    query.value = decodeURIComponent(params.get("query"));
  }

  const elasticUrl = config.ELASTIC_URL;
  if (elasticUrl === undefined || elasticUrl === "") {
    disabled.value = true;
  }

  function navigateDown() {
    if (dropdownIndex.value < dropdownResults.value.length - 1) {
      dropdownIndex.value++;
    }
  }

  function navigateUp() {
    if (dropdownIndex.value > -1) dropdownIndex.value--;

    const textLength = inputElement.value.value.length;

    setTimeout(() => {
      inputElement.value.focus();
      inputElement.value.setSelectionRange(textLength, textLength + 1);
    }, 1);
  }

  function search() {
    const encodedQuery = encodeURI(query.value.replace("/ /g", "+"));

    router.push({
      name: "search",
      query: {
        ...route.query,
        query: encodedQuery
      }
    });
  }

  function handleInput(e) {
    dropdownIndex.value = -1;
  }

  function handleSubmit() {
    if (!query.value || query.value.length == 0) return;

    if (dropdownIndex.value >= 0) {
      const resultItem = dropdownResults.value[dropdownIndex.value];

      store.dispatch("popup/open", {
        id: resultItem?.id,
        type: resultItem?.type
      });
      return;
    }

    search();
    reset();
  }

  function focus() {
    inputIsActive.value = true;
  }

  function blur(event: MouseEvent = null) {
    return setTimeout(reset, 150);
  }

  function reset() {
    inputElement.value.blur();
    dropdownIndex.value = -1;
    inputIsActive.value = false;
  }

  function clearInput(event: MouseEvent) {
    query.value = "";
    inputElement.value.focus();
  }

  function handleEscape() {
    if (!isOpen.value) reset();
  }
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
