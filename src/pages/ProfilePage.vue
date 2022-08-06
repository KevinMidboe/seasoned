<template>
  <section class="profile">
    <div class="profile__content" v-if="loggedIn">
      <header class="profile__header">
        <h2 class="profile__title">{{ emoji }} Welcome {{ username }}</h2>

        <div class="button--group">
          <seasoned-button @click="toggleSettings" :active="showSettings">{{
            showSettings ? "hide settings" : "show settings"
          }}</seasoned-button>
          <seasoned-button @click="toggleActivity" :active="showActivity">{{
            showActivity ? "hide activity" : "show activity"
          }}</seasoned-button>

          <seasoned-button @click="_logout">Log out</seasoned-button>
        </div>
      </header>

      <settings v-if="showSettings" />

      <activity v-if="showActivity" />

      <page-header title="Your requests" :info="resultCount" />
      <results-list v-if="results" :results="results" />
    </div>

    <section class="not-found" v-if="!loggedIn">
      <div class="not-found__content">
        <h2 class="not-found__title">Authentication Request Failed</h2>
        <router-link :to="{ name: 'signin' }" exact title="Sign in here">
          <button class="not-found__button button">Sign In</button>
        </router-link>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
  import { ref, computed } from "vue";
  import { useStore } from "vuex";
  import PageHeader from "@/components/PageHeader.vue";
  import ResultsList from "@/components/ResultsList.vue";
  import Settings from "@/pages/SettingsPage.vue";
  import Activity from "@/pages/ActivityPage.vue";
  import SeasonedButton from "@/components/ui/SeasonedButton.vue";
  import { getEmoji, getUserRequests, getSettings, logout } from "../api";
  import type { Ref, ComputedRef } from "vue";
  import type { ListResults } from "../interfaces/IList";

  const emoji: Ref<string> = ref("");
  const results: Ref<Array<ListResults>> = ref([]);
  const totalResults: Ref<number> = ref(-1);
  const showSettings: Ref<boolean> = ref();
  const showActivity: Ref<boolean> = ref();

  const store = useStore();

  const loggedIn: Ref<boolean> = computed(() => store.getters["user/loggedIn"]);
  const username: Ref<string> = computed(() => store.getters["user/username"]);
  const settings: Ref<object> = computed(() => store.getters["user/settings"]);

  const resultCount: ComputedRef<number | string> = computed(() => {
    const currentCount = results?.value?.length || 0;
    const totalCount = totalResults.value < 10000 ? totalResults.value : "∞";
    return `${currentCount} of ${totalCount} results`;
  });

  // Component loaded actions
  getUserRequests().then(requestResults => {
    if (!requestResults?.results) return;
    results.value = requestResults.results;
    totalResults.value = requestResults.total_results;
  });

  getEmoji().then(resp => (emoji.value = resp?.emoji));

  showSettings.value = window.location.toString().includes("settings=true");
  showActivity.value = window.location.toString().includes("activity=true");
  // Component loaded actions end

  function toggleSettings() {
    showSettings.value = !showSettings.value;
    updateQueryParams("settings", showSettings.value);
  }

  function toggleActivity() {
    showActivity.value = !showActivity.value;
    updateQueryParams("activity", showActivity.value);
  }

  function _logout() {
    store.dispatch("user/logout");
  }

  function updateQueryParams(key, value = false) {
    const params = new URLSearchParams(window.location.search);
    if (params.has(key)) {
      params.delete(key);
    }

    if (value) {
      params.append(key, `${value}`);
    }

    window.history.replaceState(
      {},
      "search",
      `${window.location.protocol}//${window.location.hostname}${
        window.location.port ? `:${window.location.port}` : ""
      }${window.location.pathname}${
        params.toString().length ? `?${params}` : ""
      }`
    );
  }
</script>

<style lang="scss" scoped>
  @import "src/scss/variables";
  @import "src/scss/media-queries";

  .button--group {
    display: flex;
  }

  // DUPLICATE CODE
  .profile {
    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      border-bottom: 1px solid $text-color-5;

      @include mobile-only {
        flex-direction: column;
        align-items: flex-start;

        .button--group {
          padding-top: 2rem;
        }
      }

      @include tablet-min {
        padding: 29px 30px;
      }
      @include tablet-landscape-min {
        padding: 29px 50px;
      }
      @include desktop-min {
        padding: 29px 60px;
      }
    }
    &__title {
      margin: 0;
      font-size: 16px;
      line-height: 16px;
      color: $text-color;
      font-weight: 300;
      @include tablet-min {
        font-size: 18px;
        line-height: 18px;
      }
    }
  }
</style>
