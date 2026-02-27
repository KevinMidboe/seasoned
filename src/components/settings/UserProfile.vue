<template>
  <div class="user-profile">
    <div class="profile-card">
      <div class="avatar-circle">{{ userInitials }}</div>
      <div class="profile-details">
        <div class="name-row">
          <span class="username">{{ username }}</span>
          <span :class="['role-badge', `role-badge--${userRole}`]">{{
            userRole
          }}</span>
          <span
            v-if="plexUsername"
            class="role-badge role-badge--plex"
            :title="`Connected as ${plexUsername}`"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 256 256"
              fill="currentColor"
            >
              <path
                d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zm57.7 128.7l-48 48c-.4.4-.9.7-1.4.9-.5.2-1.1.4-1.6.4s-1.1-.1-1.6-.4c-.5-.2-1-.5-1.4-.9l-48-48c-1.6-1.6-1.6-4.1 0-5.7 1.6-1.6 4.1-1.6 5.7 0l41.1 41.1V80c0-2.2 1.8-4 4-4s4 1.8 4 4v84.1l41.1-41.1c1.6-1.6 4.1-1.6 5.7 0 .8.8 1.2 1.8 1.2 2.8s-.4 2.1-1.2 2.9z"
              />
            </svg>
            Plex
          </span>
        </div>
        <span class="member-info">Member since {{ memberSince }}</span>
        <span v-if="plexUsername" class="plex-info"
          >Connected as {{ plexUsername }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  import { useStore } from "vuex";

  const store = useStore();
  const plexUsername = ref<string>("");

  const username = computed(() => store.getters["user/username"] || "User");

  const userRole = computed(() =>
    store.getters["user/admin"] ? "admin" : "user"
  );

  const userInitials = computed(() => username.value.slice(0, 2).toUpperCase());

  const memberSinceDate = computed(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    return date;
  });

  const memberSince = computed(() =>
    memberSinceDate.value.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric"
    })
  );

  const monthsActive = computed(() => {
    const now = new Date();
    return (
      (now.getFullYear() - memberSinceDate.value.getFullYear()) * 12 +
      now.getMonth() -
      memberSinceDate.value.getMonth()
    );
  });

  // Load Plex username from localStorage
  function loadPlexUsername() {
    const cachedData = localStorage.getItem("plex_user_data");
    if (cachedData) {
      try {
        const plexData = JSON.parse(cachedData);
        plexUsername.value = plexData.username || "";
      } catch (error) {
        console.error("Error parsing cached Plex data:", error);
      }
    }
  }

  onMounted(() => {
    loadPlexUsername();
  });
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .user-profile {
    @include mobile-only {
      width: 100%;
    }
  }

  .profile-card {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.85rem;
    background-color: var(--background-ui);
    border-radius: 0.25rem;

    @include mobile-only {
      padding: 0.75rem;
      gap: 0.75rem;
    }
  }

  .avatar-circle {
    width: 55px;
    height: 55px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      var(--highlight-color),
      var(--color-green-70)
    );
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    font-weight: 600;
    color: $white;
    flex-shrink: 0;

    @include mobile-only {
      width: 48px;
      height: 48px;
      font-size: 1.1rem;
    }
  }

  .profile-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    min-width: 0;
  }

  .name-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .username {
    font-size: 1.05rem;
    font-weight: 600;
    color: $text-color;
    line-height: 1.2;

    @include mobile-only {
      font-size: 0.95rem;
    }
  }

  .member-info {
    font-size: 0.8rem;
    color: $text-color-70;
    line-height: 1.2;

    @include mobile-only {
      font-size: 0.75rem;
    }
  }

  .plex-info {
    font-size: 0.75rem;
    color: #cc7b19;
    line-height: 1.2;
    display: flex;
    align-items: center;
    gap: 0.3rem;

    @include mobile-only {
      font-size: 0.7rem;
    }
  }

  .role-badge {
    padding: 0.2rem 0.55rem;
    border-radius: 0.25rem;
    font-size: 0.65rem;
    text-transform: uppercase;
    font-weight: 600;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;

    &--admin {
      background-color: var(--color-warning);
      color: $black;
    }

    &--user {
      background-color: var(--background-40);
      color: $text-color;
    }

    &--plex {
      background-color: #cc7b19;
      color: $white;
      cursor: help;

      svg {
        flex-shrink: 0;
      }
    }
  }
</style>
