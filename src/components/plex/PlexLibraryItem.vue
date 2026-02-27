<template>
  <div class="plex-library-item">
    <figure class="item-poster">
      <img
        v-if="item.poster"
        :src="item.poster"
        :alt="item.title"
        class="poster-image"
        @error="handleImageError"
      />
      <div v-else class="poster-fallback">
        {{ item.fallbackIcon || "📁" }}
      </div>
    </figure>

    <div class="item-details">
      <p class="item-title">{{ item.title }}</p>
      <div class="item-meta">
        <span v-if="item.year" class="item-year">{{ item.year }}</span>
        <span v-if="item.rating" class="item-rating">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            />
          </svg>
          {{ item.rating }}
        </span>
      </div>
      <div v-if="showExtras" class="item-extras">
        <span v-if="item.artist">{{ item.artist }}</span>
        <span v-if="item.episodes">{{ item.episodes }} episodes</span>
        <span v-if="item.tracks">{{ item.tracks }} tracks</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface LibraryItem {
    title: string;
    poster?: string;
    fallbackIcon?: string;
    year?: number;
    rating?: number;
    artist?: string;
    episodes?: number;
    tracks?: number;
  }

  interface Props {
    item: LibraryItem;
    showExtras?: boolean;
  }

  defineProps<Props>();

  function handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.style.display = "none";
  }
</script>

<style scoped>
  .plex-library-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .plex-library-item:hover {
    transform: translateY(-4px);
  }

  .item-poster {
    position: relative;
    width: 100%;
    aspect-ratio: 2 / 3;
    border-radius: 8px;
    overflow: hidden;
    background: #333;
    margin: 0;
  }

  .poster-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .poster-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    background: linear-gradient(135deg, #333 0%, #222 100%);
  }

  .item-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .item-title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .item-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #888;
  }

  .item-year {
    color: #aaa;
  }

  .item-rating {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #fbbf24;
  }

  .item-extras {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 11px;
    color: #888;
  }

  @media (max-width: 768px) {
    .item-title {
      font-size: 13px;
    }

    .item-meta {
      font-size: 11px;
    }
  }
</style>
