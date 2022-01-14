<template>
  <div class="cast">
    <ol class="persons">
      <Person v-for="person in cast" :person="person" />
    </ol>
  </div>
</template>

<script>
import Person from "src/components/Person";

export default {
  name: "Cast",
  components: { Person },
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
