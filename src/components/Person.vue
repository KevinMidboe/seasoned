<template>
  <div class="persons">
    <div class="persons--image" :style="{ 
      'background-image': 'url(' + getPicture(info) + ')' }"></div>
    <span>{{ info.name }}</span>
  </div>
</template>

<script>

export default {
  name: 'Person',
  components: {

  },
  props: {
    info: Object
  },
  data() {
    return {

    }
  },
  created() {},
  beforeMount() {},
  computed: {
    
  },
  methods: {
getPicture: (person) => {
  if (person)
      return 'https://image.tmdb.org/t/p/w185' + person.profile_path;
    }
  }
}
</script>

<style lang="scss">
.persons {
  display: flex;
  // border: 1px solid black;
  flex-direction: column;

  margin: 0 0.5rem;

  span {
    font-size: 0.6rem;
  }

  &--image {
    border-radius: 50%;
    height: 70px;
    width: 70px;
    // height: auto;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
  }

  &--name {
  }
}
</style>