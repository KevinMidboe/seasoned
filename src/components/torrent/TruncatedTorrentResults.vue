<template>
  <div>
    <torrent-search-results
      :query="query"
      :tmdb-id="tmdbId"
      :class="{ truncated: truncated }"
      ><div
        v-if="truncated"
        class="load-more"
        tabindex="0"
        role="button"
        @click="truncated = false"
        @keydown.enter="truncated = false"
      >
        <icon-arrow-down />
      </div>
    </torrent-search-results>

    <div class="edit-query-btn-container">
      <seasonedButton @click="openInTorrentPage"
        >View on torrent page</seasonedButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import TorrentSearchResults from "@/components/torrent/TorrentSearchResults.vue";
  import SeasonedButton from "@/components/ui/SeasonedButton.vue";
  import IconArrowDown from "@/icons/IconArrowDown.vue";
  import type { Ref } from "vue";

  interface Props {
    query: string;
    tmdbId?: number;
  }

  const props = defineProps<Props>();
  const router = useRouter();

  const truncated: Ref<boolean> = ref(true);

  function openInTorrentPage() {
    if (!props.query?.length) {
      router.push("/torrents");
      return;
    }

    router.push({ path: "/torrents", query: { query: props.query } });
  }
</script>

<style lang="scss" scoped>
  :global(.truncated .torrent-table) {
    position: relative;
    max-height: 500px;
    overflow-y: hidden;
  }

  .load-more {
    position: absolute;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    bottom: 0rem;
    width: 100%;
    height: 3rem;
    cursor: pointer;
    background: linear-gradient(
      to top,
      var(--background-color) 20%,
      var(--background-0) 100%
    );
  }

  svg {
    height: 30px;
    fill: var(--text-color);
  }

  .edit-query-btn-container {
    display: flex;
    justify-content: center;
    padding: 1rem;
  }
</style>
