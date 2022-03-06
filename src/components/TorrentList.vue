<template>
  <div v-if="show" class="container">
    <h2 class="torrentHeader-text editable">
      Searching for:
      <span :contenteditable="!edit" @input="this.handleInput">{{
        query
      }}</span>

      <IconSearch
        class="icon"
        v-if="editedSearchQuery && editedSearchQuery.length"
      />
      <IconEdit v-else class="icon" @click="() => (this.edit = !this.edit)" />
    </h2>

    <div v-if="!loading">
      <div v-if="torrents.length > 0">
        <table>
          <thead class="table__header noselect">
            <tr>
              <th
                v-for="column in columns"
                :key="column"
                @click="sortTable(column)"
                :class="column === this.selectedColumn ? 'active' : null"
              >
                {{ column }}
                <span v-if="prevCol === column && direction">↑</span>
                <span v-if="prevCol === column && !direction">↓</span>
              </th>
            </tr>
            <!--             <th
              @click="sortTable('name')"
              :class="selectedSortableClass('name')"
            >
              <span>Name</span>
              <span v-if="prevCol === 'name' && direction">↑</span>
              <span v-if="prevCol === 'name' && !direction">↓</span>
            </th>
            <th
              @click="sortTable('seed')"
              :class="selectedSortableClass('seed')"
            >
              <span>Seed</span>
              <span v-if="prevCol === 'seed' && direction">↑</span>
              <span v-if="prevCol === 'seed' && !direction">↓</span>
            </th>
            <th
              @click="sortTable('size')"
              :class="selectedSortableClass('size')"
            >
              <span>Size</span>
              <span v-if="prevCol === 'size' && direction">↑</span>
              <span v-if="prevCol === 'size' && !direction">↓</span>
            </th>

            <th>
              <span>Magnet</span>
            </th> -->
          </thead>

          <tbody>
            <tr
              v-for="torrent in torrents"
              class="table__content"
              :key="torrent.magnet"
            >
              <td @click="expand($event, torrent.name)">{{ torrent.name }}</td>
              <td @click="expand($event, torrent.name)">{{ torrent.seed }}</td>
              <td @click="expand($event, torrent.name)">{{ torrent.size }}</td>
              <td
                @click="sendTorrent(torrent.magnet, torrent.name, $event)"
                class="download"
              >
                <IconMagnet />
              </td>
            </tr>
          </tbody>
        </table>

        <div style="display: flex; justify-content: center; padding: 1rem">
          <seasonedButton @click="resetTorrentsAndToggleEditSearchQuery"
            >Edit search query</seasonedButton
          >
        </div>
      </div>

      <div
        v-else
        style="
          display: flex;
          padding-bottom: 2rem;
          justify-content: center;
          flex-direction: column;
          width: 100%;
          align-items: center;
        "
      >
        <h2>No results found</h2>
        <br />

        <div class="editQuery" v-if="editSearchQuery">
          <seasonedInput
            placeholder="Torrent query"
            :value.sync="editedSearchQuery"
            @enter="fetchTorrents(editedSearchQuery)"
          />

          <div style="height: 45px; width: 5px"></div>

          <seasonedButton @click="fetchTorrents(editedSearchQuery)"
            >Search</seasonedButton
          >
        </div>

        <seasonedButton
          @click="toggleEditSearchQuery"
          :active="editSearchQuery ? true : false"
          >Edit search query</seasonedButton
        >
      </div>
    </div>
    <div v-else class="torrentloader"><i></i></div>
  </div>
</template>

<script>
import storage from "@/storage";
import store from "@/store";
import { sortableSize } from "@/utils";
import { searchTorrents, addMagnet } from "@/api";

import IconMagnet from "../icons/IconMagnet";
import IconEdit from "../icons/IconEdit";
import IconSearch from "../icons/IconSearch";

import SeasonedButton from "@/components/ui/SeasonedButton";
import SeasonedInput from "@/components/ui/SeasonedInput";
import ToggleButton from "@/components/ui/ToggleButton";

export default {
  components: {
    IconMagnet,
    IconEdit,
    IconSearch,
    SeasonedButton,
    SeasonedInput,
    ToggleButton
  },
  props: {
    query: {
      type: String,
      require: true
    },
    tmdb_id: {
      type: Number,
      require: true
    },
    tmdb_type: String,
    admin: Boolean,
    show: Boolean
  },
  data() {
    return {
      edit: true,
      loading: false,
      torrents: [],
      torrentResponse: undefined,
      currentPage: 0,
      prevCol: "",
      direction: false,
      release_types: ["all"],
      selectedRelaseType: "all",
      editSearchQuery: false,
      editedSearchQuery: "",

      columns: ["name", "seed", "size", "magnet"],
      selectedColumn: null
    };
  },
  created() {
    this.fetchTorrents().then(_ => this.sortTable("size"));
  },
  watch: {
    selectedRelaseType: function (newValue) {
      this.applyFilter(newValue);
    }
  },
  methods: {
    selectedSortableClass(headerName) {
      return headerName === this.prevCol ? "active" : "";
    },
    resetTorrentsAndToggleEditSearchQuery() {
      this.torrents = [];
      this.toggleEditSearchQuery();
    },
    toggleEditSearchQuery() {
      this.editSearchQuery = !this.editSearchQuery;
    },
    expand(event, name) {
      const existingExpandedElement =
        document.getElementsByClassName("expanded")[0];

      const clickedElement = event.target.parentNode;
      const scopedStyleDataVariable = Object.keys(clickedElement.dataset)[0];

      if (existingExpandedElement) {
        const expandedSibling =
          event.target.parentNode.nextSibling.className === "expanded";

        existingExpandedElement.remove();
        const table = document.getElementsByTagName("table")[0];
        table.style.display = "block";

        if (expandedSibling) {
          return;
        }
      }

      const nameRow = document.createElement("tr");
      const nameCol = document.createElement("td");
      nameRow.className = "expanded";
      nameRow.dataset[scopedStyleDataVariable] = "";
      nameCol.innerText = name;
      nameCol.dataset[scopedStyleDataVariable] = "";

      nameRow.appendChild(nameCol);

      clickedElement.insertAdjacentElement("afterend", nameRow);
    },
    sendTorrent(magnet, name, event) {
      this.$notifications.info({
        title: "Adding torrent 🦜",
        description: this.query,
        timeout: 3000
      });

      event.target.parentNode.classList.add("active");
      addMagnet(magnet, name, this.tmdb_id)
        .catch(resp => {
          console.log("error:", resp.data);
        })
        .then(resp => {
          console.log("addTorrent resp: ", resp);
          this.$notifications.success({
            title: "Torrent added 🎉",
            description: this.query,
            timeout: 3000
          });
        });
    },
    sortTable(col, sameDirection = false) {
      if (this.prevCol === col && sameDirection === false) {
        this.direction = !this.direction;
      }

      if (col === "name") this.sortName();
      else if (col === "seed") this.sortSeed();
      else if (col === "size") this.sortSize();

      this.prevCol = col;
    },
    sortName() {
      const torrentsCopy = [...this.torrents];
      if (this.direction) {
        this.torrents = torrentsCopy.sort((a, b) => (a.name < b.name ? 1 : -1));
      } else {
        this.torrents = torrentsCopy.sort((a, b) => (a.name > b.name ? 1 : -1));
      }
    },
    sortSeed() {
      const torrentsCopy = [...this.torrents];
      if (this.direction) {
        this.torrents = torrentsCopy.sort(
          (a, b) => parseInt(a.seed) - parseInt(b.seed)
        );
      } else {
        this.torrents = torrentsCopy.sort(
          (a, b) => parseInt(b.seed) - parseInt(a.seed)
        );
      }
    },
    sortSize() {
      const torrentsCopy = [...this.torrents];
      if (this.direction) {
        this.torrents = torrentsCopy.sort(
          (a, b) =>
            parseInt(sortableSize(a.size)) - parseInt(sortableSize(b.size))
        );
      } else {
        this.torrents = torrentsCopy.sort(
          (a, b) =>
            parseInt(sortableSize(b.size)) - parseInt(sortableSize(a.size))
        );
      }
    },
    findRelaseTypes() {
      this.torrents.forEach(item =>
        this.release_types.push(...item.release_type)
      );
      this.release_types = [...new Set(this.release_types)];
    },
    applyFilter(item, index) {
      this.selectedRelaseType = item;
      const torrents = [...this.torrentResponse];

      if (item === "all") {
        this.torrents = torrents;
        this.sortTable(this.prevCol, true);
        return;
      }

      this.torrents = torrents.filter(torrent =>
        torrent.release_type.includes(item)
      );
      this.sortTable(this.prevCol, true);
    },
    updateResultCountInStore() {
      store.dispatch("torrentModule/setResults", this.torrents);
      store.dispatch(
        "torrentModule/setResultCount",
        this.torrentResponse.length
      );
    },
    filterDeadTorrents(torrents) {
      return torrents.filter(torrent => {
        if (isNaN(torrent.seed)) return false;
        return parseInt(torrent.seed) > 0;
      });
    },
    fetchTorrents(query = undefined) {
      this.loading = true;
      this.editSearchQuery = false;

      return searchTorrents(query || this.query)
        .then(data => {
          const { results } = data;
          if (results) {
            this.torrentResponse = results;
            this.torrents = this.filterDeadTorrents(results);
          } else {
            this.torrents = [];
          }
        })
        .then(this.updateResultCountInStore)
        .then(this.findRelaseTypes)
        .catch(e => {
          console.log("e:", e);
          const error = e.toString();
          this.errorMessage =
            error.indexOf("401") != -1 ? "Permission denied" : "Nothing found";
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleInput(event) {
      this.editedSearchQuery = event.target.innerText;
      console.log("edit text:", this.editedSearchQuery);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/scss/variables";
.expanded {
  display: flex;
  padding: 0.25rem 1rem;
  max-width: 100%;
  border-left: 1px solid $text-color;
  border-right: 1px solid $text-color;
  border-bottom: 1px solid $text-color;

  td {
    word-break: break-all;
    padding: 0.5rem 0.15rem;
    width: 100%;
  }
}

$checkboxSize: 20px;
$ui-border-width: 2px;

.checkbox {
  display: flex;
  flex-direction: row;
  margin-bottom: $checkboxSize * 0.5;

  input[type="checkbox"] {
    display: block;
    opacity: 0;
    position: absolute;

    + div {
      position: relative;
      display: inline-block;
      padding-left: 1.25rem;
      font-size: 20px;
      line-height: $checkboxSize + $ui-border-width * 2;
      left: $checkboxSize;
      cursor: pointer;

      &::before {
        content: "";
        display: inline-block;
        position: absolute;
        left: -$checkboxSize;
        border: $ui-border-width solid var(--color-green);
        width: $checkboxSize;
        height: $checkboxSize;
      }

      &::after {
        transition: all 0.3s ease;
        content: "";
        position: absolute;
        display: inline-block;
        left: -$checkboxSize + $ui-border-width;
        top: $ui-border-width;
        width: $checkboxSize + $ui-border-width;
        height: $checkboxSize + $ui-border-width;
      }
    }

    &:checked {
      + div::after {
        background-color: var(--color-green);
        opacity: 1;
      }
    }

    &:hover:not(checked) {
      + div::after {
        background-color: var(--color-green);
        opacity: 0.4;
      }
    }

    &:focus {
      + div::before {
        outline: 2px solid Highlight;
        outline-style: auto;
        outline-color: -webkit-focus-ring-color;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
@import "src/scss/variables";
@import "src/scss/media-queries";
@import "src/scss/elements";

h2 {
  font-size: 20px;
}

thead {
  user-select: none;
  -webkit-user-select: none;
  color: var(--background-color);
  text-transform: uppercase;
  cursor: pointer;
  background-color: var(--text-color);
  letter-spacing: 0.8px;
  font-size: 1rem;
  border: 1px solid var(--text-color-90);

  th:first-of-type {
    border-top-left-radius: 8px;
  }

  th:last-of-type {
    border-top-right-radius: 8px;
  }
}

tbody {
  tr > td:first-of-type {
    white-space: unset;
  }

  tr > td:not(td:first-of-type) {
    text-align: center;
  }

  tr > td:last-of-type {
    cursor: pointer;
  }

  tr td:first-of-type {
    border-left: 1px solid var(--text-color-90);
  }

  tr td:last-of-type {
    border-right: 1px solid var(--text-color-90);
  }

  tr:last-of-type {
    td {
      border-bottom: 1px solid var(--text-color-90);
    }

    td:first-of-type {
      border-bottom-left-radius: 8px;
    }
    td:last-of-type {
      border-bottom-right-radius: 8px;
    }
  }

  tr:nth-child(even) {
    background-color: var(--background-70);
  }
}

th,
td {
  padding: 0.35rem 0.25rem;
  white-space: nowrap;

  svg {
    width: 24px;
    fill: var(--text-color);
  }
}

.toggle {
  max-width: unset !important;
  margin: 1rem 0;
}

.container {
  background-color: $background-color;
  padding: 0 1rem;
}

.torrentHeader {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;

  &-text {
    font-weight: 400;
    text-transform: uppercase;
    font-size: 20px;
    // color: $green;
    text-align: center;
    margin: 0;

    .icon {
      vertical-align: text-top;
      margin-left: 1rem;
      fill: var(--text-color);
      width: 22px;
      height: 22px;
      // stroke: white !important;
    }

    &.editable {
      cursor: pointer;
    }
  }

  &-editIcon {
    margin-left: 10px;
    margin-top: -3px;
    width: 22px;
    height: 22px;

    &:hover {
      fill: $green;
      cursor: pointer;
    }
  }
}

table {
  // border-collapse: collapse;
  border-spacing: 0;
  margin-top: 1rem;
  width: 100%;
  // table-layout: fixed;
}

// .table__content,
// .table__header {
//   display: flex;
//   padding: 0;
//   border-left: 1px solid $text-color;
//   border-right: 1px solid $text-color;
//   border-bottom: 1px solid $text-color;

//   th,
//   td {
//     display: flex;
//     flex-direction: column;
//     flex-basis: 100%;

//     padding: 0.4rem;

//     white-space: nowrap;
//     text-overflow: ellipsis;
//     overflow: hidden;
//     min-width: 75px;
//   }

//   th:first-child,
//   td:first-child {
//     flex: 1;
//   }

//   th:not(:first-child),
//   td:not(:first-child) {
//     flex: 0.2;
//   }

//   th:nth-child(2),
//   td:nth-child(2) {
//     flex: 0.1;
//   }

//   @include mobile-only {
//     th:first-child,
//     td:first-child {
//       display: none;

//       &.show {
//         display: block;
//         align: flex-end;
//       }
//     }

//     th:not(:first-child),
//     td:not(:first-child) {
//       flex: 1;
//     }
//   }
// }

.table__content {
  td:not(:last-child) {
    border-right: 1px solid $text-color;
  }
}

.table__content:last-child {
  margin-bottom: 1rem;

  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
}

// .table__header {
//   color: $text-color;
//   text-transform: uppercase;
//   cursor: pointer;
//   background-color: $background-color-secondary;

//   border-top: 1px solid $text-color;
//   border-top-left-radius: 3px;
//   border-top-right-radius: 3px;

//   th {
//     display: flex;
//     flex-direction: row;
//     font-weight: 400;
//     letter-spacing: 0.7px;
//     // font-size: 1.08rem;
//     font-size: 15px;

//     &::before {
//       content: "";
//       min-width: 0.2rem;
//     }

//     span:first-child {
//       margin-right: 0.6rem;
//     }
//     span:nth-child(2) {
//       margin-right: 0.1rem;
//     }
//   }

//   th:not(:last-child) {
//     border-right: 1px solid $text-color;
//   }
// }

.editQuery {
  display: flex;
  width: 70%;
  justify-content: center;
  margin-bottom: 1rem;

  @include mobile-only {
    width: 90%;
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

.torrentloader {
  width: 100%;
  padding: 2rem 0;

  i {
    animation: load 1s linear infinite;
    border: 2px solid $text-color;
    border-radius: 50%;
    display: block;
    height: 30px;
    left: 50%;
    margin: 0 auto;
    width: 30px;

    &:after {
      border: 5px solid $green;
      border-radius: 50%;
      content: "";
      left: 10px;
      position: absolute;
      top: 16px;
    }
  }
}
@keyframes load {
  100% {
    transform: rotate(360deg);
  }
}
</style>
