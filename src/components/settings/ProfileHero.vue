<template>
  <div class="profile-hero">
    <div class="profile-hero__main">
      <div class="profile-hero__avatar">
        <div class="avatar-large">{{ userInitials }}</div>
      </div>
      <div class="profile-hero__info">
        <h1 class="profile-hero__name">{{ username }}</h1>
        <span :class="['profile-hero__badge', `badge--${userRole}`]">
          <a v-if="userRole === 'admin'" href="/admin">{{ userRole }}</a>
          <span v-else>{{ userRole }}</span>
        </span>
        <p class="profile-hero__member">Member since {{ memberSince }}</p>
      </div>
    </div>

    <div class="profile-hero__stats">
      <div class="stat-large">
        <span class="stat-large__value">{{ stats.totalRequests }}</span>
        <span class="stat-large__label">Requests</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-large">
        <span class="stat-large__value">{{ stats.magnetsAdded }}</span>
        <span class="stat-large__label">Magnets Added</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { useStore } from "vuex";

  const store = useStore();

  const username = computed(() => store.getters["user/username"] || "User");
  const userRole = computed(() =>
    store.getters["user/admin"] ? "admin" : "user"
  );

  const userInitials = computed(() => {
    return username.value.slice(0, 2).toUpperCase();
  });

  const memberSince = computed(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric"
    });
  });

  const stats = {
    totalRequests: 45,
    magnetsAdded: 127
  };
</script>

<style lang="scss" scoped>
  @import "scss/media-queries";

  .profile-hero {
    background-color: var(--background-color-secondary);
    border-radius: 0.75rem;
    padding: 1.5rem;
    border: 1px solid var(--background-40);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;

    @include mobile-only {
      flex-direction: column;
      padding: 1.5rem 1.25rem;
      border-radius: 0.5rem;
      text-align: center;
      gap: 1rem;
    }

    &__main {
      display: flex;
      align-items: center;
      gap: 1.5rem;

      @include mobile-only {
        flex-direction: column;
        gap: 0.75rem;
      }
    }

    &__avatar {
      flex-shrink: 0;
    }

    &__info {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;

      @include mobile-only {
        align-items: center;
      }
    }

    &__name {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 600;
      line-height: 1.1;

      @include mobile-only {
        font-size: 1.5rem;
      }
    }

    &__badge {
      display: inline-block;
      padding: 0.25rem 0.7rem;
      border-radius: 2rem;
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 600;
      width: fit-content;

      @include mobile-only {
        padding: 0.2rem 0.6rem;
        font-size: 0.7rem;
      }

      &.badge--admin {
        background-color: var(--color-warning);
        color: black;
      }

      &.badge--user {
        background-color: var(--background-40);
      }
    }

    &__member {
      margin: 0;
      font-size: 0.85rem;
      color: var(--text-color-70);

      @include mobile-only {
        font-size: 0.8rem;
      }
    }

    &__stats {
      display: flex;
      align-items: center;
      gap: 1.75rem;
      padding-left: 1.75rem;
      border-left: 1px solid var(--background-40);

      @include mobile-only {
        width: 100%;
        padding: 1rem 0 0 0;
        border-left: none;
        border-top: 1px solid var(--background-40);
        justify-content: center;
        gap: 1.25rem;
      }
    }
  }

  .avatar-large {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      var(--highlight-color),
      var(--color-green-70)
    );
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    font-weight: 700;
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);

    @include mobile-only {
      width: 80px;
      height: 80px;
      font-size: 2rem;
    }
  }

  .stat-large {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;

    &__value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--highlight-color);
      line-height: 1;

      @include mobile-only {
        font-size: 1.75rem;
      }
    }

    &__label {
      font-size: 0.75rem;
      color: var(--text-color-70);
      text-transform: uppercase;
      font-weight: 500;
      letter-spacing: 0.5px;

      @include mobile-only {
        font-size: 0.75rem;
      }
    }
  }

  .stat-divider {
    width: 1px;
    height: 45px;
    background-color: var(--background-40);

    @include mobile-only {
      height: 45px;
    }
  }
</style>
