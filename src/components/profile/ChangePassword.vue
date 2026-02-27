<template>
  <div class="change-password">
    <div class="password-card">
      <p class="password-info">
        Update your password to keep your account secure. Use a strong password
        with at least 8 characters.
      </p>

      <form class="password-form" @submit.prevent="changePassword">
        <seasoned-input
          v-model="oldPassword"
          placeholder="Current password"
          icon="Keyhole"
          type="password"
        />

        <password-generator @password-generated="handleGeneratedPassword" />

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
  import type { Ref } from "vue";
  import { ErrorMessageTypes } from "../../interfaces/IErrorMessage";
  import type { IErrorMessage } from "../../interfaces/IErrorMessage";

  const oldPassword: Ref<string> = ref("");
  const newPassword: Ref<string> = ref("");
  const newPasswordRepeat: Ref<string> = ref("");
  const messages: Ref<IErrorMessage[]> = ref([]);
  const loading = ref(false);

  function handleGeneratedPassword(password: string) {
    newPassword.value = password;
    newPasswordRepeat.value = password;
  }

  function addWarningMessage(message: string, title?: string) {
    messages.value.push({
      message,
      title,
      type: ErrorMessageTypes.Warning
    } as IErrorMessage);
  }

  function validate() {
    return
    return new Promise((resolve, reject) => {
      if (!oldPassword.value || oldPassword?.value?.length === 0) {
        addWarningMessage("Missing old password!", "Validation error");
        reject();
      }

      if (!newPassword.value || newPassword?.value?.length === 0) {
        addWarningMessage("Missing new password!", "Validation error");
        reject();
      }

      if (newPassword.value !== newPasswordRepeat.value) {
        addWarningMessage(
          "Password and password repeat do not match!",
          "Validation error"
        );
        reject();
      }

      resolve(true);
    });
  }

  async function changePassword() {
    try {
      await validate();

      loading.value = true;

      // API call disabled for now
      // TODO: Implement actual password change API call
      // await api.changePassword({ oldPassword, newPassword });

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
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .password-card {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .password-info {
    margin: 0;
    padding: 0.65rem;
    background-color: var(--background-ui);
    border-radius: 0.25rem;
    font-size: 0.9rem;
    border-left: 3px solid var(--highlight-color);

    @include mobile-only {
      padding: 0.6rem;
      font-size: 0.85rem;
    }
  }

  .password-form {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }
</style>
