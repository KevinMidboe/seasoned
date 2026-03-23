<template>
  <div class="torrent-table">
    <div class="sort-toggle">
      <span class="sort-label">Sort by:</span>
      <div class="sort-options">
        <button
          v-for="option in sortOptions"
          :key="option.value"
          :class="['sort-btn', { active: selectedSort === option.value }]"
          @click="changeSort(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <table>
      <thead class="table__header noselect">
        <tr>
          <th
            class="name-header"
            :class="selectedSort === 'name' ? 'active' : null"
            @click="changeSort('name')"
          >
            Name
            <span v-if="selectedSort === 'name'">{{
              direction ? "↑" : "↓"
            }}</span>
          </th>
          <th class="add-header">Add</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="torrent in sortedTorrents"
          :key="torrent.magnet"
          class="table__content"
        >
          <td
            class="torrent-info"
            @click="expand($event, torrent.name)"
            @keydown.enter="expand($event, torrent.name)"
          >
            <div class="torrent-title">{{ torrent.name }}</div>
            <div class="torrent-meta">
              <span class="meta-item">{{ torrent.size }}</span>
              <span class="meta-separator">•</span>
              <span class="meta-item">{{ torrent.seed }} seeders</span>
            </div>
          </td>
          <td
            class="download"
            @click="() => emit('magnet', torrent)"
            @keydown.enter="() => emit('magnet', torrent)"
          >
            <IconMagnet />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from "vue";
  import IconMagnet from "@/icons/IconMagnet.vue";
  import type { Ref } from "vue";
  import { sortableSize } from "../../utils";
  import type ITorrent from "../../interfaces/ITorrent";

  interface Props {
    torrents: Array<ITorrent>;
  }

  interface Emit {
    (e: "magnet", torrent: ITorrent): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emit>();

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "size", label: "Size" },
    { value: "seed", label: "Seeders" }
  ];

  const torrents: Ref<ITorrent[]> = ref(props.torrents);
  const direction: Ref<boolean> = ref(false);
  const selectedSort: Ref<string> = ref("size");
  const prevSort: Ref<string> = ref("");

  const sortedTorrents = computed(() => {
    const sorted = [...torrents.value];

    if (selectedSort.value === "name") {
      sorted.sort((a, b) =>
        direction.value
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    } else if (selectedSort.value === "size") {
      sorted.sort((a, b) =>
        direction.value
          ? sortableSize(a.size) - sortableSize(b.size)
          : sortableSize(b.size) - sortableSize(a.size)
      );
    } else if (selectedSort.value === "seed") {
      sorted.sort((a, b) =>
        direction.value
          ? parseInt(a.seed, 10) - parseInt(b.seed, 10)
          : parseInt(b.seed, 10) - parseInt(a.seed, 10)
      );
    }

    return sorted;
  });

  function changeSort(sortBy: string) {
    if (prevSort.value === sortBy) {
      direction.value = !direction.value;
    } else {
      direction.value = false;
      selectedSort.value = sortBy;
    }
    prevSort.value = sortBy;
  }

  function expand(event: MouseEvent, text: string) {
    return;
    const elementClicked = event.target as HTMLElement;
    const tableRow = elementClicked.parentElement;
    const scopedStyleDataVariable = Object.keys(tableRow.dataset)[0];

    const existingExpandedElement =
      document.getElementsByClassName("expanded")[0];
    const clickedSameTwice =
      existingExpandedElement?.previousSibling?.isEqualNode(tableRow);

    if (existingExpandedElement) {
      existingExpandedElement.remove();

      if (clickedSameTwice) return;
    }

    const expandedRow = document.createElement("tr");
    const expandedCol = document.createElement("td");
    expandedRow.dataset[scopedStyleDataVariable] = "";
    expandedCol.dataset[scopedStyleDataVariable] = "";
    expandedRow.className = "expanded";
    expandedCol.innerText = text;

    expandedCol.colSpan = 2;

    expandedRow.appendChild(expandedCol);
    tableRow.insertAdjacentElement("afterend", expandedRow);
  }
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";
  @import "scss/elements";

  .torrent-table {
    width: 100%;
  }

  .sort-toggle {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    flex-wrap: wrap;

    .sort-label {
      font-size: 0.85rem;
      color: var(--text-color-70);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .sort-options {
      display: flex;
      gap: 0.25rem;
    }

    .sort-btn {
      border: 1px solid var(--highlight-bg, var(--background-color-40));
      color: var(--text-color-70);
      padding: 0.35rem 0.65rem;
      font-size: 0.8rem;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      &:hover {
        background: var(--highlight-bg, var(--background-color));
        color: var(--text-color);
      }

      &.active {
        background: var(--highlight-color);
        color: var(--text-color);
        border-color: var(--highlight-color, $green);
      }

      @include mobile {
        padding: 0.4rem 0.6rem;
        font-size: 0.75rem;
      }
    }
  }

  table {
    border-spacing: 0;
    margin-top: 0.5rem;
    width: 100%;
    max-width: 100%;
    border-radius: 0.5rem;
    overflow: hidden;
    table-layout: auto;
  }

  th,
  td {
    overflow: hidden;
    text-overflow: ellipsis;

    @include mobile {
      padding: 0;
    }
  }

  thead {
    position: relative;
    user-select: none;
    -webkit-user-select: none;
    color: var(--highlight-bg, var(--table-header-text-color));
    text-transform: uppercase;
    cursor: pointer;
    background-color: var(--highlight-color, var(--highlight-color));
    letter-spacing: 0.8px;
    font-size: 1rem;

    th:last-of-type {
      padding: 0 0.4rem;
      border-left: 1px solid var(--highlight-bg, var(--background-color));
    }
  }

  tbody {
    // first column - torrent info
    .torrent-info {
      position: relative;
      padding: 0.5rem 0.6rem;
      cursor: default;
      word-break: break-word;
      border-left: 1px solid var(--highlight-color);

      @include mobile {
        width: 100%;
        padding: 0.75rem 0.5rem;
      }

      .torrent-title {
        font-weight: 500;
        margin-bottom: 0.25rem;
        line-height: 1.3;
        word-break: break-word;
        overflow-wrap: break-word;

        @include mobile {
          font-size: 0.95rem;
        }
      }

      .torrent-meta {
        font-size: 0.85rem;
        display: flex;
        opacity: 70%;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-top: 0.25rem;

        .meta-item {
          white-space: nowrap;
        }

        .meta-separator {
          color: var(--text-color-40);
        }
      }
    }

    // last column - action
    tr td:last-of-type {
      vertical-align: middle;
      cursor: pointer;
      border-right: 1px solid var(--highlight-color);
      max-width: 60px;
      text-align: center;

      @include mobile {
        width: 50px;
      }

      svg {
        width: 21px;
        display: block;
        margin: auto;
        padding: 0.3rem 0;
        fill: var(inherit, var(--text-color));

        @include mobile {
          width: 18px;
        }
      }
    }

    // alternate background color per row
    tr {
      background-color: var(--highlight-bg, var(--background-90));
      color: var(--text-color);

      td {
        border-left: 1px solid var(--highlight-color);
        fill: var(--text-color);
      }
    }
    tr:nth-child(odd) {
      background: rgba(0, 0, 0, 0.15);
    }

    // last element rounded corner border
    tr:last-of-type {
      td {
        border-bottom: 1px solid var(--highlight-color);
        border-left: 1px solid var(--highlight-color);
      }

      td:first-of-type {
        border-bottom-left-radius: 0.5rem;
      }

      td:last-of-type {
        border-bottom-right-radius: 0.5rem;
      }
    }
  }

  .expanded {
    padding: 0.25rem 1rem;
    max-width: 100%;
    border-left: 1px solid var(--text-color);
    border-right: 1px solid var(--text-color);
    border-bottom: 1px solid var(--text-color);

    td {
      white-space: normal;
      word-break: break-all;
      padding: 0.5rem 0.15rem;
      width: 100%;
      color: var(--text-color);
    }
  }
</style>
