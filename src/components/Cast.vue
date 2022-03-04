<template>
  <div class="cast">
    <ol class="persons">
      <CastPerson v-for="person in cast" :person="person" :key="person.id" />
    </ol>
  </div>
</template>

<script>
import CastPerson from "src/components/CastPerson";

export default {
  name: "Cast",
  components: { CastPerson },
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
