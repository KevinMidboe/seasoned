<template>
  <li @click="event => $emit('click', event)" :class="{ active, disabled }">
    <slot></slot>
  </li>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./src/scss/media-queries";

li {
  display: flex;
  align-items: center;
  text-decoration: none;
  text-transform: uppercase;
  color: var(--text-color-50);
  font-size: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--text-color-5);
  cursor: pointer;

  svg {
    margin-right: 1rem;
    transition: all 0.5s ease;
    stroke: var(--text-color-70);

    &[data-fill] {
      stroke: none;
      fill: vaR(--text-color-70);
    }
  }

  &:hover,
  &.active {
    color: var(--text-color);

    svg {
      stroke: var(--text-color);
      transform: scale(1.1, 1.1);

      &[data-fill] {
        stroke: none;
        fill: var(--text-color);
      }
    }
  }

  &.active svg {
    stroke: var(--color-green);

    &[data-fill] {
      stroke: none;
      fill: var(--color-green);
    }
  }

  &.disabled {
    cursor: default;
  }

  .pending {
    color: #f8bd2d;
  }

  .meta {
    margin-left: auto;
    text-align: right;
  }
}
</style>
