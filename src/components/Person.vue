<template>
  <li class="card">
    <a :href="tmdbLink">
      <img class="persons--image" :src="pictureUrl" />
      <p class="name">{{ person.name }}</p>
      <p class="meta">{{ person.character }}</p>
      <!-- <p class="meta">{{ person.type }}</p> -->
    </a>
  </li>
</template>

<script>
export default {
  name: "Person",
  props: {
    person: {
      type: Object,
      required: true
    }
  },
  computed: {
    tmdbLink() {
      const { id } = this.person;
      if (id) return `https://www.themoviedb.org/person/${id}`;
    },
    pictureUrl() {
      const { profile_path } = this.person;
      if (profile_path) return "https://image.tmdb.org/t/p/w185" + profile_path;

      return "";
    }
  }
};
</script>

<style lang="scss">
li a p:first-of-type {
  padding-top: 10px;
}

li p {
  font-size: 1em;
  padding: 0 10px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

li.card {
  margin: 10px;
  margin-right: 4px;
  padding-bottom: 10px;
  border-radius: 8px;
  overflow: hidden;

  min-width: 140px;
  width: 140px;
  background-color: var(--background-color-secondary);
  color: var(--text-color);

  transition: all 0.3s ease;
  transform: scale(0.97) translateZ(0);

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:first-of-type {
    margin-left: 0;
  }

  &:hover {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    transform: scale(1.03);
  }

  .name {
    font-weight: 500;
  }

  .character {
    font-size: 0.9em;
  }

  .meta {
    font-size: 0.9em;
    color: var(--text-color-70);
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  a {
    display: block;
    text-decoration: none;
  }

  img {
    width: 100%;
    height: 100%;
    min-width: 140px;
    min-height: 210px;
    background-color: var(--text-color-90);
  }
}
</style>
