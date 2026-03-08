<template>
  <div class="change-password">
    <div class="password-card">
      <form class="password-form" @submit.prevent>
        <seasoned-input
          v-model="oldPassword"
          placeholder="Current password"
          icon="Keyhole"
          type="password"
        />

        <div class="password-generator">
          <button class="generator-toggle" @click="toggleGenerator">
            <IconKey class="toggle-icon" />
            <span>{{
              showGenerator ? "Hide" : "Generate Strong Password"
            }}</span>
          </button>
          <div v-if="showGenerator">
            <password-generator @password-generated="handleGeneratedPassword" />
          </div>
        </div>

        <seasoned-input
          v-model="newPassword"
          placeholder="New password"
          icon="Keyhole"
          type="password"
        />

        <seasoned-input
          v-model="newPasswordRepeat"
          placeholder="Confirm new password"
          icon="Keyhole"
          type="password"
        />

        <seasoned-button @click="changePassword" :disabled="loading">
          {{ loading ? "Updating..." : "Change Password" }}
        </seasoned-button>
      </form>
      <seasoned-messages v-model:messages="messages" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import SeasonedInput from "@/components/ui/SeasonedInput.vue";
  import SeasonedButton from "@/components/ui/SeasonedButton.vue";
  import SeasonedMessages from "@/components/ui/SeasonedMessages.vue";
  import PasswordGenerator from "@/components/settings/PasswordGenerator.vue";
  import IconKey from "@/icons/IconKey.vue";
  import type { Ref } from "vue";
  import { ErrorMessageTypes } from "../../interfaces/IErrorMessage";
  import type { IErrorMessage } from "../../interfaces/IErrorMessage";

  const showGenerator = ref(false);
  const oldPassword: Ref<string> = ref("");
  const newPassword: Ref<string> = ref("");
  const newPasswordRepeat: Ref<string> = ref("");
  const messages: Ref<IErrorMessage[]> = ref([]);
  const loading = ref(false);

  function handleGeneratedPassword(password: string) {
    newPassword.value = password;
    newPasswordRepeat.value = password;
  }

  async function changePassword(event: CustomEvent) {
    try {
      messages.value.push({
        message: "Password change is currently disabled",
        title: "Feature Disabled",
        type: ErrorMessageTypes.Warning
      } as IErrorMessage);

      // Clear form
      oldPassword.value = "";
      newPassword.value = "";
      newPasswordRepeat.value = "";

      loading.value = false;
    } catch (error) {
      console.log("not valid! error:", error); // eslint-disable-line no-console
      loading.value = false;
    }
  }

  function toggleGenerator() {
    showGenerator.value = !showGenerator.value;
    /*
    if (showGenerator.value && !generatedPassword.value) {
      generateWordsPassword();
    }
    */
  }
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .password-card {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .password-form {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .generator-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem 1rem;
    background-color: var(--background-ui);
    border: 1px solid var(--background-40);
    border-radius: 0.5rem;
    color: $text-color;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;

    &:hover {
      background-color: var(--background-40);
      border-color: var(--highlight-color);
    }
  }

  .toggle-icon {
    width: 18px;
    height: 18px;
    fill: var(--highlight-color);
  }

  .btn-icon {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
</style>
