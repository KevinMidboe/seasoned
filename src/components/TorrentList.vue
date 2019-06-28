<template>
  <div v-if="show">
    <h2 class="title">torrents: {{ query }}</h2>

    <div v-if="listLoaded">
      <ul class="filter">
        <li class="filter-item" v-for="(item, index) in release_types" @click="applyFilter(item, index)" :class="{'active': item === selectedRelaseType}">{{ item }}</li>
      </ul>


      <table>
        <tr class="table__header noselect">
          <th @click="sortTable('name')">
            <span>Name</span>
            <span v-if="prevCol === 'name' && direction">↑</span>
            <span v-if="prevCol === 'name' && !direction">↓</span>
          </th>
          <th @click="sortTable('seed')">
            <span>Seed</span>
            <span v-if="prevCol === 'seed' && direction">↑</span>
            <span v-if="prevCol === 'seed' && !direction">↓</span>
          </th>
          <th @click="sortTable('size')">
            <span>Size</span>
            <span v-if="prevCol === 'size' && direction">↑</span>
            <span v-if="prevCol === 'size' && !direction">↓</span>
          <th>
            <span>Magnet</span>
          </th>
        </tr>
        <tr v-for="torrent in torrents" class="table__content">
          <td @click="expand($event, torrent.name)">{{ torrent.name }}</td>
          <td @click="expand($event, torrent.name)">{{ torrent.seed }}</td>
          <td @click="expand($event, torrent.name)">{{ torrent.size }}</td>
          <td @click="sendTorrent(torrent.magnet, torrent.name, $event)" class="download">
            <svg class="download__icon"><use xlink:href="#iconUnmatched"></use></svg>
          </td>
        </tr>
      </table>
    </div>
    <i v-else class="torrentloader"></i>
  </div>
</template>

<script>
import storage from '@/storage.js'
import { sortableSize } from '@/utils.js'
import { searchTorrents, addMagnet } from '@/api.js'

export default {
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
    admin: String,
    show: Boolean
  },
  data() {
    return {
      listLoaded: false,
      torrents: undefined,
      torrentResponse: undefined,
      currentPage: 0,
      prevCol: '',
      direction: false,
      release_types: ['all'],
      selectedRelaseType: 'all'
    }
  },
  beforeMount() {
    if (localStorage.getItem('admin')) {
      this.fetchTorrents()
    }
  },
  methods: {
    expand(event, name) {
      const existingExpandedElement = document.getElementsByClassName('expanded')[0]

      if (existingExpandedElement) {
        console.log('exists')
        const expandedSibling = event.target.parentNode.nextSibling.className === 'expanded'

        existingExpandedElement.remove()

        if (expandedSibling) {
          console.log('sibling is here')
          return
        }
      }

      console.log('expand event', event)
      const nameRow = document.createElement('tr')
      const nameCol = document.createElement('td')
      nameRow.className = 'expanded'
      nameCol.innerText = name

      nameRow.appendChild(nameCol)

      event.target.parentNode.insertAdjacentElement('afterend', nameRow)
    },
    sendTorrent(magnet, name, event){
      this.$notifications.info({
        title: 'Adding torrent 🦜',
        description: this.query,
        timeout: 3000
      })

      event.target.parentNode.classList.add('active')

      addMagnet(magnet, name, this.tmdb_id)
      .catch((resp) => { console.log('error:', resp.data) })
      .then((resp) => {
        console.log('addTorrent resp: ', resp)
        this.$notifications.success({
          title: 'Torrent added 🎉',
          description: this.query,
          timeout: 3000
        })
      })
    },
    sortTable(col, sameDirection=false) {
      if (this.prevCol === col && sameDirection === false) {
        this.direction = !this.direction
      }
      console.log('col and more', col, sameDirection)

      switch (col) {
        case 'name':
          this.sortName()
          break
        case 'seed':
          this.sortSeed()
          break
        case 'size':
          this.sortSize()
          break
      }
      this.prevCol = col
    },
    sortName() {
      const torrentsCopy = [...this.torrents]
      if (this.direction) {
        this.torrents = torrentsCopy.sort((a, b) => (a.name < b.name) ? 1 : -1)
      } else {
        this.torrents = torrentsCopy.sort((a, b) => (a.name > b.name) ? 1 : -1)
      }
    },
    sortSeed() {
      const torrentsCopy = [...this.torrents]
      if (this.direction) {
        this.torrents = torrentsCopy.sort((a, b) => parseInt(a.seed) - parseInt(b.seed));
      } else {
        this.torrents = torrentsCopy.sort((a, b) => parseInt(b.seed) - parseInt(a.seed));
      }
    },
    sortSize() {
      const torrentsCopy = [...this.torrents]
      if (this.direction) {
        this.torrents = torrentsCopy.sort((a, b) => parseInt(sortableSize(a.size)) - parseInt(sortableSize(b.size)));
      } else {
        this.torrents = torrentsCopy.sort((a, b) => parseInt(sortableSize(b.size)) - parseInt(sortableSize(a.size)));
      }
    },
    findRelaseTypes() {
      this.torrents.forEach(item => this.release_types.push(...item.release_type))
      this.release_types = [...new Set(this.release_types)]
    },
    applyFilter(item, index) {
      this.selectedRelaseType = item;
      const torrents = [...this.torrentResponse]

      if (item === 'all') {
        this.torrents = torrents
        this.sortTable(this.prevCol, true)
        return
      }

      this.torrents = torrents.filter(torrent => torrent.release_type.includes(item))
      this.sortTable(this.prevCol, true)
    },
    fetchTorrents(){
      searchTorrents(this.query, 'all', this.currentPage, storage.token)
      .then(resp => {
          let data = resp.data;
          console.log('data results', data.results);
          this.torrentResponse = data.results;
          this.torrents = data.results;
          this.listLoaded = true;
      })
      .then(this.findRelaseTypes)
      .catch(e => {
        const error = e.toString()
        this.errorMessage = error.indexOf('401') != -1 ? 'Permission denied' : 'Nothing found';
        this.listLoaded = true;
      });
    },
  }
}
</script>

<style lang="scss">
@import "./src/scss/variables";
.expanded {
  display: flex;
  margin: 0 1rem;
  max-width: 100%;
  border-left: 1px solid rgba($c-dark, 0.5);
  border-right: 1px solid rgba($c-dark, 0.5);
  border-bottom: 1px solid rgba($c-dark, 0.5);

  td {
    // border-left: 1px solid $c-dark;
    word-break: break-all;
    padding: 0.5rem 0.15rem;
    width: 100%;
  }
}
</style>
<style lang="scss" scoped>
@import "./src/scss/variables";
@import "./src/scss/media-queries";
@import "./src/scss/elements";

.title {
  margin: 0;
  font-weight: 400;
  text-transform: uppercase;
  text-align: center;
  font-size: 14px;
  color: $c-green;
  padding-bottom: 20px;
  @include tablet-min{
    font-size: 16px;
  }
}

table {
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;
}

.table__content, .table__header {
  display: flex;
  padding: 0;
  margin: 0 1rem;
  border-left: 1px solid rgba($c-dark, 0.8);
  border-right: 1px solid rgba($c-dark, 0.8);
  border-bottom: 1px solid rgba($c-dark, 0.8);

  th, td {
    display: flex;
    flex-direction: column;
    flex-basis: 100%;

    padding: 0.4rem;

    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  th:first-child, td:first-child {
    flex: 1;
  }

  th:not(:first-child), td:not(:first-child) {
    flex: 0.2;
  }

  th:nth-child(2), td:nth-child(2) {
    flex: 0.1;
  }

  @include mobile-only {
    th:first-child, td:first-child {
      display: none;

      &.show {
        display: block;
        align: flex-end;
      }
    }

    th:not(:first-child), td:not(:first-child) {
      flex: 1;
    }
  }

}

.table__content {
  td:not(:last-child) {
    border-right: 1px solid rgba($c-dark, 0.8);
  }
}

.table__content:last-child {
  margin-bottom: 1rem;

  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
}

.table__header {
  background-color: white;
  color: $c-dark;
  text-transform: uppercase;
  cursor: pointer;

  border-top: 1px solid rgba($c-dark, 0.8);
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;

  th {
    display: flex;
    flex-direction: row;
    font-weight: 400;
    letter-spacing: 0.7px;
    // font-size: 1.08rem;
    font-size: 15px;

    &::before {
      content: '';
      min-width: 0.2rem;
    }

    span:first-child {
      margin-right: 0.6rem;
    }
    span:nth-child(2) {
      margin-right: 0.1rem;
    }
  }

  th:not(:last-child) {
    border-right: 1px solid rgba($c-dark, 0.8);
  }

}

.download {

  &__icon {
    fill: rgba($c-dark, 0.6);
    height: 1.2rem;

    &:hover {
      fill: $c-dark;
      cursor: pointer;
    }
  }

  &.active &__icon {
    fill: $c-green;
  }
}

.torrentloader{
  animation: load 1s linear infinite;
  border: 2px solid $c-dark;
  border-radius: 50%;
  display: block;
  height: 30px;
  left: 50%;
  margin: 2rem auto;
  width: 30px;
  &:after {
    border: 5px solid $c-green;
    border-radius: 50%;
    content: '';
    left: 10px;
    position: absolute;
    top: 16px;
  }
}
@keyframes load {
  100% { transform: rotate(360deg); }
}
</style>