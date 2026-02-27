<template>
  <table>
    <thead class="table__header noselect">
      <tr>
        <th
          v-for="column in visibleColumns"
          :key="column"
          :class="column === selectedColumn ? 'active' : null"
          @click="sortTable(column)"
        >
          {{ column }}
          <span v-if="prevCol === column && direction">↑</span>
          <span v-if="prevCol === column && !direction">↓</span>
        </th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="torrent in torrents"
        :key="torrent.magnet"
        class="table__content"
      >
        <td
          class="torrent-info"
          @click="expand($event, torrent.name)"
          @keydown.enter="expand($event, torrent.name)"
        >
          <div class="torrent-title">{{ torrent.name }}</div>
          <div v-if="isMobile" class="torrent-meta">
            <span class="meta-item">{{ torrent.size }}</span>
            <span class="meta-separator">•</span>
            <span class="meta-item">{{ torrent.seed }} seeders</span>
          </div>
        </td>
        <td
          v-if="!isMobile"
          class="torrent-seed"
          @click="expand($event, torrent.name)"
          @keydown.enter="expand($event, torrent.name)"
        >
          {{ torrent.seed }}
        </td>
        <td
          v-if="!isMobile"
          class="torrent-size"
          @click="expand($event, torrent.name)"
          @keydown.enter="expand($event, torrent.name)"
        >
          {{ torrent.size }}
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
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from "vue";
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

  const columns: string[] = ["name", "seed", "size", "add"];
  const windowWidth = ref(window.innerWidth);
  const isMobile = computed(() => windowWidth.value <= 768);
  const visibleColumns = computed(() =>
    isMobile.value ? ["name", "add"] : columns
  );

  const torrents: Ref<ITorrent[]> = ref(props.torrents);
  const direction: Ref<boolean> = ref(false);
  const selectedColumn: Ref<string> = ref(columns[0]);
  const prevCol: Ref<string> = ref("");

  function handleResize() {
    windowWidth.value = window.innerWidth;
  }

  onMounted(() => {
    window.addEventListener("resize", handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });

  function expand(event: MouseEvent, text: string) {
    const elementClicked = event.target as HTMLElement;
    const tableRow = elementClicked.parentElement;
    const scopedStyleDataVariable = Object.keys(tableRow.dataset)[0];

    const existingExpandedElement =
      document.getElementsByClassName("expanded")[0];
    const clickedSameTwice =
      existingExpandedElement?.previousSibling?.isEqualNode(tableRow);

    if (existingExpandedElement) {
      existingExpandedElement.remove();

      // Clicked the same element twice, remove and return
      // not recreate and collapse
      if (clickedSameTwice) return;
    }

    const expandedRow = document.createElement("tr");
    const expandedCol = document.createElement("td");
    expandedRow.dataset[scopedStyleDataVariable] = "";
    expandedCol.dataset[scopedStyleDataVariable] = "";
    expandedRow.className = "expanded";
    expandedCol.innerText = text;

    // Colspan: 2 on mobile (name + add), 4 on desktop (name + seed + size + add)
    expandedCol.colSpan = isMobile.value ? 2 : 4;

    expandedRow.appendChild(expandedCol);
    tableRow.insertAdjacentElement("afterend", expandedRow);
  }

  function sortName() {
    const torrentsCopy = [...torrents.value];
    if (direction.value) {
      torrents.value = torrentsCopy.sort((a, b) => (a.name < b.name ? 1 : -1));
    } else {
      torrents.value = torrentsCopy.sort((a, b) => (a.name > b.name ? 1 : -1));
    }
  }

  function sortSeed() {
    const torrentsCopy = [...torrents.value];
    if (direction.value) {
      torrents.value = torrentsCopy.sort(
        (a, b) => parseInt(a.seed, 10) - parseInt(b.seed, 10)
      );
    } else {
      torrents.value = torrentsCopy.sort(
        (a, b) => parseInt(b.seed, 10) - parseInt(a.seed, 10)
      );
    }
  }

  function sortSize() {
    const torrentsCopy = [...torrents.value];
    if (direction.value) {
      torrents.value = torrentsCopy.sort((a, b) =>
        sortableSize(a.size) > sortableSize(b.size) ? 1 : -1
      );
    } else {
      torrents.value = torrentsCopy.sort((a, b) =>
        sortableSize(a.size) < sortableSize(b.size) ? 1 : -1
      );
    }
  }

  function sortTable(col, sameDirection = false) {
    if (prevCol.value === col && sameDirection === false) {
      direction.value = !direction.value;
    }

    if (col === "name") sortName();
    else if (col === "seed") sortSeed();
    else if (col === "size") sortSize();

    prevCol.value = col;
  }
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";
  @import "scss/elements";

  table {
    border-spacing: 0;
    margin-top: 0.5rem;
    width: 100%;
    // border-collapse: collapse;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  th,
  td {
    border: 0.5px solid var(--background-color-40);
    @include mobile {
      white-space: nowrap;
      padding: 0;
    }
  }

  thead {
    position: relative;
    user-select: none;
    -webkit-user-select: none;
    color: var(--table-header-text-color);
    text-transform: uppercase;
    cursor: pointer;
    background-color: var(--table-background-color);
    background-color: var(--highlight-color);
    letter-spacing: 0.8px;
    font-size: 1rem;

    th:last-of-type {
      padding-right: 0.4rem;
    }
  }

  tbody {
    // first column - torrent info
    .torrent-info {
      position: relative;
      padding: 0.5rem 0.6rem;
      cursor: default;
      word-break: break-word;
      border-left: 1px solid var(--table-background-color);

      @include mobile {
        width: 100%;
        padding: 0.75rem 0.5rem;
      }

      .torrent-title {
        font-weight: 500;
        margin-bottom: 0.25rem;
        line-height: 1.3;

        @include mobile {
          font-size: 0.95rem;
        }
      }

      .torrent-meta {
        font-size: 0.85rem;
        color: var(--text-color-60);
        display: flex;
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

    // seed and size columns (desktop only)
    .torrent-seed,
    .torrent-size {
      text-align: center;
      white-space: nowrap;
      padding: 0.5rem;
    }

    // last column - action
    tr td:last-of-type {
      vertical-align: middle;
      cursor: pointer;
      border-right: 1px solid var(--table-background-color);
      width: 60px;
      text-align: center;

      @include mobile {
        width: 50px;
      }

      svg {
        width: 21px;
        display: block;
        margin: auto;
        padding: 0.3rem 0;
        fill: var(--text-color);

        @include mobile {
          width: 18px;
        }
      }
    }

    // alternate background color per row
    tr {
      background-color: var(--background-color);
    }
    tr:nth-child(even) {
      background-color: var(--background-70);
    }

    // last element rounded corner border
    tr:last-of-type {
      td {
        border-bottom: 1px solid var(--table-background-color);
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
    border-left: 1px solid $text-color;
    border-right: 1px solid $text-color;
    border-bottom: 1px solid $text-color;

    td {
      white-space: normal;
      word-break: break-all;
      padding: 0.5rem 0.15rem;
      width: 100%;
    }
  }
</style>
