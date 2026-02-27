<template>
  <div class="torrent-management">
    <div class="torrent-management__header">
      <h2 class="torrent-management__title">Torrent Management</h2>
      <div class="torrent-management__controls">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search torrents..."
          class="torrent-management__search"
        />
        <select v-model="statusFilter" class="torrent-management__filter">
          <option value="">All Status</option>
          <option value="seeding">Seeding</option>
          <option value="downloading">Downloading</option>
          <option value="paused">Paused</option>
          <option value="stopped">Stopped</option>
        </select>
        <button class="refresh-btn" @click="fetchTorrents" :disabled="loading">
          <IconActivity :class="{ spin: loading }" />
        </button>
      </div>
    </div>

    <div v-if="loading" class="torrent-management__loading">
      Loading torrents...
    </div>
    <div v-else-if="error" class="torrent-management__error">{{ error }}</div>

    <table v-else class="torrent-management__table">
      <thead>
        <tr>
          <th @click="sortBy('name')" class="sortable">
            Name
            <span v-if="sortColumn === 'name'">{{
              sortDirection === "asc" ? "↑" : "↓"
            }}</span>
          </th>
          <th @click="sortBy('size')" class="sortable">
            Size
            <span v-if="sortColumn === 'size'">{{
              sortDirection === "asc" ? "↑" : "↓"
            }}</span>
          </th>
          <th @click="sortBy('seeders')" class="sortable">
            Seeders
            <span v-if="sortColumn === 'seeders'">{{
              sortDirection === "asc" ? "↑" : "↓"
            }}</span>
          </th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="torrent in filteredTorrents"
          :key="torrent.id"
          :class="{ processing: torrent.processing }"
        >
          <td class="torrent-name" :title="torrent.name">{{ torrent.name }}</td>
          <td>{{ torrent.size }}</td>
          <td>{{ torrent.seeders }}</td>
          <td>
            <span :class="['status-badge', `status-badge--${torrent.status}`]">
              {{ torrent.status }}
            </span>
          </td>
          <td class="actions">
            <button
              v-if="
                torrent.status === 'seeding' || torrent.status === 'downloading'
              "
              class="action-btn"
              title="Pause"
              @click="pauseTorrent(torrent)"
              :disabled="torrent.processing"
            >
              <IconStop />
            </button>
            <button
              v-if="torrent.status === 'paused' || torrent.status === 'stopped'"
              class="action-btn"
              title="Resume"
              @click="resumeTorrent(torrent)"
              :disabled="torrent.processing"
            >
              <IconPlay />
            </button>
            <button
              class="action-btn action-btn--danger"
              title="Delete"
              @click="deleteTorrent(torrent)"
              :disabled="torrent.processing"
            >
              <IconClose />
            </button>
            <button
              class="action-btn"
              title="Details"
              @click="showDetails(torrent)"
            >
              <IconInfo />
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="torrent-management__footer">
      <span class="torrent-count"
        >{{ filteredTorrents.length }} of {{ torrents.length }} torrents</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  import IconStop from "@/icons/IconStop.vue";
  import IconPlay from "@/icons/IconPlay.vue";
  import IconClose from "@/icons/IconClose.vue";
  import IconInfo from "@/icons/IconInfo.vue";
  import IconActivity from "@/icons/IconActivity.vue";

  interface Torrent {
    id: number;
    name: string;
    size: string;
    seeders: number;
    leechers: number;
    uploaded: string;
    downloaded: string;
    ratio: number;
    status: "seeding" | "downloading" | "paused" | "stopped";
    processing?: boolean;
  }

  const torrents = ref<Torrent[]>([]);
  const loading = ref(false);
  const error = ref("");
  const searchQuery = ref("");
  const statusFilter = ref("");
  const sortColumn = ref<keyof Torrent>("name");
  const sortDirection = ref<"asc" | "desc">("asc");

  const filteredTorrents = computed(() => {
    let result = [...torrents.value];

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(query));
    }

    if (statusFilter.value) {
      result = result.filter(t => t.status === statusFilter.value);
    }

    result.sort((a, b) => {
      const aVal = a[sortColumn.value];
      const bVal = b[sortColumn.value];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection.value === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection.value === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    return result;
  });

  function sortBy(column: keyof Torrent) {
    if (sortColumn.value === column) {
      sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
    } else {
      sortColumn.value = column;
      sortDirection.value = "asc";
    }
  }

  async function fetchTorrents() {
    loading.value = true;
    error.value = "";

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      torrents.value = [
        {
          id: 1,
          name: "Movie.Name.2024.1080p.BluRay.x264",
          size: "2.4 GB",
          seeders: 156,
          leechers: 23,
          uploaded: "45.2 GB",
          downloaded: "2.4 GB",
          ratio: 18.83,
          status: "seeding"
        },
        {
          id: 2,
          name: "TV.Show.S01E01.720p.WEB-DL",
          size: "1.2 GB",
          seeders: 89,
          leechers: 12,
          uploaded: "12.8 GB",
          downloaded: "1.2 GB",
          ratio: 10.67,
          status: "seeding"
        },
        {
          id: 3,
          name: "Documentary.2024.HDRip",
          size: "890 MB",
          seeders: 45,
          leechers: 8,
          uploaded: "2.1 GB",
          downloaded: "650 MB",
          ratio: 3.31,
          status: "downloading"
        },
        {
          id: 4,
          name: "Anime.Series.S02E10.1080p",
          size: "1.8 GB",
          seeders: 234,
          leechers: 56,
          uploaded: "89.4 GB",
          downloaded: "1.8 GB",
          ratio: 49.67,
          status: "seeding"
        },
        {
          id: 5,
          name: "Concert.2024.4K.UHD",
          size: "12.5 GB",
          seeders: 67,
          leechers: 5,
          uploaded: "0 B",
          downloaded: "0 B",
          ratio: 0,
          status: "paused"
        },
        {
          id: 6,
          name: "Drama.Series.2024.S01E05.1080p",
          size: "2.1 GB",
          seeders: 112,
          leechers: 34,
          uploaded: "8.9 GB",
          downloaded: "2.1 GB",
          ratio: 4.24,
          status: "seeding"
        },
        {
          id: 7,
          name: "Action.Movie.2024.BRRip",
          size: "1.5 GB",
          seeders: 0,
          leechers: 0,
          uploaded: "0 B",
          downloaded: "0 B",
          ratio: 0,
          status: "stopped"
        }
      ];
    } catch (e) {
      error.value = "Failed to load torrents";
    } finally {
      loading.value = false;
    }
  }

  async function pauseTorrent(torrent: Torrent) {
    torrent.processing = true;
    await new Promise(resolve => setTimeout(resolve, 500));
    torrent.status = "paused";
    torrent.processing = false;
  }

  async function resumeTorrent(torrent: Torrent) {
    torrent.processing = true;
    await new Promise(resolve => setTimeout(resolve, 500));
    torrent.status = "seeding";
    torrent.processing = false;
  }

  async function deleteTorrent(torrent: Torrent) {
    if (!confirm(`Are you sure you want to delete "${torrent.name}"?`)) return;

    torrent.processing = true;
    await new Promise(resolve => setTimeout(resolve, 500));
    torrents.value = torrents.value.filter(t => t.id !== torrent.id);
  }

  function showDetails(torrent: Torrent) {
    alert(
      `Torrent Details:\n\nName: ${torrent.name}\nSize: ${torrent.size}\nSeeders: ${torrent.seeders}\nLeechers: ${torrent.leechers}\nUploaded: ${torrent.uploaded}\nDownloaded: ${torrent.downloaded}\nRatio: ${torrent.ratio.toFixed(2)}\nStatus: ${torrent.status}`
    );
  }

  onMounted(() => {
    fetchTorrents();
  });
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .torrent-management {
    background-color: var(--background-color-secondary);
    border-radius: 0.5rem;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 100%;

    @include mobile-only {
      background-color: transparent;
      border-radius: 0;
      padding: 0;
      box-shadow: none;
      width: 100%;
      overflow-x: auto;
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 1rem;

      @include mobile-only {
        gap: 0.75rem;
        margin-bottom: 0.75rem;
      }
    }

    &__title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 400;
      color: $text-color;
      text-transform: uppercase;
      letter-spacing: 0.8px;

      @include mobile-only {
        font-size: 1rem;
        width: 100%;
      }
    }

    &__controls {
      display: flex;
      gap: 0.5rem;
      align-items: center;

      @include mobile-only {
        width: 100%;
        gap: 0.4rem;
      }
    }

    &__search {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--background-40);
      border-radius: 0.25rem;
      background-color: var(--background-color);
      color: $text-color;
      font-size: 0.85rem;

      @include mobile-only {
        flex: 1;
        min-width: 0;
        font-size: 0.8rem;
        padding: 0.4rem 0.5rem;
        max-width: calc(50% - 0.2rem - 20px);
      }

      &:focus {
        outline: none;
        border-color: var(--highlight-color);
      }
    }

    &__filter {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--background-40);
      border-radius: 0.25rem;
      background-color: var(--background-color);
      color: $text-color;
      font-size: 0.85rem;
      cursor: pointer;

      @include mobile-only {
        flex: 1;
        font-size: 0.8rem;
        padding: 0.4rem 0.5rem;
        max-width: calc(50% - 0.2rem - 20px);
      }

      &:focus {
        outline: none;
        border-color: var(--highlight-color);
      }
    }

    &__loading,
    &__error {
      padding: 2rem;
      text-align: center;
      color: $text-color-70;

      @include mobile-only {
        padding: 1.5rem;
        font-size: 0.9rem;
      }
    }

    &__error {
      color: var(--color-error-highlight);
    }

    &__footer {
      margin-top: 1rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--background-40);

      @include mobile-only {
        margin-top: 0.75rem;
        padding-top: 0.5rem;
      }
    }

    &__table {
      width: 100%;
      border-spacing: 0;
      border-radius: 0.5rem;
      overflow: hidden;

      @include mobile-only {
        display: block;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        max-width: 100%;
      }

      th,
      td {
        padding: 0.75rem 1rem;
        text-align: left;
        border-bottom: 1px solid var(--background-40);

        @include mobile-only {
          padding: 0.5rem 0.4rem;
          font-size: 0.75rem;
        }
      }

      th {
        background-color: var(--table-background-color);
        color: var(--table-header-text-color);
        text-transform: uppercase;
        font-size: 0.8rem;
        letter-spacing: 0.5px;
        font-weight: 400;

        @include mobile-only {
          font-size: 0.7rem;
          letter-spacing: 0.3px;
          white-space: nowrap;
        }

        &.sortable {
          cursor: pointer;
          user-select: none;

          &:hover {
            background-color: var(--background-80);
          }
        }
      }

      td {
        font-size: 0.85rem;
        color: $text-color;

        @include mobile-only {
          font-size: 0.75rem;
          white-space: nowrap;
        }
      }

      tbody tr {
        background-color: var(--background-color);
        transition: background-color 0.2s;

        &:nth-child(even) {
          background-color: var(--background-70);
        }

        &:hover {
          background-color: var(--background-ui);
        }

        &.processing {
          opacity: 0.6;
          pointer-events: none;
        }
      }
    }
  }

  .torrent-name {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @include mobile-only {
      max-width: 150px;
      font-size: 0.7rem;
    }
  }

  .status-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.7rem;
    text-transform: uppercase;
    font-weight: 500;

    @include mobile-only {
      font-size: 0.6rem;
      padding: 0.2rem 0.35rem;
    }

    &--seeding {
      background-color: var(--color-success);
      color: var(--color-success-text);
    }

    &--downloading {
      background-color: var(--color-warning);
      color: $black;
    }

    &--paused {
      background-color: var(--background-40);
      color: $text-color-70;
    }

    &--stopped {
      background-color: var(--color-error);
      color: $white;
    }
  }

  .actions {
    display: flex;
    gap: 0.25rem;
  }

  .action-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.35rem;
    border-radius: 0.25rem;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover:not(:disabled) {
      background-color: var(--background-40);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &--danger:hover:not(:disabled) {
      background-color: var(--color-error);

      svg {
        fill: $white;
      }
    }

    svg {
      width: 16px;
      height: 16px;
      fill: $text-color;
    }
  }

  .refresh-btn {
    background: none;
    border: 1px solid var(--background-40);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;

    @include mobile-only {
      width: 40px;
      padding: 0.4rem;
    }

    &:hover:not(:disabled) {
      background-color: var(--background-ui);
      border-color: var(--highlight-color);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    svg {
      width: 18px;
      height: 18px;
      fill: $text-color;

      @include mobile-only {
        width: 16px;
        height: 16px;
      }

      &.spin {
        animation: spin 1s linear infinite;
      }
    }
  }

  .torrent-count {
    font-size: 0.8rem;
    color: $text-color-50;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
