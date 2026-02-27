<!-- eslint-disable vuejs-accessibility/click-events-have-key-events, vue/no-v-html -->
<template>
  <transition name="slide">
    <div v-if="show" class="toast" :class="type || 'info'" @click="clicked">
      <div class="toast--content">
        <div v-if="description" class="toast--text">
          <span class="toast--text__title">{{ title }}</span>
          <span class="toast--text__description" v-html="description"></span>
        </div>

        <div v-else class="toast--text">
          <span class="toast--text__title-large">{{ title }}</span>
        </div>

        <div class="toast--dismiss" @click.stop="dismiss">
          <i class="fas fa-times"></i>
        </div>

        <div class="toast--dismiss" @click="dismiss">
          <i class="fas fa-times"></i>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import type { Ref } from "vue";

  interface Props {
    type: string;
    title: string;
    description?: string;
    image?: string;
    link?: string;
    timeout?: number;
  }

  const props = defineProps<Props>();
  const router = useRouter();

  const show: Ref<boolean> = ref(false);

  onMounted(() => {
    show.value = true;

    setTimeout(() => {
      console.log("Notification time is up 👋"); // eslint-disable-line no-console
      show.value = false;
    }, props.timeout || 2000);
  });

  function clicked() {
    show.value = false;

    if (props.link) {
      router.push(props.link);
    }
  }
</script>

<style lang="scss" scoped>
  /* ------------------------------
   Transition
------------------------------ */

  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .slide-enter-from,
  .slide-leave-to {
    transform: translateY(40px);
    opacity: 0;
  }

  /* ------------------------------
   Toast
------------------------------ */

  .toast {
    position: fixed;
    right: 1.25rem;
    bottom: 1.25rem;
    z-index: 1000;
    cursor: pointer;

    min-width: 340px;
    max-width: 460px;
    width: calc(100vw - 2rem);

    padding: 1.1rem 1.25rem;

    border-radius: 16px;

    /* System-based surface */
    background: var(--background-color-secondary);

    /* Subtle separation */
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

    /* Clear state indicator */
    border-left: 5px solid transparent;

    /* Base text tone */
    color: var(--text-color, #1f2937);

    line-height: 1.5;

    /* ------------------------------
     Content Layout
  ------------------------------ */

    &--content {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    &--text {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    /* ------------------------------
     Typography Hierarchy
  ------------------------------ */

    /* Context label */
    &--text__title {
      font-size: 0.85rem;
      font-weight: 500;
      letter-spacing: 0.3px;
      text-transform: uppercase;

      /* Softer than body but not faded */
      color: color-mix(in srgb, currentColor 75%, transparent);
    }

    /* Primary message */
    &--text__description {
      margin-top: 0.3rem;
      font-size: 0.98rem;
      font-weight: 400;
      line-height: 1.5;
      color: currentColor;
    }

    &--text__title-large {
      font-size: 1.15rem;
      font-weight: 500;
    }

    /* ------------------------------
     Dismiss Button
  ------------------------------ */

    &--dismiss {
      flex-shrink: 0;

      display: flex;
      align-items: center;
      justify-content: center;

      width: 30px;
      height: 30px;

      border-radius: 8px;

      transition: background 0.2s ease;

      &:hover {
        background: var(--background-color);
      }

      i {
        font-size: 0.75rem;
      }
    }

    /* ------------------------------
     State Colors
  ------------------------------ */

    &.success {
      border-left-color: #22c55e;
    }

    &.info {
      border-left-color: #facc15;
    }

    &.warning {
      border-left-color: #f97316;
    }

    &.error {
      border-left-color: #ef4444;
    }

    &.simple {
      border-left-color: transparent;
    }
  }

  /* ------------------------------
   Mobile
------------------------------ */

  @media (max-width: 480px) {
    .toast {
      right: 1rem;
      left: 1rem;
      width: auto;
      min-width: unset;
    }
  }
</style>
