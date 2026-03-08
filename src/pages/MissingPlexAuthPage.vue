<template>
  <div class="not-authenticated">
    <h1><IconStop /> Must be authenticated with Plex</h1>
    <p>Go to Settings to link your Plex account</p>
  </div>
</template>

<script setup lang="ts">
  import IconStop from "@/icons/IconStop.vue";
</script>

<style lang="scss" scoped>
  @import "scss/media-queries";

  .not-authenticated {
    padding: 2rem;
    text-align: center;

    h1 {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      margin-bottom: 1rem;

      svg {
        margin-right: 1rem;
        height: 3rem;
        width: 3rem;
      }
    }

    p {
      font-size: 1.2rem;
      color: var(--text-color-60);
    }

    @include mobile {
      padding: 1rem;
      padding-right: 0;

      h1 {
        font-size: 1.65rem;

        svg {
          margin-right: 1rem;
          height: 2rem;
          width: 2rem;
        }
      }
    }
  }
</style>
