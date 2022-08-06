<template>
  <div>
    <h3 class="settings__header">Change password</h3>
    <form class="form">
      <seasoned-input
        placeholder="old password"
        icon="Keyhole"
        type="password"
        v-model="oldPassword"
      />

      <seasoned-input
        placeholder="new password"
        icon="Keyhole"
        type="password"
        v-model="newPassword"
      />

      <seasoned-input
        placeholder="repeat new password"
        icon="Keyhole"
        type="password"
        v-model="newPasswordRepeat"
      />

      <seasoned-button @click="changePassword">change password</seasoned-button>
    </form>
    <seasoned-messages v-model:messages="messages" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import SeasonedInput from "@/components/ui/SeasonedInput.vue";
  import SeasonedButton from "@/components/ui/SeasonedButton.vue";
  import SeasonedMessages from "@/components/ui/SeasonedMessages.vue";
  import type { Ref } from "vue";
  import type IErrorMessage from "../../interfaces/IErrorMessage";

  interface ResetPasswordPayload {
    old_password: string;
    new_password: string;
  }

  const oldPassword: Ref<string> = ref("");
  const newPassword: Ref<string> = ref("");
  const newPasswordRepeat: Ref<string> = ref("");
  const messages: Ref<IErrorMessage[]> = ref([]);

  function clearMessages() {
    messages.value = [];
  }

  function addWarningMessage(message: string, title?: string) {
    messages.value.push({ message, title, type: "warning" });
  }

  function validate() {
    return new Promise((resolve, reject) => {
      if (!oldPassword.value || oldPassword?.value?.length === 0) {
        addWarningMessage("Missing old password!", "Validation error");
        return reject();
      }

      if (!newPassword.value || newPassword?.value?.length === 0) {
        addWarningMessage("Missing new password!", "Validation error");
        return reject();
      }

      if (newPassword.value !== newPasswordRepeat.value) {
        addWarningMessage(
          "Password and password repeat do not match!",
          "Validation error"
        );
        return reject();
      }

      resolve(true);
    });
  }

  // TODO seasoned-api /user/password-reset
  async function changePassword() {
    try {
      validate();
    } catch (error) {
      console.log("not valid!");
      return;
    }

    const body: ResetPasswordPayload = {
      old_password: oldPassword.value,
      new_password: newPassword.value
    };
    const options = {};
    // fetch()
  }
</script>
