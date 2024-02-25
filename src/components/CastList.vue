<template>
  <div class="cast">
    <ol class="persons">
      <CastListItem
        v-for="credit in cast"
        :key="credit.id"
        :credit-item="credit"
      />
    </ol>
  </div>
</template>

<script setup lang="ts">
  import CastListItem from "src/components/CastListItem.vue";
  import type {
    IMovie,
    IShow,
    IPerson,
    ICast,
    ICrew
  } from "../interfaces/IList";

  interface Props {
    cast: Array<IMovie | IShow | IPerson | ICast | ICrew>;
  }

  defineProps<Props>();
</script>

<style lang="scss">
  .cast {
    position: relative;
    top: 0;
    left: 0;

    ol {
      overflow-x: scroll;
      padding: 0;
      list-style-type: none;
      margin: 0;
      display: flex;

      scrollbar-width: none; /* for Firefox */

      &::-webkit-scrollbar {
        display: none; /* for Chrome, Safari, and Opera */
      }
    }
  }
</style>
