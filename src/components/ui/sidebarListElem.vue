<template>
  <div>
    <a @click="$emit('click')">
      <li>
        <figure v-if="iconRef" :class="activeClassIfActive">
          <svg class="icon"><use :xlink:href="iconRefNameIfActive"/></svg>
        </figure>

        <span class="text" :class="activeClassIfActive">{{ contentTextToDisplay }}</span>

        <span v-if="supplementaryText" class="supplementary-text">
          {{ supplementaryText }}
        </span>
      </li>
    </a>
  </div>
</template>

<script>
  // TODO if a image is hovered and we can't set the hover color we want to
  // go into it and change the fill
export default {
  props: {
    iconRef: {
      type: String,
      required: false
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

      if ((iconRefActive && iconRef) && active) {
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
  color: $text-color-50;
  transition: color 0.5s ease;
  font-size: 11px;
  padding: 10px 0;
  border-bottom: 1px solid $text-color-5;

  &:hover {
    color: $text-color;
    cursor: pointer;

    .icon {
      fill: $text-color;
      cursor: pointer;
        transform: scale(1.1, 1.1);
    }
  }
  .active {
    color: $text-color;

    .icon {
      fill: $green;
    }
  }
  .pending {
    color: #f8bd2d;
  }

  .text {
    margin-left: 26px;
  }

  .supplementary-text {
    flex-grow: 1;
    text-align: right;
  }

  figure {
    position: absolute;

    > svg {
      position: relative;
      top: 50%;
      width: 16px;
      height: 16px;
      margin: 0 7px 0 0;
      fill: $text-color-50;
      transition: fill 0.5s ease, transform 0.5s ease;

      & .waiting {
        transform: scale(0.8, 0.8);
      }
      & .pending {
        fill: #f8bd2d;
      }
    }
  }
}
</style>
