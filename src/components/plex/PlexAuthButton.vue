<template>
  <div class="plex-connect">
    <div class="info-box">
      <IconInfo class="info-icon" />
      <p>
        Sign in to your Plex account to get information about recently added
        movies and to see your watch history
      </p>
    </div>
    <div class="signin-container">
      <button @click="handleAuth" :disabled="loading" class="plex-signin-btn">
        <svg
          v-if="!loading"
          width="20"
          height="20"
          viewBox="0 0 256 256"
          fill="currentColor"
        >
          <path
            d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zm57.7 128.7l-48 48c-.4.4-.9.7-1.4.9-.5.2-1.1.4-1.6.4s-1.1-.1-1.6-.4c-.5-.2-1-.5-1.4-.9l-48-48c-1.6-1.6-1.6-4.1 0-5.7 1.6-1.6 4.1-1.6 5.7 0l41.1 41.1V80c0-2.2 1.8-4 4-4s4 1.8 4 4v84.1l41.1-41.1c1.6-1.6 4.1-1.6 5.7 0 .8.8 1.2 1.8 1.2 2.8s-.4 2.1-1.2 2.9z"
          />
        </svg>
        {{ loading ? "Connecting..." : "Sign in with Plex" }}
      </button>
      <p class="popup-note">A popup window will open for authentication</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { usePlexAuth } from "@/composables/usePlexAuth";
  import IconInfo from "@/icons/IconInfo.vue";

  const emit = defineEmits<{
    authSuccess: [token: string];
    authError: [message: string];
  }>();

  const { loading, openAuthPopup } = usePlexAuth();

  function handleAuth() {
    openAuthPopup(
      token => emit("authSuccess", token),
      error => emit("authError", error)
    );
  }
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .info-box {
    display: flex;
    gap: 0.65rem;
    padding: 0.65rem;
    background-color: var(--background-ui);
    border-radius: 0.25rem;
    margin-bottom: 0.85rem;
    border-left: 3px solid var(--highlight-color);

    @include mobile-only {
      padding: 0.6rem;
      gap: 0.55rem;
      margin-bottom: 0.7rem;
    }

    p {
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.4;

      @include mobile-only {
        font-size: 0.85rem;
      }
    }
  }

  .info-icon {
    width: 20px;
    height: 20px;
    fill: var(--highlight-color);
    flex-shrink: 0;

    @include mobile-only {
      width: 18px;
      height: 18px;
    }
  }

  .signin-container {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .plex-signin-btn {
    padding: 1rem 1.75rem;
    background-color: #c87818;
    color: $white;
    border: none;
    border-radius: 0.75rem;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    align-self: flex-start;
    box-shadow: 0 4px 12px rgba(200, 120, 24, 0.25);
    letter-spacing: -0.01em;

    @include mobile-only {
      width: 100%;
      padding: 0.9rem 1.4rem;
      font-size: 1rem;
    }

    &:hover:not(:disabled) {
      background-color: #b36a15;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(200, 120, 24, 0.4);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 4px 12px rgba(200, 120, 24, 0.3);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    svg {
      flex-shrink: 0;
      width: 22px;
      height: 22px;
    }
  }

  .popup-note {
    margin: 0;
    font-size: 0.85rem;
    opacity: 0.65;
  }
</style>
