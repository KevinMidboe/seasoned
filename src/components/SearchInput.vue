<template>
  <div>
    
    <div class="search">
      <input
        type="text"
        placeholder="Search for a movie or show"
        autocorrect="off"
        autocapitalize="off"
        v-model="query" 
        @input="handleInput" 
        @click="focus = true"
        @keydown.escape="handleEscape"
        @keyup.enter="handleSubmit"
        @keydown.up="navigateUp"
        @keydown.down="navigateDown" />

      <svg class="search--icon" fill="currentColor"><use xlink:href="#iconSearch"></use></svg>
    </div> 

    <transition name="fade">
      <div class="dropdown" v-if="!disabled && focus && query.length > 0">
        <div class="dropdown--results">

          <ul v-for="(item, index) in elasticSearchResults"
              @click="$popup.open(item.id, item.type)"
              :class="{ active: index + 1 === selectedResult}">
                
              {{ item.name }}
          </ul>

        </div>

        <seasoned-button class="end-section" fullWidth="true" 
          @click="focus = false" :active="elasticSearchResults.length + 1 === selectedResult">
          close
        </seasoned-button>
      </div>
    </transition>
</div>


</template>

<script>
import SeasonedButton from '@/components/ui/SeasonedButton.vue'

import { elasticSearchMoviesAndShows } from '@/api.js'
import config from '@/config.json'

export default {
  name: 'SearchInput',
  components: {
    SeasonedButton
  },
  props: ['value'],
  data() {
    return {
      query: this.value,
      focus: false,
      disabled: false,
      scrollListener: undefined,
      scrollDistance: 0,
      elasticSearchResults: '',
      selectedResult: 0
    }
  },
  watch: {
    focus: function(val) {
      if (val === true) {
        window.addEventListener('scroll', this.disableFocus)
      } else {
        window.removeEventListener('scroll', this.disableFocus)
        this.scrollDistance = 0
      }
    }
  },
  beforeMount() {
    const elasticUrl = config.ELASTIC_URL
    if (elasticUrl === undefined || elasticUrl === false || elasticUrl === '') {
      this.disabled = true
    }
  },
  beforeDestroy() {
    console.log('scroll eventlistener not removed, destroying!')
    window.removeEventListener('scroll', this.disableFocus)
  },
  methods: {
    navigateDown() {
      this.focus = true
      this.selectedResult++
    },
    navigateUp() {
      this.focus = true
      this.selectedResult--
    },
    handleInput(e){
      this.selectedResult = 0
      this.$emit('input', this.query);

      if (! this.focus) {
        this.focus = true;
      }

      elasticSearchMoviesAndShows(this.query)
      .then(resp => {
        const data = resp.data.hits.hits

        this.elasticSearchResults = data.map(item => {
          const index = item._index.slice(0, -1)
          if (index === 'movie') {
            return {
              name: item._source.original_title,
              id: item._source.id,
              type: index
            }
          } else if (index === 'show') {
            return {
              name: item._source.original_name,
              id: item._source.id,
              type: index
            }
          }
        })
        console.log(this.elasticSearchResults)
      })
    },
    handleSubmit() {
      let searchResults = this.elasticSearchResults

      if (this.selectedResult > searchResults.length) {
        this.focus = false
        this.selectedResult = 0
      } else if (this.selectedResult > 0) {
        const resultItem = searchResults[this.selectedResult - 1]
        this.$popup.open(resultItem.id, resultItem.type)
      } else {
        const encodedQuery = encodeURI(this.query.replace('/ /g, "+"'))
        this.$router.push({ name: 'search', query: { query: encodedQuery }});
        this.focus = false
        this.selectedResult = 0
      }
    },
    handleEscape() {
      if (this.$popup.isOpen) {
        console.log('THIS WAS FUCKOING OPEN!')
      } else {
        this.focus = false
      }
    },
    disableFocus(_) {
      this.focus = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./src/scss/variables";
@import "./src/scss/media-queries";
@import './src/scss/main';


.fade-enter-active {
  transition: opacity .2s;
}
.fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.dropdown {
  width: 100%;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  z-index: 5;
  min-height: $header-size;
  right: 0px;
  background-color: $background-color-secondary;

  @include mobile-only {
    position: fixed;
    top: 50px;
    padding-top: 20px;
    width: calc(100%);
  }

  &--results {
    padding-left: 60px;
    width: 100%;

    @include mobile-only {
      padding-left: 45px;
    }

    > ul {
      font-size: 1.3rem;
      padding: 0;
      margin: 0.2rem 0;
      width: calc(100% - 25px);
      max-width: fit-content;

      list-style: none;      
      color: rgba(0, 0, 0, 0.5);
      text-transform: capitalize;
      cursor: pointer;
      border-bottom: 2px solid transparent;

      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      color: $text-color-50;

      &.active, &:hover, &:active {
        color: $text-color;
        border-bottom: 2px solid $text-color;
      }
    }
  }
}

.search {
  height: $header-size;
  display: flex;
  position: fixed;
  flex-wrap: wrap;
  z-index: 5;
  background-color: $background-color-secondary;

  // TODO check if this is for mobile
  width: calc(100% - 110px);
  top: 0;
  right: 55px;

  @include tablet-min{
    position: relative;
    width: 100%;
    right: 0px;
  }

  input {
    display: block;
    width: 100%;
    padding: 13px 20px 13px 45px;
    outline: none;
    border: 0;
    background-color: transparent;
    font-weight: 300;
    font-size: 19px;

    @include tablet-min {
      padding: 13px 30px 13px 60px;
    }
  }

  &--icon{
    width: 20px;
    height: 20px;
    fill: $text-color-50;
    transition: fill 0.5s ease;
    pointer-events: none;
    position: absolute;
    left: 15px;
    top: 15px;

    @include tablet-min{
      top: 27px;
      left: 25px;
    }
  }
}
</style>