<template>
  <div>
    <div class="search-results">
      <torrent-search-results
        :query="query"
        :tmdb-id="tmdbId"
        :class="{ truncated: _truncated }"
        ><div
          v-if="_truncated"
          class="load-more"
          tabindex="0"
          role="button"
          @click="truncated = false"
          @keydown.enter="truncated = false"
        >
          <icon-arrow-down />
        </div>
      </torrent-search-results>
    </div>

    <div class="edit-query-btn-container">
      <a :href="`/torrents?query=${encodeURIComponent(props.query)}`">
        <button>
          <span class="text">View on torrent page</span
          ><span class="icon"><icon-arrow-down /></span>
        </button>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, defineProps, computed } from "vue";
  import TorrentSearchResults from "@/components/torrent/TorrentSearchResults.vue";
  import IconArrowDown from "@/icons/IconArrowDown.vue";
  import type { Ref } from "vue";
  import store from "../../store";

  interface Props {
    query: string;
    tmdbId?: number;
  }

  const props = defineProps<Props>();
  const truncated: Ref<boolean> = ref(true);

  const _truncated = computed(() => {
    const val = store.getters["torrentModule/resultCount"];
    if (val > 10 && truncated.value) return true;
    return false;
  });
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

  .search-results {
    svg {
      height: 30px;
      fill: var(--text-color);
    }
  }

  .edit-query-btn-container {
    display: flex;
    justify-content: center;
    padding: 1rem;
    padding-bottom: 2rem;

    a button {
      --height: 45px;
      transition: all 0.8s ease !important;
      position: relative;
      font-size: 1rem;
      line-height: 1.5;
      letter-spacing: 0.2px;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: 600;
      color: var(--highlight-bg, var(--background-color));
      background-color: var(--text-color);
      min-height: var(--height);
      padding: 0rem 1.5rem;
      margin: 0;
      border: 2px solid var(--text-color);
      border-radius: calc(var(--height) / 2);
      cursor: pointer;
      outline: none;
      overflow-x: hidden;

      &:hover {
        background-color: var(--highlight-bg, var(--background-color));
        color: var(--text-color);
        padding: 0 2rem;

        span.text {
          margin-left: -0.5rem;
          margin-right: 0.5rem;
        }

        span.icon {
          right: 1rem;
        }
      }

      span.icon {
        --size: 1rem;
        display: block;
        transform: rotate(-90deg);
        transform-origin: top left;
        stroke: var(--text-color);
        fill: var(--text-color);
        height: var(--size);
        width: var(--size);
        margin-top: -4px;
        position: absolute;
        right: 1rem;
        right: -1rem;
      }
    }
  }
</style>
