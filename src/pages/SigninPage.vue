<template>
  <div class="signin auth-page">
    <div class="auth-content">
      <div class="auth-header">
        <h1 class="auth-title">Sign in</h1>
        <p class="auth-subtitle">Welcome back! Please enter your credentials</p>
      </div>

      <form ref="formElement" class="auth-form">
        <seasoned-input
          v-model="username"
          placeholder="Email address"
          icon="Email"
          type="email"
          @keydown.enter="focusOnNextElement"
        />
        <seasoned-input
          v-model="password"
          placeholder="Password"
          icon="Keyhole"
          type="password"
          @keydown.enter="submit"
        />

        <seasoned-button class="auth-button" @click="submit">
          Sign In
        </seasoned-button>
      </form>

      <div class="auth-footer">
        <p class="auth-footer-text">
          Don't have an account?
          <router-link class="auth-link" to="/register">
            Register here
          </router-link>
        </p>
      </div>

      <seasoned-messages v-model:messages="messages" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useStore } from "vuex";
  import { useRouter } from "vue-router";
  import SeasonedInput from "@/components/ui/SeasonedInput.vue";
  import SeasonedButton from "@/components/ui/SeasonedButton.vue";
  import SeasonedMessages from "@/components/ui/SeasonedMessages.vue";
  import type { Ref } from "vue";
  import { login } from "../api";
  import { focusFirstFormInput, focusOnNextElement } from "../utils";
  import { ErrorMessageTypes } from "../interfaces/IErrorMessage";
  import type { IErrorMessage } from "../interfaces/IErrorMessage";

  const username: Ref<string> = ref("");
  const password: Ref<string> = ref("");
  const messages: Ref<IErrorMessage[]> = ref([]);
  const formElement: Ref<HTMLFormElement> = ref(null);

  const store = useStore();
  const router = useRouter();

  onMounted(() => focusFirstFormInput(formElement.value));

  function clearMessages() {
    messages.value = [];
  }

  function addErrorMessage(message: string, title?: string) {
    messages.value.push({
      message,
      title,
      type: ErrorMessageTypes.Error
    });
  }

  function validate() {
    const errors = [];

    if (username.value.length === 0) {
      errors.push("Username must not be empty");
    }

    if (password.value.length === 0) {
      errors.push("Password must not be empty");
    }

    if (errors.length > 0) {
      errors.forEach(error => addErrorMessage(error, "Validation error"));
      return Promise.reject();
    }

    return Promise.resolve(true);
  }

  function signin() {
    return login(username.value, password.value)
      .then(response => {
        store.dispatch("user/login", response.user);
        router.push("/");
        return response;
      })
      .catch(error => {
        if (error.error === "Incorrect username or password.") {
          addErrorMessage(error.error, "Authentication failed");
          return null;
        }

        addErrorMessage(error?.message, "Unexpected error");
        return null;
      });
  }

  function submit() {
    clearMessages();
    validate().then(signin);
  }
</script>

<style lang="scss" scoped>
  @import "scss/shared-auth";

  .signin {
    // Password input uses monospace font
    :deep(input[type="password"]),
    :deep(input[type="text"][placeholder="Password"]) {
      font-family: "Courier New", monospace;
    }
  }
</style>
