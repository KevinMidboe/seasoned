<template>
  <section class="discover-minimal">
    <div class="discover-minimal-header">
      <div class="header-content">
        <h2 class="discover-title">Explore Collections</h2>
        <p class="discover-description">
          Curated selections organized by genre, mood, and decade
        </p>
      </div>
      <router-link to="/discover" class="view-all-link">
        <span class="desktop-only">View All Categories →</span>
        <span class="mobile-only">View All →</span>
      </router-link>
    </div>

    <DiscoverShowcase @select="navigateToDiscover" />

    <div class="featured-collections-wrapper">
      <div class="featured-collections-header">
        <div class="header-decorator"></div>
        <h3 class="featured-title">Featured Picks</h3>
        <div class="header-decorator"></div>
      </div>
      <div class="featured-collections">
        <ResultsSection
          v-for="list in featuredLists"
          :key="list.id"
          :api-function="list.apiFunction"
          :title="list.title"
          :short-list="true"
          section-type="discover"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { useRouter } from "vue-router";
  import ResultsSection from "@/components/ResultsSection.vue";
  import DiscoverShowcase from "@/components/DiscoverShowcase.vue";
  import { getTmdbMovieDiscoverByName } from "../api";

  const router = useRouter();

  const featuredLists = [
    {
      id: "feel_good",
      title: "Feel Good",
      apiFunction: () => getTmdbMovieDiscoverByName("feel_good")
    },
    {
      id: "2000s_classics",
      title: "2000s Classics",
      apiFunction: () => getTmdbMovieDiscoverByName("2000s_classics")
    },
    {
      id: "horror_hits",
      title: "Horror Hits",
      apiFunction: () => getTmdbMovieDiscoverByName("horror_hits")
    }
  ];

  function navigateToDiscover(categoryId?: string) {
    router.push(`/discover${categoryId ? `?category=${categoryId}` : ""}`);
  }
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .discover-minimal {
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.01) 0%,
      rgba(255, 255, 255, 0.03) 50%,
      rgba(255, 255, 255, 0.01) 100%
    );
    padding: 3rem 0;
    position: relative;
    margin: 2rem 0;
    width: 100%;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.2) 50%,
        transparent 100%
      );
    }

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.15) 50%,
        transparent 100%
      );
    }

    @include mobile {
      padding: 1rem 0 0.5rem;
      margin: 0;
      background: transparent;

      &::before,
      &::after {
        display: none;
      }
    }
  }

  .discover-minimal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.5rem 2rem;
    gap: 1rem;

    @include mobile {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem 0.6rem;
      gap: 0.75rem;
    }

    .header-content {
      flex: 1;

      @include mobile {
        min-width: 0;
      }
    }

    .discover-title {
      margin: 0 0 0.5rem;
      font-size: 2rem;
      font-weight: 600;
      color: var(--text-color);
      letter-spacing: -0.5px;

      @include mobile {
        font-size: 1.75rem;
        margin: 0 0 0.15rem;
        font-weight: 600;
      }
    }

    .discover-description {
      margin: 0;
      font-size: 0.95rem;
      color: $text-color-70;
      font-weight: 300;

      @include mobile {
        display: none;
      }
    }

    .view-all-link {
      padding: 0.75rem 1.5rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 25px;
      color: $text-color-70;
      font-size: 0.9rem;
      font-weight: 400;
      text-decoration: none;
      transition: all 0.3s ease;
      white-space: nowrap;

      @include mobile {
        padding: 0.45rem 0.85rem;
        font-size: 0.75rem;
        border-radius: 20px;
        flex-shrink: 0;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.2);
        color: var(--text-color);
        transform: translateX(2px);
      }
    }
  }

  .featured-collections-wrapper {
    padding-top: 2rem;
    position: relative;

    @include mobile {
      margin-top: 0;
      padding-top: 0.5rem;
    }
  }

  .featured-collections-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 0 1.5rem 1.5rem;
    max-width: 1400px;
    margin: 0 auto;

    @include mobile {
      padding: 0 1rem 0.4rem;
      gap: 0.4rem;
    }

    .header-decorator {
      flex: 1;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.3) 50%,
        rgba(255, 255, 255, 0.3) 100%
      );

      &:last-child {
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.3) 0%,
          rgba(255, 255, 255, 0.3) 50%,
          transparent 100%
        );
      }
    }

    .featured-title {
      margin: 0;
      font-size: 1.4rem;
      font-weight: 500;
      color: var(--text-color);
      letter-spacing: 0.5px;
      white-space: nowrap;
      text-transform: uppercase;
      font-size: 0.9rem;
      color: $text-color-70;

      @include mobile {
        font-size: 0.8rem;
      }
    }
  }

  .featured-collections {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 20px;
    max-width: calc(100% - 4rem);
    margin: 0 auto;

    @include mobile {
      border-radius: 12px;
      padding: 0.25rem 0;
      max-width: calc(100% - 2rem);
    }
  }
</style>
