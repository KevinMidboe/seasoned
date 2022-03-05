<template>
  <section class="profile">
    <div class="profile__content" v-if="loggedIn">
      <header class="profile__header">
        <h2 class="profile__title">{{ emoji }} Welcome {{ username }}</h2>

        <div class="button--group">
          <seasoned-button @click="toggleSettings">{{
            showSettings ? "hide settings" : "show settings"
          }}</seasoned-button>
          <seasoned-button @click="toggleActivity">{{
            showActivity ? "hide activity" : "show activity"
          }}</seasoned-button>

          <seasoned-button @click="_logout">Log out</seasoned-button>
        </div>
      </header>

      <settings v-if="showSettings" />

      <activity v-if="showActivity" />

      <list-header title="User requests" :info="resultCount" />
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

<script>
import { mapGetters, mapActions } from "vuex";
import ListHeader from "@/components/ListHeader";
import ResultsList from "@/components/ResultsList";
import Settings from "@/components/Settings";
import Activity from "@/components/ActivityPage";
import SeasonedButton from "@/components/ui/SeasonedButton";

import { getEmoji, getUserRequests, getSettings, logout } from "@/api";

export default {
  components: { ListHeader, ResultsList, Settings, Activity, SeasonedButton },
  data() {
    return {
      emoji: "",
      results: undefined,
      totalResults: undefined,
      showSettings: false,
      showActivity: false
    };
  },
  computed: {
    ...mapGetters("user", ["loggedIn", "username", "settings"]),
    resultCount() {
      if (this.results === undefined) return;

      const loadedResults = this.results.length;
      const totalResults = this.totalResults < 10000 ? this.totalResults : "∞";
      return `${loadedResults} of ${totalResults} results`;
    }
  },
  methods: {
    ...mapActions("user", ["logout", "setSettings"]),
    toggleSettings() {
      this.showSettings = this.showSettings ? false : true;

      this.updateQueryParams("settings", this.showSettings);
    },
    updateQueryParams(key, value = false) {
      const params = new URLSearchParams(window.location.search);
      if (params.has(key)) {
        params.delete(key);
      }

      if (value) {
        params.append(key, value);
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
    },
    toggleActivity() {
      this.showActivity = this.showActivity == true ? false : true;
      this.updateQueryParams("activity", this.showActivity);
    },
    _logout() {
      logout().then(() => {
        this.logout();
        this.$router.push("home");
      });
    }
  },
  created() {
    if (!this.settings) {
      getSettings().then(resp => {
        const { settings } = resp;
        if (settings) this.setSettings(settings);
      });
    }

    if (this.loggedIn) {
      this.showSettings = window.location.toString().includes("settings=true");
      this.showActivity = window.location.toString().includes("activity=true");

      getUserRequests().then(results => {
        this.results = results.results;
        this.totalResults = results.total_results;
      });

      getEmoji().then(resp => {
        const { emoji } = resp;
        this.emoji = emoji;
      });
    }
  }
};
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
