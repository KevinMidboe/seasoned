<template>
  <div>
    <a @click="$emit('click')"><li>
      <figure :class="activeClassIfActive">
        <svg><use :xlink:href="iconRefNameIfActive"/></svg>
      </figure>

      <span :class="activeClassIfActive">{{ contentTextToDisplay }}</span>

      <span v-if="supplementaryText" class="supplementary-text">
        {{ supplementaryText }}
      </span>
    </li></a>
  </div>
</template>

<script>
  // TODO if a image is hovered and we can't set the hover color we want to
  // go into it and change the fill
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
    textActive: {
      type: String,
      required: false
    },
    supplementaryText: {
      type: String,
      required: false
    }
  },
  computed: {
    iconRefNameIfActive() {
      const { iconRefActive, iconRef, active } = this

      if ((iconRefActive && iconRef) & active) {
        return iconRefActive
      }
      return iconRef
    },
    contentTextToDisplay() {
      const { textActive, active, $slots } = this

      if (textActive && active)
        return textActive

      if ($slots.default && $slots.default.length > 0)
        return $slots.default[0].text

      return ''
    },
    activeClassIfActive() {
      return this.active ? 'active' : ''
    }
    // torrentResults() {
    //   return this.text.toLowerCase().includes('torrents')
    // },
    // getTorrentResultCount() {
    //   return store.getters['torrentModule/resultCount']
    // }
  }
}
</script>

<style lang="scss" scoped>
@import "./src/scss/variables";
@import "./src/scss/media-queries";

li {
  display: flex;
  align-items: center;
  text-decoration: none;
  text-transform: uppercase;
  color: rgba($c-dark, 0.5);
  transition: color 0.5s ease;
  font-size: 11px;
  padding: 10px 0;
  border-bottom: 1px solid rgba($c-dark, 0.05);

  &:hover {
    color: rgba($c-dark, 0.80);
    cursor: pointer;
  }
  .active {
    color: $c-dark;
  }
  .pending {
    color: #f8bd2d;
  }

  .supplementary-text {
    flex-grow: 1;
    text-align: right;
  }

  figure, figure > svg {
    width: 18px;
    height: 18px;
    margin: 0 7px 0 0;
    fill: rgba($c-dark, 0.5);
    transition: fill 0.5s ease, transform 0.5s ease;
    &.waiting {
      transform: scale(0.8, 0.8);
    }
    &.pending {
      fill: #f8bd2d;
    }
    &:hover &-icon {
      fill: rgba($c-dark, 0.75);
      cursor: pointer;
    }
    &.active {
      color: $c-green;

      > svg {
        fill: $c-green;
      }
    }
  }
}
</style>
