<template>
  <div class="action">
    <a class="action-link" :class="{'active': active}" @click="$emit('click')">
      <svg class="action-icon">
        <use v-if="active && iconRefActive" :xlink:href="iconRefActive"></use>
        <use v-else :xlink:href="iconRef"></use>
      </svg>
      <span class="action-text">{{ active && textActive ? textActive : text }}</span> 
      <div v-if="torrentResults"
            style="display: flex;
                   flex-grow: 2;
                   width: 2rem;
                   ">
        <span style="width: 100%; text-align: right;" v-if="getTorrentResultCount !== null">{{ getTorrentResultCount }} results</span></div>
    </a>
  </div>
</template>

<script>
import store from '@/store'

export default {
  props: {
    iconRef: {
      type: String,
      required: true
    },
    iconRefActive: {
      type: String,
      required: false
    },
    active: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      required: true
    },
    textActive: {
      type: String,
      required: false
    }
  },
  computed: {
    torrentResults() {
      return this.text.toLowerCase().includes('torrents')
    },
    getTorrentResultCount() {
      return store.getters['torrentModule/resultCount']
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./src/scss/loading-placeholder";
@import "./src/scss/variables";
@import "./src/scss/media-queries";

.action {
  &-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    text-transform: uppercase;
    color: rgba($c-dark, 0.5);
    transition: color 0.5s ease;
    font-size: 11px;
    padding: 5px 0;
    border-bottom: 1px solid rgba($c-dark, 0.05);
    &:hover {
      color: rgba($c-dark, 0.75);
    }
    &.active {
      color: $c-dark;
    }
    &.pending {
      color: #f8bd2d;
    }
  }
  &-icon {
    width: 18px;
    height: 18px;
    margin: 0 10px 0 0;
    fill: rgba($c-dark, 0.5);
    transition: fill 0.5s ease, transform 0.5s ease;
    &.waiting {
      transform: scale(0.8, 0.8);
    }
    &.pending {
      fill: #f8bd2d;
    }
  }
  &-link:hover &-icon {
    fill: rgba($c-dark, 0.75);
    cursor: pointer;
  }
  &-link.active &-icon {
    fill: $c-green;
  }
  &-text {
    display: block;
    padding-top: 2px;
    cursor: pointer;
    margin:4.4px;
    margin-left: -3px;
  }
}

</style>
