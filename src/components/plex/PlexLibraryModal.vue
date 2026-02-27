<template>
  <div class="modal-overlay library-modal-overlay" @click="emit('close')">
    <div class="library-modal-content" @click.stop>
      <div class="library-modal-header">
        <div class="library-header-title">
          <span class="library-icon-large">
            {{ getLibraryIcon(libraryType) }}
          </span>
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
          <div class="recent-items">
            <div
              v-for="(item, index) in details.recentlyAdded"
              :key="index"
              class="recent-item"
            >
              <div class="item-poster-container">
                <img
                  v-if="item.poster"
                  :src="item.poster"
                  :alt="item.title"
                  class="item-poster-image"
                  @error="handleImageError"
                />
                <span v-if="!item.poster" class="item-poster-fallback">
                  {{ item.fallbackIcon }}
                </span>
              </div>
              <div class="item-info">
                <div class="item-title">{{ item.title }}</div>
                <div class="item-meta">
                  <span v-if="libraryType === 'music'">
                    {{ item.artist }} •
                  </span>
                  <span>{{ item.year }}</span>
                  <span v-if="item.episodes">
                    • {{ item.episodes }} episodes
                  </span>
                  <span v-if="item.tracks"> • {{ item.tracks }} tracks </span>
                </div>
              </div>
              <div class="item-rating" v-if="item.rating">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  />
                </svg>
                {{ item.rating }}
              </div>
            </div>
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
  import IconClose from "@/icons/IconClose.vue";
  import { getLibraryIcon, getLibraryTitle } from "@/utils/plexHelpers";

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

  defineProps<Props>();

  const emit = defineEmits<{
    (e: "close"): void;
  }>();

  function handleImageError(event: Event) {
    const target = event.target as HTMLElement;
    target.style.display = "none";
  }
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
    font-size: 48px;
    line-height: 1;
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

  .recent-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .recent-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px;
    background: #252525;
    border-radius: 8px;
    transition: background 0.2s;
  }

  .recent-item:hover {
    background: #2a2a2a;
  }

  .item-poster-container {
    width: 60px;
    height: 90px;
    flex-shrink: 0;
    border-radius: 6px;
    overflow: hidden;
    background: #333;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .item-poster-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .item-poster-fallback {
    font-size: 32px;
  }

  .item-info {
    flex: 1;
    min-width: 0;
  }

  .item-title {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-meta {
    font-size: 12px;
    color: #888;
  }

  .item-rating {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: #fbbf24;
    flex-shrink: 0;
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

    .genre-item {
      grid-template-columns: 100px 1fr 50px;
    }
  }
</style>
