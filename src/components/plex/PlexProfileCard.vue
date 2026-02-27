<template>
  <div v-if="username" class="plex-profile-card">
    <div class="profile-header">
      <img
        v-if="userData?.thumb"
        :src="userData.thumb"
        alt="Profile"
        class="profile-avatar"
      />
      <div v-else class="profile-avatar-placeholder">
        {{ username.charAt(0).toUpperCase() }}
      </div>
      <div class="profile-info">
        <div class="username-row">
          <h3 class="profile-username">{{ username }}</h3>
          <svg
            class="connected-checkmark"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div v-if="userData?.email" class="profile-email">
          {{ userData.email }}
        </div>
        <div class="profile-badges">
          <div
            v-if="userData?.subscription?.active"
            class="profile-badge plex-pass"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 256 256"
              fill="currentColor"
            >
              <path
                d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zm0 230.4C66.9 230.4 25.6 189.1 25.6 128S66.9 25.6 128 25.6 230.4 66.9 230.4 128 189.1 230.4 128 230.4z"
              />
            </svg>
            Plex Pass
          </div>
          <div v-if="userData?.joined_at" class="profile-badge member-since">
            {{ formatMemberSince(userData.joined_at) }}
          </div>
          <div
            v-if="userData?.two_factor_enabled"
            class="profile-badge two-factor"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            2FA
          </div>
          <div
            v-if="userData?.experimental_features"
            class="profile-badge experimental"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
              ></path>
            </svg>
            Labs
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    username: string;
    userData: any;
  }

  defineProps<Props>();

  function formatMemberSince(dateString: string) {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const years = now.getFullYear() - date.getFullYear();

      if (years === 0) return "New Member";
      if (years === 1) return "1 Year";
      return `${years} Years`;
    } catch {
      return "Member";
    }
  }
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .plex-profile-card {
    background-color: var(--background-ui);
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 0.85rem;
    border: 1px solid var(--background-40);

    @include mobile-only {
      padding: 0.85rem;
    }
  }

  .profile-header {
    display: flex;
    gap: 0.85rem;
    align-items: center;
  }

  .profile-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--highlight-color);
    flex-shrink: 0;

    @include mobile-only {
      width: 50px;
      height: 50px;
    }
  }

  .profile-avatar-placeholder {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      var(--highlight-color),
      var(--background-40)
    );
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-color);
    flex-shrink: 0;

    @include mobile-only {
      width: 50px;
      height: 50px;
      font-size: 1.3rem;
    }
  }

  .profile-info {
    flex: 1;
    min-width: 0;
  }

  .username-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }

  .profile-username {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-color);

    @include mobile-only {
      font-size: 1.1rem;
    }
  }

  .connected-checkmark {
    color: var(--color-success-highlight);
    flex-shrink: 0;
    animation: checkmarkPop 0.3s ease-out;

    @include mobile-only {
      width: 18px;
      height: 18px;
    }
  }

  @keyframes checkmarkPop {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .profile-email {
    font-size: 0.85rem;
    color: var(--text-color-60);
    margin-bottom: 0.4rem;
    word-break: break-all;

    @include mobile-only {
      font-size: 0.8rem;
    }
  }

  .profile-badges {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 0.4rem;
  }

  .profile-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.25rem 0.65rem;
    border-radius: 1rem;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.02em;

    @include mobile-only {
      font-size: 0.65rem;
      padding: 0.2rem 0.55rem;
    }

    &.plex-pass {
      background-color: #cc7b19;
      color: $white;
      text-transform: uppercase;

      svg {
        width: 12px;
        height: 12px;

        @include mobile-only {
          width: 11px;
          height: 11px;
        }
      }
    }

    &.member-since {
      background-color: var(--background-40);
      color: var(--text-color-70);
    }

    &.two-factor {
      background-color: var(--color-success);
      color: $white;

      svg {
        width: 11px;
        height: 11px;

        @include mobile-only {
          width: 10px;
          height: 10px;
        }
      }
    }

    &.experimental {
      background-color: #8b5cf6;
      color: $white;

      svg {
        width: 11px;
        height: 11px;

        @include mobile-only {
          width: 10px;
          height: 10px;
        }
      }
    }
  }
</style>
