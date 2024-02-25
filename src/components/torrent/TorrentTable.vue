<template>
  <table>
    <thead class="table__header noselect">
      <tr>
        <th
          v-for="column in columns"
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
          @click="expand($event, torrent.name)"
          @keydown.enter="expand($event, torrent.name)"
        >
          {{ torrent.name }}
        </td>
        <td
          @click="expand($event, torrent.name)"
          @keydown.enter="expand($event, torrent.name)"
        >
          {{ torrent.seed }}
        </td>
        <td
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
  import { ref } from "vue";
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

  const torrents: Ref<ITorrent[]> = ref(props.torrents);
  const direction: Ref<boolean> = ref(false);
  const selectedColumn: Ref<string> = ref(columns[0]);
  const prevCol: Ref<string> = ref("");

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
    expandedCol.colSpan = 4;

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
  @import "src/scss/variables";
  @import "src/scss/media-queries";
  @import "src/scss/elements";

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
    // background-color: black;
    // color: var(--color-green);
    letter-spacing: 0.8px;
    font-size: 1rem;

    th:last-of-type {
      padding-right: 0.4rem;
    }
  }

  tbody {
    // first column
    tr td:first-of-type {
      position: relative;
      padding: 0 0.3rem;
      cursor: default;
      word-break: break-all;
      border-left: 1px solid var(--table-background-color);

      @include mobile {
        max-width: 40vw;
        overflow-x: hidden;
      }
    }

    // all columns except first
    tr td:not(td:first-of-type) {
      text-align: center;
      white-space: nowrap;
    }

    // last column
    tr td:last-of-type {
      vertical-align: middle;
      cursor: pointer;
      border-right: 1px solid var(--table-background-color);

      svg {
        width: 21px;
        display: block;
        margin: auto;
        padding: 0.3rem 0;
        fill: var(--text-color);
      }
    }

    // alternate background color per row
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
