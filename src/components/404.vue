<template>
  <div>
    <section class="not-found" :style="background">
      <h1 class="not-found__title">Page Not Found</h1>
      <seasoned-button class="button" @click="goBack">
        go back to previous page
      </seasoned-button>
    </section>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import SeasonedButton from "@/components/ui/SeasonedButton";

export default {
  components: { SeasonedButton },
  data() {
    return {
      background: 'background-image: url("/assets/pulp-fiction.jpg")'
    };
  },
  computed: {
    ...mapGetters("popup", ["isOpen"])
  },
  methods: {
    ...mapActions("popup", ["close"]),
    goBack() {
      this.$router.go(-1);
    }
  },
  created() {
    if (this.isOpen) this.close();
  }
};
</script>

<style lang="scss" scoped>
@import "src/scss/variables";
@import "src/scss/media-queries";

.button {
  font-size: 1.2rem;
  z-index: 10;

  @include mobile {
    font-size: 1rem;
    width: content;
  }
}

.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: calc(100vh - var(--header-size));
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat no-repeat;

  &::before {
    content: "";
    position: absolute;
    height: calc(100vh - var(--header-size));
    width: 100%;
    pointer-events: none;
    background: var(--background-40);
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 500;
    padding: 0 1rem;
    color: var(--text-color);
    position: relative;
    background-color: var(--background-90);

    @include tablet-min {
      font-size: 3.5rem;
    }
  }
}
</style>
