<template>
  <li class="card">
    <a @click="openPerson">
      <img class="persons--image" :src="pictureUrl" />
      <p class="name">{{ person.name || person.title }}</p>
      <p class="meta">{{ person.character || person.year }}</p>
    </a>
  </li>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Person",
  props: {
    person: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions("popup", ["open"]),
    openPerson() {
      let { id, media_type } = this.person;
      if (media_type === "tv") media_type = "show";

      if (media_type) {
        this.open({ id, type: media_type });
      } else if (id) {
        this.open({ id, type: "person" });
      }
    }
  },
  computed: {
    pictureUrl() {
      const { profile_path, poster_path } = this.person;
      if (profile_path) return "https://image.tmdb.org/t/p/w185" + profile_path;
      else if (poster_path)
        return "https://image.tmdb.org/t/p/w185" + poster_path;

      return "/assets/no-image_small.svg";
    }
  }
};
</script>

<style lang="scss">
li a p:first-of-type {
  padding-top: 10px;
}

li.card p {
  font-size: 1em;
  padding: 0 10px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: calc(10px + ((16px * var(--line-height)) * 3));
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
    // margin-top: auto;
    max-height: calc((0.9em * var(--line-height)) * 1);
  }

  a {
    display: block;
    text-decoration: none;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  img {
    width: 100%;
    height: auto;
    min-height: 210px;
    background-color: var(--background-color);
    object-fit: cover;
  }
}
</style>
