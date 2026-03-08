<template>
  <div class="server-storage">
    <div class="server-storage__intro">
      <h2 class="server-storage__title">Server Storage</h2>
      <p class="server-storage__description">
        Data stored on our servers to sync across your devices and provide
        personalized features.
      </p>
    </div>

    <div class="server-sections">
      <div
        v-for="section in serverSections"
        :key="section.type"
        :class="`server-section server-section--${section.type}`"
      >
        <button
          class="server-section__header"
          @click="
            expandedSections[section.type] = !expandedSections[section.type]
          "
        >
          <div class="server-section__header-content">
            <component :is="section.iconComponent" class="section-icon" />
            <h3 class="server-section__title">{{ section.title }}</h3>
            <span class="server-section__count">{{
              section.items.length
            }}</span>
            <span class="server-section__size">{{ section.totalSize }}</span>
          </div>
          <svg
            class="server-section__chevron"
            :class="{
              'server-section__chevron--expanded':
                expandedSections[section.type]
            }"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <div
          v-if="expandedSections[section.type]"
          class="server-section__content"
        >
          <p class="server-section__description">{{ section.description }}</p>
          <div class="server-items">
            <div
              v-for="item in section.items"
              :key="item.key"
              :class="`server-item server-item--${section.type}`"
            >
              <component :is="section.iconComponent" class="type-icon" />
              <div class="server-item__info">
                <h4 class="server-item__title">{{ item.key }}</h4>
                <p class="server-item__description">
                  <span v-if="item.description">{{ item.description }} · </span>
                  <span class="server-item__size">{{ item.size }}</span>
                  <span v-if="item.lastSynced" class="server-item__synced">
                    · Last synced: {{ item.lastSynced }}</span
                  >
                </p>
              </div>
              <button
                class="server-item__delete"
                @click="$emit('clear-item', item.key, section.type)"
                :title="`Delete ${item.key}`"
              >
                <IconClose />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from "vue";
  import IconClose from "@/icons/IconClose.vue";
  import IconProfile from "@/icons/IconProfile.vue";
  import IconSettings from "@/icons/IconSettings.vue";
  import IconActivity from "@/icons/IconActivity.vue";

  interface ServerItem {
    key: string;
    description: string;
    size: string;
    lastSynced?: string;
  }

  defineEmits<{
    "clear-item": [key: string, type: string];
  }>();

  const expandedSections = ref<Record<string, boolean>>({
    profile: false,
    preferences: false,
    activity: false
  });

  // Mock server data
  const serverSections = computed(() => [
    {
      type: "profile",
      title: "Profile Data",
      iconComponent: IconProfile,
      description:
        "Your account information, settings, and preferences stored on our servers.",
      items: [
        {
          key: "user_profile",
          description: "User account details",
          size: "2.4 KB",
          lastSynced: "2 hours ago"
        },
        {
          key: "avatar_image",
          description: "Profile picture",
          size: "145 KB",
          lastSynced: "1 day ago"
        },
        {
          key: "email_preferences",
          description: "Notification settings",
          size: "512 Bytes",
          lastSynced: "3 days ago"
        }
      ],
      totalSize: "147.9 KB"
    },
    {
      type: "preferences",
      title: "Synced Preferences",
      iconComponent: IconSettings,
      description:
        "Settings that sync across all your devices when you sign in.",
      items: [
        {
          key: "theme_settings",
          description: "Color theme and appearance",
          size: "1.1 KB",
          lastSynced: "5 hours ago"
        },
        {
          key: "playback_settings",
          description: "Video and audio preferences",
          size: "856 Bytes",
          lastSynced: "1 day ago"
        },
        {
          key: "library_filters",
          description: "Saved filters and sorting",
          size: "2.3 KB",
          lastSynced: "2 days ago"
        }
      ],
      totalSize: "4.3 KB"
    },
    {
      type: "activity",
      title: "Activity History",
      iconComponent: IconActivity,
      description:
        "Your viewing history and watch progress stored on our servers.",
      items: [
        {
          key: "watch_history",
          description: "Recently watched items",
          size: "12.5 KB",
          lastSynced: "1 hour ago"
        },
        {
          key: "watch_progress",
          description: "Playback positions",
          size: "8.2 KB",
          lastSynced: "30 minutes ago"
        },
        {
          key: "favorites",
          description: "Starred and favorited content",
          size: "3.7 KB",
          lastSynced: "6 hours ago"
        }
      ],
      totalSize: "24.4 KB"
    }
  ]);
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .server-storage {
    &__intro {
      margin-bottom: 2rem;
    }

    &__title {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-color);
    }

    &__description {
      margin: 0;
      color: var(--text-color-70);
      font-size: 0.95rem;
      line-height: 1.6;
    }
  }

  .server-sections {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .server-section {
    border-radius: 0.5rem;
    background: var(--background-ui);
    overflow: hidden;
    border: 2px solid transparent;
    transition: border-color 0.2s ease;

    &--profile {
      border-color: rgba(59, 130, 246, 0.2);
      .section-icon,
      .type-icon {
        fill: #3b82f6;
      }
    }
    &--preferences {
      border-color: rgba(16, 185, 129, 0.2);
      .section-icon,
      .type-icon {
        fill: #10b981;
      }
    }
    &--activity {
      border-color: rgba(245, 158, 11, 0.2);
      .section-icon,
      .type-icon {
        fill: #f59e0b;
      }
    }

    &__header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      background: none;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s ease;
      &:hover {
        background: var(--background-40);
      }
    }

    &__header-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      .section-icon {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
      }
    }

    &__title {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-color);
    }
    &__count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 24px;
      height: 24px;
      padding: 0 0.5rem;
      background: var(--background-40);
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-color-70);
    }
    &__size {
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-color-50);
      font-family: monospace;
    }
    &__chevron {
      width: 20px;
      height: 20px;
      stroke: var(--text-color-70);
      transition: transform 0.2s ease;
      &--expanded {
        transform: rotate(180deg);
      }
    }
    &__content {
      border-top: 1px solid var(--background-40);
    }
    &__description {
      margin: 0;
      padding: 1rem 1.25rem;
      font-size: 0.9rem;
      line-height: 1.6;
      color: var(--text-color-70);
      background: var(--background-color);
      font-style: italic;
    }
  }

  .server-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem 1rem 1rem 1rem;
  }

  .server-item {
    display: grid;
    grid-template-columns: auto 1fr auto;
    background: var(--background-color);
    border-radius: 0.25rem;
    overflow: hidden;
    transition: all 0.2s ease;
    border-left: 3px solid;

    &--profile {
      border-color: #3b82f6;
      background: linear-gradient(
        90deg,
        rgba(59, 130, 246, 0.1),
        var(--background-color)
      );
    }
    &--preferences {
      border-color: #10b981;
      background: linear-gradient(
        90deg,
        rgba(16, 185, 129, 0.1),
        var(--background-color)
      );
    }
    &--activity {
      border-color: #f59e0b;
      background: linear-gradient(
        90deg,
        rgba(245, 158, 11, 0.1),
        var(--background-color)
      );
    }

    &:hover .server-item__delete {
      background: var(--color-error-highlight);
    }
    &:hover .type-icon {
      opacity: 1;
    }

    .type-icon {
      width: 1.5rem;
      height: 1.5rem;
      opacity: 0.6;
      transition: opacity 0.2s;
      margin: auto 1.5rem;
      @include mobile-only {
        width: 1.25rem;
        height: 1.25rem;
        margin: auto 1rem;
      }
    }

    &__info {
      min-width: 0;
      padding: 0.85rem 0.85rem 0.85rem 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      @include mobile-only {
        padding: 0.75rem 0.75rem 0.75rem 0;
      }
    }

    &__title {
      margin: 0 0 0.3rem;
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-color);
      @include mobile-only {
        font-size: 1rem;
      }
    }
    &__description {
      margin: 0;
      font-size: 0.8rem;
      color: var(--text-color-70);
      line-height: 1.4;
      @include mobile-only {
        font-size: 0.75rem;
      }
    }
    &__size {
      color: var(--text-color-50);
      font-family: monospace;
    }
    &__synced {
      color: var(--text-color-50);
      font-style: italic;
    }

    &__delete {
      width: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-error);
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      @include mobile-only {
        width: 60px;
      }

      svg {
        width: 20px;
        height: 20px;
        fill: white;
        transition: transform 0.2s;
        @include mobile-only {
          width: 18px;
          height: 18px;
        }
      }
      &:hover {
        background: var(--color-error-highlight);
        svg {
          transform: scale(1.1);
        }
      }
      &:active svg {
        transform: scale(0.9);
      }
    }
  }
</style>
