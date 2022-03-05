<template>
  <div>
    <section class="not-found">
      <h1 class="not-found__title">Page Not Found</h1>
    </section>
    <seasoned-button class="button" @click="goBack"
      >go back to previous page</seasoned-button
    >
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import SeasonedButton from "@/components/ui/SeasonedButton";

export default {
  components: { SeasonedButton },
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
  position: fixed;
  top: 50%;
  left: calc(50% + 46px);
  transform: translate(-50%, -50%);

  @include mobile {
    top: 60%;
    left: 50%;
    font-size: 1rem;
    width: content;
  }
}

.not-found {
  display: flex;
  height: calc(100vh - var(--header-size));
  background: url("~assets/pulp-fiction.jpg") no-repeat 50% 50%;
  background-size: cover;
  align-items: center;
  flex-direction: column;

  &::before {
    content: "";
    position: absolute;
    height: calc(100vh - var(--header-size));
    width: 100%;
    pointer-events: none;
    background: $background-40;
  }
  &__title {
    margin-top: 30vh;
    font-size: 2.5rem;
    font-weight: 500;
    color: $text-color;
    position: relative;

    @include tablet-min {
      font-size: 3.5rem;
    }
  }
}
</style>
