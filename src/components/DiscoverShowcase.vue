<template>
  <div class="category-showcase">
    <div class="categories-grid">
      <button
        v-for="category in categories"
        :key="category.id"
        class="category-card"
        :class="[
          `category-${category.id}`,
          { active: activeCategory === category.id }
        ]"
        @click="$emit('select', category.id)"
      >
        <component :is="category.icon" class="category-icon" />
        <div class="category-info">
          <h3 class="category-name">{{ category.label }}</h3>
          <p class="category-count">
            <span class="desktop-only">{{ category.count }} collections</span>
            <span class="mobile-only">{{ category.count }}</span>
          </p>
        </div>
        <div class="category-arrow">→</div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from "vue-router";
  import IconPopular from "@/icons/IconPopular.vue";
  import IconSpotlights from "@/icons/IconSpotlights.vue";
  import IconTheater from "@/icons/IconTheater.vue";
  import IconCalendar from "@/icons/IconCalendar.vue";
  import IconStar from "@/icons/IconStar.vue";

  interface Props {
    activeCategory?: string;
  }

  withDefaults(defineProps<Props>(), {
    activeCategory: ""
  });

  defineEmits<{
    select: [categoryId: string];
  }>();

  const router = useRouter();

  const categories = [
    { id: "popular", label: "Popular", icon: IconPopular, count: 5 },
    { id: "genres", label: "Genres", icon: IconSpotlights, count: 13 },
    { id: "moods", label: "Moods & Themes", icon: IconTheater, count: 7 },
    { id: "decades", label: "By Decade", icon: IconCalendar, count: 4 },
    { id: "special", label: "Special Collections", icon: IconStar, count: 11 }
  ];

  function navigateToDiscover(categoryId?: string) {
    router.push(`/discover${categoryId ? `?category=${categoryId}` : ""}`);
  }
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .category-showcase {
    padding: 1.5rem;
    padding-top: 0;

    @include mobile {
      padding: 0 1rem 0.6rem;
    }
  }

  .categories-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    max-width: 1200px;
    margin: 0 auto;
    justify-content: center;

    @include mobile {
      gap: 0.45rem;
    }
  }

  .category-card {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    gap: 0.9rem;
    padding: 1rem 1.5rem;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    @include mobile {
      padding: 0.45rem 0.7rem;
      gap: 0.4rem;
      border-radius: 20px;
    }

    &.category-popular {
      background: rgba(255, 80, 80, 0.15);
      border-color: rgba(255, 80, 80, 0.3);

      .category-icon {
        fill: rgba(255, 120, 120, 0.9);
      }
    }

    &.category-genres {
      background: rgba(80, 140, 255, 0.15);
      border-color: rgba(80, 140, 255, 0.3);

      .category-icon {
        fill: rgba(120, 170, 255, 0.9);
      }
    }

    &.category-moods {
      background: rgba(160, 80, 255, 0.15);
      border-color: rgba(160, 80, 255, 0.3);

      .category-icon {
        fill: rgba(180, 120, 255, 0.9);
      }
    }

    &.category-decades {
      background: rgba(80, 200, 200, 0.15);
      border-color: rgba(80, 200, 200, 0.3);

      .category-icon {
        fill: rgba(100, 220, 220, 0.9);
      }
    }

    &.category-special {
      background: rgba(255, 180, 80, 0.15);
      border-color: rgba(255, 180, 80, 0.3);

      .category-icon {
        fill: rgba(255, 200, 120, 0.9);
      }
    }

    &.active {
      transform: translateY(-3px) scale(1.03);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);

      &::before {
        opacity: 1;
      }

      .category-icon {
        transform: rotate(5deg) scale(1.15);
      }

      .category-arrow {
        opacity: 1;
        transform: translateX(4px);
      }

      &.category-popular {
        background: rgba(255, 80, 80, 0.3);
        border-color: rgba(255, 80, 80, 0.6);

        .category-icon {
          fill: rgba(255, 160, 160, 1);
        }
      }

      &.category-genres {
        background: rgba(80, 140, 255, 0.3);
        border-color: rgba(80, 140, 255, 0.6);

        .category-icon {
          fill: rgba(160, 210, 255, 1);
        }
      }

      &.category-moods {
        background: rgba(160, 80, 255, 0.3);
        border-color: rgba(160, 80, 255, 0.6);

        .category-icon {
          fill: rgba(220, 160, 255, 1);
        }
      }

      &.category-decades {
        background: rgba(80, 200, 200, 0.3);
        border-color: rgba(80, 200, 200, 0.6);

        .category-icon {
          fill: rgba(140, 255, 255, 1);
        }
      }

      &.category-special {
        background: rgba(255, 180, 80, 0.3);
        border-color: rgba(255, 180, 80, 0.6);

        .category-icon {
          fill: rgba(255, 230, 160, 1);
        }
      }
    }

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.15) 0%,
        transparent 100%
      );
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover {
      transform: translateY(-3px) scale(1.03);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);

      &.category-popular {
        background: rgba(255, 80, 80, 0.25);
        border-color: rgba(255, 80, 80, 0.5);

        .category-icon {
          fill: rgba(255, 140, 140, 1);
        }
      }

      &.category-genres {
        background: rgba(80, 140, 255, 0.25);
        border-color: rgba(80, 140, 255, 0.5);

        .category-icon {
          fill: rgba(140, 190, 255, 1);
        }
      }

      &.category-moods {
        background: rgba(160, 80, 255, 0.25);
        border-color: rgba(160, 80, 255, 0.5);

        .category-icon {
          fill: rgba(200, 140, 255, 1);
        }
      }

      &.category-decades {
        background: rgba(80, 200, 200, 0.25);
        border-color: rgba(80, 200, 200, 0.5);

        .category-icon {
          fill: rgba(120, 240, 240, 1);
        }
      }

      &.category-special {
        background: rgba(255, 180, 80, 0.25);
        border-color: rgba(255, 180, 80, 0.5);

        .category-icon {
          fill: rgba(255, 220, 140, 1);
        }
      }

      &::before {
        opacity: 1;
      }

      .category-icon {
        transform: rotate(5deg) scale(1.15);
      }

      .category-arrow {
        opacity: 1;
        transform: translateX(4px);
      }
    }

    .category-icon {
      width: 24px;
      height: 24px;
      fill: var(--text-color);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      flex-shrink: 0;

      @include mobile {
        width: 16px;
        height: 16px;
      }
    }

    .category-info {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      line-height: 1;

      @include mobile {
        gap: 0.4rem;
      }
    }

    .category-name {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 500;
      color: white;
      white-space: nowrap;

      @include mobile {
        font-size: 0.8rem;
      }
    }

    .category-count {
      margin: 0;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
      background: rgba(255, 255, 255, 0.1);
      padding: 0.2rem 0.6rem;
      border-radius: 12px;
      white-space: nowrap;

      @include mobile {
        font-size: 0.65rem;
        padding: 0.15rem 0.4rem;
      }
    }

    .category-arrow {
      font-size: 1.1rem;
      color: white;
      opacity: 0;
      transition: all 0.3s ease;
      margin-left: 0.25rem;

      @include mobile {
        display: none;
      }
    }
  }
</style>
