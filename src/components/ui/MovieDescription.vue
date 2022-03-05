<template>
  <div
    id="description"
    class="movie-description noselect"
    @click="overflow ? (truncated = !truncated) : null"
  >
    <span ref="description" :class="{ truncated }">{{ description }}</span>

    <button v-if="description && overflow" class="truncate-toggle">
      <IconArrowDown :class="{ rotate: !truncated }" />
    </button>
  </div>
</template>

<script>
import IconArrowDown from "../../icons/IconArrowDown";
export default {
  components: { IconArrowDown },
  props: {
    description: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      truncated: true,
      overflow: false
    };
  },
  mounted() {
    this.checkDescriptionOverflowing();
  },
  methods: {
    checkDescriptionOverflowing() {
      const descriptionEl = document.getElementById("description");
      if (!descriptionEl) return;

      const { height, width } = descriptionEl.getBoundingClientRect();
      const { fontSize, lineHeight } = getComputedStyle(descriptionEl);

      const elementWithoutOverflow = document.createElement("div");
      elementWithoutOverflow.setAttribute(
        "style",
        `max-width: ${Math.ceil(
          width + 10
        )}px; display: block; font-size: ${fontSize}; line-height: ${lineHeight};`
      );
      // Don't know why need to add 10px to width, but works out perfectly

      elementWithoutOverflow.classList.add("dummy-non-overflow");
      elementWithoutOverflow.innerText = this.description;

      document.body.appendChild(elementWithoutOverflow);
      const elemWithoutOverflowHeight = elementWithoutOverflow.getBoundingClientRect()[
        "height"
      ];

      this.overflow = elemWithoutOverflowHeight > height;
      this.removeElements(document.querySelectorAll(".dummy-non-overflow"));
    },
    removeElements: elems => elems.forEach(el => el.remove())
  }
};
</script>

<style lang="scss" scoped>
@import "src/scss/media-queries";

.movie-description {
  font-weight: 300;
  font-size: 13px;
  line-height: 1.8;
  margin-bottom: 20px;
  transition: all 1s ease;

  @include tablet-min {
    margin-bottom: 30px;
    font-size: 14px;
  }
}

span.truncated {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.truncate-toggle {
  border: none;
  background: none;
  width: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--text-color);
  margin-top: 1rem;
  cursor: pointer;

  svg {
    transition: 0.4s ease all;
    height: 22px;
    width: 22px;
    fill: var(--text-color);

    &.rotate {
      transform: rotateX(180deg);
    }
  }

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid var(--text-color-50);
  }
  &::before {
    margin-right: 1rem;
  }
  &::after {
    margin-left: 1rem;
  }
}
</style>
