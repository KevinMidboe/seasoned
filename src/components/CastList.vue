<template>
  <div class="cast">
    <ol class="persons">
      <CastListItem v-for="person in cast" :person="person" :key="person.id" />
    </ol>
  </div>
</template>

<script>
import CastListItem from "src/components/CastListItem";

export default {
  name: "CastList",
  components: { CastListItem },
  props: {
    cast: {
      type: Array,
      required: true
    }
  }
};
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
