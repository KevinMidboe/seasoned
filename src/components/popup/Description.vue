<template>
  <div
    ref="descriptionElement"
    class="movie-description noselect"
    @click="overflow ? (truncated = !truncated) : null"
    @keydown.enter="overflow ? (truncated = !truncated) : null"
  >
    <span :class="{ truncated }">{{ description }}</span>

    <button v-if="description && overflow" class="truncate-toggle">
      <IconArrowDown :class="{ rotate: !truncated }" />
    </button>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import type { Ref } from "vue";
  import IconArrowDown from "../../icons/IconArrowDown.vue";

  interface Props {
    description: string;
  }

  const props = defineProps<Props>();
  const truncated: Ref<boolean> = ref(true);
  const overflow: Ref<boolean> = ref(false);
  const descriptionElement: Ref<HTMLElement> = ref(null);

  function removeElements(elems: NodeListOf<Element>) {
    elems.forEach(el => el.remove());
  }

  // The description element overflows text after 4 rows with css
  // line-clamp this takes the same text and adds to a temporary
  // element without css overflow. If the temp element is
  // higher then description element, we display expand button
  function checkDescriptionOverflowing() {
    const element = descriptionElement?.value;
    if (!element) return;

    const { height, width } = element.getBoundingClientRect();
    const { fontSize, lineHeight } = getComputedStyle(element);

    const descriptionComparisonElement = document.createElement("div");
    descriptionComparisonElement.setAttribute(
      "style",
      `max-width: ${Math.ceil(
        width + 10
      )}px; display: block; font-size: ${fontSize}; line-height: ${lineHeight};`
    );
    // Don't know why need to add 10px to width, but works out perfectly

    descriptionComparisonElement.classList.add("dummy-non-overflow");
    descriptionComparisonElement.innerText = props.description;

    document.body.appendChild(descriptionComparisonElement);
    const elemWithoutOverflowHeight =
      descriptionComparisonElement.getBoundingClientRect().height;

    overflow.value = elemWithoutOverflowHeight > height;
    removeElements(document.querySelectorAll(".dummy-non-overflow"));
  }

  onMounted(checkDescriptionOverflowing);
</script>

<style lang="scss" scoped>
  @import "scss/media-queries";

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
    height: 30px;
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
