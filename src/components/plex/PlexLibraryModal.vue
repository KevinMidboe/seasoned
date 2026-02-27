<template>
  <div class="modal-overlay library-modal-overlay" @click="emit('close')">
    <div class="library-modal-content" @click.stop>
      <div class="library-modal-header">
        <div class="library-header-title">
          <div class="library-icon-large">
            <component :is="libraryIconComponent" />
          </div>
          <div>
            <h3>{{ getLibraryTitle(libraryType) }}</h3>
            <p class="library-subtitle">{{ details.total }} items</p>
          </div>
        </div>
        <button class="close-btn" @click="emit('close')">
          <IconClose />
        </button>
      </div>

      <div class="library-modal-body">
        <!-- Stats Overview -->
        <div class="library-stats-overview">
          <div class="overview-stat">
            <span class="overview-label">Total Items</span>
            <span class="overview-value">{{ details.total }}</span>
          </div>
          <div class="overview-stat" v-if="libraryType === 'shows'">
            <span class="overview-label">Episodes</span>
            <span class="overview-value">{{ details.totalEpisodes }}</span>
          </div>
          <div class="overview-stat" v-if="libraryType === 'music'">
            <span class="overview-label">Tracks</span>
            <span class="overview-value">{{ details.totalTracks }}</span>
          </div>
          <div class="overview-stat">
            <span class="overview-label">Duration</span>
            <span class="overview-value">{{ details.totalDuration }}</span>
          </div>
        </div>

        <!-- Recently Added -->
        <div class="library-section">
          <h4 class="section-title">Recently Added</h4>
          <div class="recent-items-grid">
            <PlexLibraryItem
              v-for="(item, index) in details.recentlyAdded"
              :key="index"
              :item="item"
              :show-extras="libraryType === 'music' || libraryType === 'shows'"
            />
          </div>
        </div>

        <!-- Top Genres -->
        <div class="library-section">
          <h4 class="section-title">Top Genres</h4>
          <div class="genre-list">
            <div
              v-for="(genre, index) in details.genres"
              :key="index"
              class="genre-item"
            >
              <span class="genre-name">{{ genre.name }}</span>
              <div class="genre-bar-container">
                <div
                  class="genre-bar"
                  :style="{
                    width: (genre.count / details.total) * 100 + '%'
                  }"
                ></div>
              </div>
              <span class="genre-count">{{ genre.count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import IconClose from "@/icons/IconClose.vue";
  import IconMovie from "@/icons/IconMovie.vue";
  import IconShow from "@/icons/IconShow.vue";
  import IconMusic from "@/icons/IconMusic.vue";
  import PlexLibraryItem from "@/components/plex/PlexLibraryItem.vue";
  import { getLibraryTitle } from "@/utils/plexHelpers";

  interface LibraryDetails {
    total: number;
    recentlyAdded: any[];
    genres: { name: string; count: number }[];
    totalDuration: string;
    totalEpisodes?: number;
    totalTracks?: number;
  }

  interface Props {
    libraryType: string;
    details: LibraryDetails;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    (e: "close"): void;
  }>();

  const libraryIconComponent = computed(() => {
    if (props.libraryType === "movies") return IconMovie;
    if (props.libraryType === "shows") return IconShow;
    if (props.libraryType === "music") return IconMusic;
    return IconMovie;
  });
</script>

<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .library-modal-content {
    background: #1a1a1a;
    border-radius: 12px;
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    margin-top: calc(var(--header-size) + 1rem);
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  }

  .library-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24px;
    border-bottom: 1px solid #333;
  }

  .library-header-title {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .library-icon-large {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 100%;
      height: 100%;
      fill: var(--highlight-color);
    }
  }

  .library-modal-header h3 {
    margin: 0;
    font-size: 24px;
    color: #fff;
  }

  .library-subtitle {
    margin: 4px 0 0;
    font-size: 14px;
    color: #888;
  }

  .close-btn {
    background: none;
    border: none;
    color: #888;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .close-btn:hover {
    background: #333;
    color: #fff;
  }

  .library-modal-body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
  }

  .library-stats-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }

  .overview-stat {
    background: #252525;
    padding: 16px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .overview-label {
    font-size: 12px;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .overview-value {
    font-size: 24px;
    font-weight: 600;
    color: #fff;
  }

  .library-section {
    margin-bottom: 32px;
  }

  .section-title {
    margin: 0 0 16px;
    font-size: 18px;
    color: #fff;
    font-weight: 600;
  }

  .recent-items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 20px;
  }

  .genre-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .genre-item {
    display: grid;
    grid-template-columns: 120px 1fr 60px;
    align-items: center;
    gap: 12px;
  }

  .genre-name {
    font-size: 14px;
    color: #fff;
  }

  .genre-bar-container {
    height: 8px;
    background: #333;
    border-radius: 4px;
    overflow: hidden;
  }

  .genre-bar {
    height: 100%;
    background: linear-gradient(90deg, #e5a00d 0%, #ffbf3f 100%);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .genre-count {
    font-size: 14px;
    color: #888;
    text-align: right;
  }

  @media (max-width: 768px) {
    .library-stats-overview {
      grid-template-columns: repeat(2, 1fr);
    }

    .recent-items-grid {
      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
      gap: 16px;
    }

    .genre-item {
      grid-template-columns: 100px 1fr 50px;
    }
  }
</style>
