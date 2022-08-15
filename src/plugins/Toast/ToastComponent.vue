<!-- eslint-disable vuejs-accessibility/click-events-have-key-events, vue/no-v-html -->
<template>
  <transition name="slide">
    <div v-if="show" class="toast" :class="type || 'info'" @click="clicked">
      <div class="toast--content">
        <div class="toast--icon">
          <i v-if="image"
            ><img class="toast--icon-image" :src="image" alt="Toast icon"
          /></i>
        </div>
        <div v-if="description" class="toast--text">
          <span class="toast--text__title">{{ title }}</span>
          <br /><span
            class="toast--text__description"
            v-html="description"
          ></span>
        </div>
        <div v-else class="toast--text">
          <span class="toast--text__title-large">{{ title }}</span>
        </div>

        <div class="toast--dismiss" @click="dismiss">
          <i class="fas fa-times"></i>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { ref, defineProps, onMounted } from "vue";
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
  // @import '@/scss/variables.scss';

  .slide-enter-active {
    transition: all 0.3s ease;
  }
  .slide-enter,
  .slide-leave-to {
    transform: translateY(100vh);
    opacity: 0;
  }
  .slide-leave-active {
    transition: all 2s ease;
  }

  .toast--icon-image {
    height: 100%;
    width: 100%;
    max-height: 45px;
    max-width: 45px;
  }

  .toast {
    position: fixed;
    bottom: 0.5rem;
    cursor: pointer;
    z-index: 100;

    background-color: white;
    border-radius: 3px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.17), 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    padding: 0.5rem;
    margin: 1rem 2rem 1rem 0.71rem;
    // max-width: calc(100% - 3rem);
    min-width: 320px;

    // If small screen we have a min-width that is related to the screen size.
    // else large screens we want a max-width that only uses the space in bottom right

    right: 0;
    line-height: 22.5px;

    &--content {
      display: flex;
      align-items: center;
    }

    &--icon {
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
    }

    &--text {
      margin-left: 0.5rem;
      // color: $bt-brown;
      color: black;
      word-wrap: break-word;

      &__title {
        text-transform: capitalize;
        font-weight: 400;

        &-large {
          font-size: 2rem;
        }
      }

      &__description {
        font-weight: 300;
      }
    }

    &--dismiss {
      align-self: flex-end;

      img {
        width: 2.5rem;
      }
    }

    &.success {
      border-left: 6px solid #38c172;
    }

    &.info {
      border-left: 6px solid #ffd300;
    }

    &.warning {
      border-left: 6px solid #f6993f;
    }

    &.error {
      border-left: 6px solid #e3342f;
    }

    &.simple {
      border-left: unset;
    }
  }
</style>
