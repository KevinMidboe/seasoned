<template>
  <div class="browser-storage">
    <div class="settings-section-header">
      <h2>Browser Storage</h2>
      <p>
        Your browser stores data locally to make this site faster and remember
        your settings. View what's saved on this device and remove items
        anytime.
      </p>
    </div>

    <div class="storage-sections">
      <div
        v-for="section in sections"
        :key="section.type"
        :class="`storage-section storage-section--${section.type}`"
      >
        <button
          class="storage-section__header"
          @click="
            expandedSections[section.type] = !expandedSections[section.type]
          "
        >
          <div class="storage-section__header-content">
            <component :is="section.iconComponent" class="section-icon" />
            <h3 class="storage-section__title">{{ section.title }}</h3>
            <span class="storage-section__count">{{
              section.items.length
            }}</span>
            <span class="storage-section__size">{{ section.totalSize }}</span>
          </div>
          <div class="chevron-container">
            <transition name="fade">
              <IconExpandVertical
                v-if="!expandedSections[section.type]"
                key="expand"
                class="storage-section__chevron"
              />
              <IconShrinkVertical
                v-else
                key="shrink"
                class="storage-section__chevron"
              />
            </transition>
          </div>
        </button>
        <div
          v-if="expandedSections[section.type]"
          class="storage-section__content"
        >
          <p class="storage-section__description">{{ section.description }}</p>
          <div class="storage-items">
            <div
              v-for="item in section.items"
              :key="item.key"
              :class="`storage-item storage-item--${section.type}`"
            >
              <component :is="section.iconComponent" class="type-icon" />
              <div class="storage-item__info">
                <h4 class="storage-item__title">{{ item.key }}</h4>
                <p class="storage-item__description">
                  <span v-if="item.description">{{ item.description }} · </span>
                  <span class="storage-item__size">{{ item.size }}</span>
                </p>
              </div>
              <button
                class="storage-item__delete"
                @click="$emit('clear-item', item.key, section.type)"
                :title="`Clear ${item.key}`"
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
  import { ref } from "vue";
  import IconClose from "@/icons/IconClose.vue";
  import IconExpandVertical from "@/icons/IconExpandVertical.vue";
  import IconShrinkVertical from "@/icons/IconShrinkVertical.vue";

  interface StorageItem {
    key: string;
    description: string;
    size: string;
    type: "local" | "session" | "cookie";
  }

  interface StorageSection {
    type: "local" | "session" | "cookie";
    title: string;
    description: string;
    iconComponent: any;
    items: StorageItem[];
    totalSize: string;
  }

  defineProps<{
    sections: StorageSection[];
  }>();

  defineEmits<{
    "clear-item": [key: string, type: "local" | "session" | "cookie"];
  }>();

  const expandedSections = ref<Record<string, boolean>>({
    local: false,
    session: false,
    cookie: false
  });
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";
  @import "scss/shared-settings";

  .browser-storage {
    &__intro {
      margin-bottom: 2rem;
    }
  }

  .storage-sections {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .storage-section {
    border-radius: 0.5rem;
    background: var(--background-ui);
    overflow: hidden;
    border: 2px solid transparent;
    transition: border-color 0.2s ease;

    &--local {
      border-color: rgba(139, 92, 246, 0.2);
      .section-icon,
      .type-icon {
        stroke: #8b5cf6;
      }
    }
    &--session {
      border-color: rgba(245, 158, 11, 0.2);
      .section-icon,
      .type-icon {
        stroke: #f59e0b;
      }
    }
    &--cookie {
      border-color: rgba(236, 72, 153, 0.2);
      .section-icon,
      .type-icon {
        fill: #ec4899;
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
      position: absolute;
      width: 20px;
      height: 20px;
      fill: var(--text-color-70);
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

  .storage-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem 1rem 1rem 1rem;
  }

  .storage-item {
    display: grid;
    grid-template-columns: auto 1fr auto;
    background: var(--background-color);
    border-radius: 0.25rem;
    overflow: hidden;
    transition: all 0.2s ease;
    border-left: 3px solid;

    &--local {
      border-color: #8b5cf6;
      background: linear-gradient(
        90deg,
        rgba(139, 92, 246, 0.1),
        var(--background-color)
      );
    }
    &--session {
      border-color: #f59e0b;
      background: linear-gradient(
        90deg,
        rgba(245, 158, 11, 0.1),
        var(--background-color)
      );
    }
    &--cookie {
      border-color: #ec4899;
      background: linear-gradient(
        90deg,
        rgba(236, 72, 153, 0.1),
        var(--background-color)
      );
    }

    &:hover .storage-item__delete {
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

  .chevron-container {
    width: 20px;
    height: 20px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  // Simple crossfade transition
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
