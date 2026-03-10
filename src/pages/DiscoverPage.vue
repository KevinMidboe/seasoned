<template>
  <section class="discover-page">
    <div class="hero-section">
      <div class="hero-collage">
        <div
          v-for="(poster, index) in heroPosters"
          :key="index"
          class="poster-tile"
          :style="{ backgroundImage: `url(${poster})` }"
        ></div>
      </div>
      <div class="hero-overlay"></div>

      <div class="hero-content-wrapper">
        <div class="discover-header">
          <h1>Discover Movies</h1>
          <p class="discover-subtitle">
            Explore curated collections across genres, eras, and moods
          </p>
        </div>

        <DiscoverShowcase
          :active-category="activeCategory"
          @select="updateCategory"
        />
      </div>
    </div>

    <div class="discover-content">
      <ResultsSection
        v-for="list in activeLists"
        :key="list.id"
        :api-function="list.apiFunction"
        :title="list.title"
        :short-list="true"
        section-type="discover"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import ResultsSection from "@/components/ResultsSection.vue";
  import DiscoverShowcase from "@/components/DiscoverShowcase.vue";
  import { getTmdbMovieDiscoverByName } from "../api";
  import type { Ref } from "vue";

  interface DiscoverList {
    id: string;
    title: string;
    apiFunction: (page: number) => Promise<any>;
    category: string;
  }

  const route = useRoute();
  const router = useRouter();
  const activeCategory: Ref<string> = ref(
    (route.query.category as string) || "popular"
  );
  const heroPosters: Ref<string[]> = ref([]);

  // Update URL when category changes
  function updateCategory(categoryId: string) {
    activeCategory.value = categoryId;
    router.push({ query: { category: categoryId } });
  }

  // Watch for query parameter changes (e.g., browser back/forward)
  watch(
    () => route.query.category,
    newCategory => {
      if (newCategory && newCategory !== activeCategory.value) {
        activeCategory.value = newCategory as string;
      }
    }
  );

  // Fetch popular movies for hero collage
  onMounted(async () => {
    // Scroll to top when component mounts - Safari compatible
    // Use requestAnimationFrame to ensure it runs after render
    requestAnimationFrame(() => {
      return;
      window.scrollTo(0, 0);
      // Also try scrolling the body element for Safari compatibility
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    });

    try {
      const response = await getTmdbMovieDiscoverByName("recent_releases");
      const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

      // Take first 12 movies and shuffle them for variety
      const posters = response.results
        .slice(0, 12)
        .map((movie: any) =>
          movie.poster ? IMAGE_BASE_URL + movie.poster : null
        )
        .filter((poster: string | null) => poster !== null);

      heroPosters.value = posters;
    } catch (error) {
      console.error("Failed to load hero posters:", error);
    }
  });

  const discoverLists: DiscoverList[] = [
    // Popular
    {
      id: "popular_now",
      title: "Popular Now",
      apiFunction: () => getTmdbMovieDiscoverByName("popular_now"),
      category: "popular"
    },
    {
      id: "top_rated",
      title: "Top Rated",
      apiFunction: () => getTmdbMovieDiscoverByName("top_rated"),
      category: "popular"
    },
    {
      id: "critics_choice",
      title: "Critics' Choice",
      apiFunction: () => getTmdbMovieDiscoverByName("critics_choice"),
      category: "popular"
    },
    {
      id: "recent_releases",
      title: "Recent Releases",
      apiFunction: () => getTmdbMovieDiscoverByName("recent_releases"),
      category: "popular"
    },
    {
      id: "crowd_pleasers",
      title: "Crowd Pleasers",
      apiFunction: () => getTmdbMovieDiscoverByName("crowd_pleasers"),
      category: "popular"
    },

    // Genres
    {
      id: "action_packed",
      title: "Action Packed",
      apiFunction: () => getTmdbMovieDiscoverByName("action_packed"),
      category: "genres"
    },
    {
      id: "sci_fi_wonders",
      title: "Sci-Fi Wonders",
      apiFunction: () => getTmdbMovieDiscoverByName("sci_fi_wonders"),
      category: "genres"
    },
    {
      id: "horror_hits",
      title: "Horror Hits",
      apiFunction: () => getTmdbMovieDiscoverByName("horror_hits"),
      category: "genres"
    },
    {
      id: "romantic_favorites",
      title: "Romantic Favorites",
      apiFunction: () => getTmdbMovieDiscoverByName("romantic_favorites"),
      category: "genres"
    },
    {
      id: "laugh_out_loud",
      title: "Laugh Out Loud",
      apiFunction: () => getTmdbMovieDiscoverByName("laugh_out_loud"),
      category: "genres"
    },
    {
      id: "animated_magic",
      title: "Animated Magic",
      apiFunction: () => getTmdbMovieDiscoverByName("animated_magic"),
      category: "genres"
    },
    {
      id: "fantasy_worlds",
      title: "Fantasy Worlds",
      apiFunction: () => getTmdbMovieDiscoverByName("fantasy_worlds"),
      category: "genres"
    },
    {
      id: "thriller_edge",
      title: "Thriller's Edge",
      apiFunction: () => getTmdbMovieDiscoverByName("thriller_edge"),
      category: "genres"
    },
    {
      id: "crime_dramas",
      title: "Crime Dramas",
      apiFunction: () => getTmdbMovieDiscoverByName("crime_dramas"),
      category: "genres"
    },
    {
      id: "westerns",
      title: "Westerns",
      apiFunction: () => getTmdbMovieDiscoverByName("westerns"),
      category: "genres"
    },
    {
      id: "war_epics",
      title: "War Epics",
      apiFunction: () => getTmdbMovieDiscoverByName("war_epics"),
      category: "genres"
    },
    {
      id: "dark_comedy",
      title: "Dark Comedy",
      apiFunction: () => getTmdbMovieDiscoverByName("dark_comedy"),
      category: "genres"
    },
    {
      id: "musical_magic",
      title: "Musical Magic",
      apiFunction: () => getTmdbMovieDiscoverByName("musical_magic"),
      category: "genres"
    },

    // Moods & Themes
    {
      id: "feel_good",
      title: "Feel Good",
      apiFunction: () => getTmdbMovieDiscoverByName("feel_good"),
      category: "moods"
    },
    {
      id: "mind_benders",
      title: "Mind Benders",
      apiFunction: () => getTmdbMovieDiscoverByName("mind_benders"),
      category: "moods"
    },
    {
      id: "epic_movies",
      title: "Epic Movies",
      apiFunction: () => getTmdbMovieDiscoverByName("epic_movies"),
      category: "moods"
    },
    {
      id: "quick_picks",
      title: "Quick Picks",
      apiFunction: () => getTmdbMovieDiscoverByName("quick_picks"),
      category: "moods"
    },
    {
      id: "family_night",
      title: "Family Night",
      apiFunction: () => getTmdbMovieDiscoverByName("family_night"),
      category: "moods"
    },
    {
      id: "true_stories",
      title: "True Stories",
      apiFunction: () => getTmdbMovieDiscoverByName("true_stories"),
      category: "moods"
    },
    {
      id: "coming_of_age",
      title: "Coming of Age",
      apiFunction: () => getTmdbMovieDiscoverByName("coming_of_age"),
      category: "moods"
    },

    // Decades
    {
      id: "golden_age",
      title: "Golden Age",
      apiFunction: () => getTmdbMovieDiscoverByName("golden_age"),
      category: "decades"
    },
    {
      id: "90s_nostalgia",
      title: "90s Nostalgia",
      apiFunction: () => getTmdbMovieDiscoverByName("90s_nostalgia"),
      category: "decades"
    },
    {
      id: "2000s_classics",
      title: "2000s Classics",
      apiFunction: () => getTmdbMovieDiscoverByName("2000s_classics"),
      category: "decades"
    },
    {
      id: "2010s_best",
      title: "2010s Best",
      apiFunction: () => getTmdbMovieDiscoverByName("2010s_best"),
      category: "decades"
    },

    // Special Collections
    {
      id: "blockbusters",
      title: "Blockbusters",
      apiFunction: () => getTmdbMovieDiscoverByName("blockbusters"),
      category: "special"
    },
    {
      id: "hidden_gems",
      title: "Hidden Gems",
      apiFunction: () => getTmdbMovieDiscoverByName("hidden_gems"),
      category: "special"
    },
    {
      id: "modern_classics",
      title: "Modern Classics",
      apiFunction: () => getTmdbMovieDiscoverByName("modern_classics"),
      category: "special"
    },
    {
      id: "indie_darlings",
      title: "Indie Darlings",
      apiFunction: () => getTmdbMovieDiscoverByName("indie_darlings"),
      category: "special"
    },
    {
      id: "international_cinema",
      title: "International Cinema",
      apiFunction: () => getTmdbMovieDiscoverByName("international_cinema"),
      category: "special"
    },
    {
      id: "oscar_winners",
      title: "Oscar Winners",
      apiFunction: () => getTmdbMovieDiscoverByName("oscar_winners"),
      category: "special"
    },
    {
      id: "space_odyssey",
      title: "Space Odyssey",
      apiFunction: () => getTmdbMovieDiscoverByName("space_odyssey"),
      category: "special"
    },
    {
      id: "superhero_saga",
      title: "Superhero Saga",
      apiFunction: () => getTmdbMovieDiscoverByName("superhero_saga"),
      category: "special"
    },
    {
      id: "heist_films",
      title: "Heist Films",
      apiFunction: () => getTmdbMovieDiscoverByName("heist_films"),
      category: "special"
    },
    {
      id: "zombies_apocalypse",
      title: "Zombies & Apocalypse",
      apiFunction: () => getTmdbMovieDiscoverByName("zombies_apocalypse"),
      category: "special"
    },
    {
      id: "time_travel",
      title: "Time Travel",
      apiFunction: () => getTmdbMovieDiscoverByName("time_travel"),
      category: "special"
    }
  ];

  const activeLists = computed(() => {
    return discoverLists.filter(list => list.category === activeCategory.value);
  });
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .discover-page {
    background-color: var(--background-color);
    min-height: 100vh;
  }

  .hero-section {
    position: relative;
    overflow: hidden;
    min-height: 400px;

    @include mobile {
      min-height: 350px;
    }
  }

  .hero-content-wrapper {
    position: relative;
    z-index: 1;
  }

  .discover-header {
    padding: 4rem 1.5rem 2rem;
    text-align: center;

    @include mobile {
      padding: 3rem 1rem 1.5rem;
    }

    h1 {
      margin: 0 0 0.5rem;
      font-size: 3rem;
      font-weight: 700;
      color: #ffffff;
      text-shadow:
        0 3px 15px rgba(0, 0, 0, 0.8),
        0 1px 3px rgba(0, 0, 0, 0.6);
      letter-spacing: -0.5px;

      @include mobile {
        font-size: 2rem;
      }
    }

    .discover-subtitle {
      margin: 0;
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.95);
      font-weight: 300;
      text-shadow:
        0 2px 10px rgba(0, 0, 0, 0.8),
        0 1px 3px rgba(0, 0, 0, 0.6);

      @include mobile {
        font-size: 0.95rem;
      }
    }
  }

  .hero-collage {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 10px;
    padding: 10px;
    opacity: 0.4;
    filter: blur(0px);

    @include mobile {
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(3, 1fr);
      gap: 8px;
      padding: 8px;
    }
  }

  .poster-tile {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 6px;
    animation: fadeIn 0.8s ease-in-out;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);

    &:nth-child(even) {
      animation-delay: 0.1s;
    }

    &:nth-child(3n) {
      animation-delay: 0.2s;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(var(--background-color-rgb, 18, 18, 18), 0.6) 0%,
      rgba(var(--background-color-rgb, 18, 18, 18), 0.7) 50%,
      rgba(var(--background-color-rgb, 18, 18, 18), 0.6) 100%
    );
    backdrop-filter: blur(0px);
  }

  .discover-content {
    padding: 0;
    background-color: var(--background-color);
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.1) 50%,
        transparent 100%
      );
    }
  }
</style>
