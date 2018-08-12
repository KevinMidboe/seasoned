<template>
  <section>
    <div v-if="listLoaded">
      <div v-if="torrents.length">
        <data-tablee
      :rows="torrents"
      :cols="cols"
      empty="-"
    >
      <span
        class="data-tablee-icon"
        slot="sort-icon"
        slot-scope="{ sortment, sorted, arrow }"
      >
        {{ sorted ? arrow + ' ' + (sortment === 'ascending' ? 'ASC' : 'DESC') : '' }}
      </span>

      <template
        slot="row"
        slot-scope="{ row, index }"
      >
        <td class="data-tablee-cell -content data-tablee-text" v-bind:title="row.name" v-if="!renderName">{{ row.name.slice(0, 50) }}</td>
        <td class="data-tablee-cell -content data-tablee-text" v-on:click="showInfo(row.name)">{{ row.seed }}</td>
        <td class="data-tablee-cell -content data-tablee-text" v-on:click="showInfo(row.name)">{{ row.size }}</td>
        <td class="data-tablee-cell -content data-tablee-text magnet">
          <button type='button' class="button" @click="sendTorrent(row.magnet, row.name)">Add</button>
        </td>
      </template>
    </data-tablee>
      </div>
      <section v-if="!torrents.length" class="">
        <div class="not-found__content">
          <h2 class="not-found__title">{{ errorMessage }}</h2>
        </div>
      </section>
    </div>
    <i v-if="!listLoaded" class="torrentloader"></i>
  </section>
</template>

<script>
import axios from 'axios'
import numeral from 'numeral'
import storage from '../storage.js'

// import testTorrents from './torrents.json';

let tablet = window.innerWidth < 768 ? true : false;

export default {
  props: ['query', 'tmdb_id', 'tmdb_type'],
  beforeRouteLeave (to, from, next) {
    if(from.name == 'search'){
      eventHub.$emit('setSearchQuery', true);
    }
    next();
  },
  data() {
    return {
      torrents: [],
      listLoaded: false,
      errorMessage: '',
      renderName: tablet,
      cols: [
        { label: 'Name', field: 'name', sort: true, hidden: tablet },
        { label: 'Seeders', field: 'seed', sort: (a, b) => parseInt(a) - parseInt(b) },
        { label: 'Size', field: 'size', sort: (a, b) => this.sortableSize(a) - this.sortableSize(b) },
        { label: 'Add', align: 'center' }
      ],
    }
  },
  methods: {
    fetchTorrents(){
      axios.get(`https://api.kevinmidboe.com/api/v1/pirate/search?query=${this.query}&filter=all&page=${this.currentPage}`, {
        headers: {authorization: storage.token},
      })
      .then(resp => {
          let data = resp.data;
          this.torrents = data.results;
          this.listLoaded = true;
      })
      .catch(e => {
        const error = e.toString()
        this.errorMessage = error.indexOf('401') != -1 ? 'Permission denied' : 'Nothing found';
        this.listLoaded = true;
      });
    },
    sendTorrent(magnet, name){
      axios.post(`https://api.kevinmidboe.com/api/v1/pirate/add`, {
        magnet: magnet, name: name, tmdb_id: this.tmdb_id }, { headers: {authorization: storage.token}
      })
      .catch((resp) => { console.log('error:', resp.data) })
      .then((resp) => { console.log('addTorrent resp: ', resp) })
    },
    showInfo(text){
      alert(text)
    },
    sortableSize(string) {
       const UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
       const [numStr, unit] = string.split(' ');
       if (UNITS.indexOf(unit) === -1)
          return string
       const exponent = UNITS.indexOf(unit) * 3
       return numStr * (Math.pow(10, exponent))
    },
  },
  created(){
    this.fetchTorrents();
  },
}
</script>

<style src="../scss/vue-data-tablee.css"></style>
<style lang="scss" scoped>
@import "./src/scss/variables";
@import "./src/scss/media-queries";
.magnet{
  text-align: center;
}
.add{
  padding: 3px 15px 3px 15px;
  &:hover, &:active{
    background: $c-dark;
    color: $c-white;
  }
}
.torrentloader{
  animation: load 1s linear infinite;
  border: 2px solid $c-dark;
  border-radius: 50%;
  display: block;
  height: 30px;
  left: 50%;
  margin: 0 auto;
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
