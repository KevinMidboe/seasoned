<template>
  <div class="torrents">
    <h1 class="torrents__title">Torrent Search</h1>

    <div class="search-input-group">
      <seasoned-input
        v-model="query"
        type="torrents"
        placeholder="Search torrents"
        @keydown.enter="setTorrentQuery"
      />
      <seasoned-button @click="setTorrentQuery">Search</seasoned-button>
    </div>

    <active-torrents />

    <TorrentList :query="torrentQuery" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import SeasonedInput from "@/components/ui/SeasonedInput.vue";
  import SeasonedButton from "@/components/ui/SeasonedButton.vue";
  import TorrentList from "@/components/torrent/TorrentSearchResults.vue";
  import ActiveTorrents from "@/components/torrent/ActiveTorrents.vue";
  import type { Ref } from "vue";
  import { getValueFromUrlQuery, setUrlQueryParameter } from "../utils";

  const urlQuery = getValueFromUrlQuery("query");

  const query: Ref<string> = ref(urlQuery || "");
  const torrentQuery: Ref<string> = ref(urlQuery);

  function setTorrentQuery() {
    setUrlQueryParameter("query", query.value);
    torrentQuery.value = query.value;
  }
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .torrents {
    padding: 3rem;
    max-width: 100%;

    @include mobile-only {
      padding: 0.75rem;
    }

    &__title {
      margin: 0 0 2rem 0;
      font-size: 2rem;
      font-weight: 300;
      color: $text-color;
      line-height: 1;

      @include mobile-only {
        font-size: 1.5rem;
        margin: 0 0 1rem 0;
      }
    }

    .search-input-group {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;

      @include mobile-only {
        flex-direction: column;
        gap: 0.75rem;
      }

      button {
        @include mobile-only {
          width: 100%;
        }
      }
    }
  }
</style>
