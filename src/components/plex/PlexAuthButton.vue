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
        {{ loading ? "Connecting..." : "Sign in with Plex" }}

        <IconPlex v-if="!loading" class="plex-icon" />
      </button>
      <p class="popup-note">A popup window will open for authentication</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { usePlexAuth } from "@/composables/usePlexAuth";
  import IconInfo from "@/icons/IconInfo.vue";
  import IconPlex from "@/icons/IconPlex.vue";

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

    .plex-icon {
      flex-shrink: 0;
      --size: 24px;
      width: var(--size);
      height: var(--size);
      fill: currentColor;
    }
  }

  .popup-note {
    margin: 0;
    font-size: 0.85rem;
    opacity: 0.65;
  }
</style>
