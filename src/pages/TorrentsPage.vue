<template>
  <div>
    <page-header title="Torrent search page" />

    <section>
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
    </section>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import PageHeader from "@/components/PageHeader.vue";
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
  section {
    padding: 1.25rem;

    .search-input-group {
      display: flex;

      margin-bottom: 2rem;

      button {
        margin-left: 0.5rem;
      }
    }
  }
</style>
