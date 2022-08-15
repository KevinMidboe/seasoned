<template>
  <div v-if="query?.length" class="container">
    <h2 class="torrent-header-text">
      Searching for: <span class="query">{{ query }}</span>
    </h2>

    <loader v-if="loading" type="section" />
    <div v-else>
      <div v-if="torrents.length > 0" class="torrent-table">
        <torrent-table :torrents="torrents" @magnet="addTorrent" />

        <slot />
      </div>

      <div v-else class="no-results">
        <h2>No results found</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, inject, defineProps } from "vue";
  import { useStore } from "vuex";
  import Loader from "@/components/ui/Loader.vue";
  import TorrentTable from "@/components/torrent/TorrentTable.vue";
  import type { Ref } from "vue";
  import { searchTorrents, addMagnet } from "../../api";
  import type ITorrent from "../../interfaces/ITorrent";

  interface Props {
    query: string;
    tmdbId?: number;
  }

  const loading: Ref<boolean> = ref(true);
  const torrents: Ref<ITorrent[]> = ref([]);

  const props = defineProps<Props>();
  const store = useStore();
  const notifications: {
    info;
    success;
    error;
  } = inject("notifications");

  function setTorrents(_torrents: ITorrent[]) {
    torrents.value = _torrents || [];
  }

  function setLoading(state: boolean) {
    loading.value = state;
  }

  function updateResultCountDisplay() {
    store.dispatch("torrentModule/setResults", torrents.value);
    store.dispatch(
      "torrentModule/setResultCount",
      torrents.value?.length || -1
    );
  }

  function fetchTorrents() {
    if (!props.query?.length) return;

    loading.value = true;
    searchTorrents(props.query)
      .then(torrentResponse => setTorrents(torrentResponse?.results))
      .then(() => updateResultCountDisplay())
      .finally(() => setLoading(false));
  }

  function addTorrent(torrent: ITorrent) {
    const { name, magnet } = torrent;

    notifications.info({
      title: "Adding torrent 🧲",
      description: props.query,
      timeout: 3000
    });

    addMagnet(magnet, name, props.tmdbId)
      .then(() => {
        notifications.success({
          title: "Torrent added 🎉",
          description: props.query,
          timeout: 3000
        });
      })
      .catch(() => {
        notifications.error({
          title: "Failed to add torrent 🙅‍♀️",
          description: "Check console for more info",
          timeout: 3000
        });
      });
  }

  fetchTorrents();
</script>

<style lang="scss" scoped>
  @import "src/scss/variables";
  @import "src/scss/media-queries";
  @import "src/scss/elements";

  h2 {
    font-size: 20px;
  }

  .toggle {
    max-width: unset !important;
    margin: 1rem 0;
  }

  .container {
    background-color: $background-color;
  }

  .no-results {
    display: flex;
    padding-bottom: 2rem;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    align-items: center;
  }

  .torrent-header-text {
    font-weight: 300;
    text-transform: uppercase;
    font-size: 20px;
    color: var(--text-color);
    text-align: center;
    margin: 0;

    .query {
      font-weight: 500;
      white-space: pre;
    }

    @include mobile {
      text-align: left;
    }
  }

  .download {
    &__icon {
      fill: $text-color-70;
      height: 1.2rem;

      &:hover {
        fill: $text-color;
        cursor: pointer;
      }
    }

    &.active &__icon {
      fill: $green;
    }
  }
</style>
