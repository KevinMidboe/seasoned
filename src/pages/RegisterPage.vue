<template>
  <div class="register auth-page">
    <div class="auth-content auth-content--wide">
      <div class="auth-header">
        <h1 class="auth-title">Register new user</h1>
        <p class="auth-subtitle">Create an account to get started</p>
      </div>

      <form ref="formElement" class="auth-form" @submit.prevent>
        <seasoned-input
          v-model="username"
          placeholder="Email address"
          icon="Email"
          type="email"
          @keydown.enter="focusOnNextElement"
        />

        <div class="register__password-section">
          <div class="password-generator">
            <button
              type="button"
              class="generator-toggle"
              @click="toggleGenerator"
            >
              <IconKey class="toggle-icon" />
              <span>{{
                showGenerator
                  ? "Hide Password Generator"
                  : "Generate Strong Password"
              }}</span>
            </button>
            <div v-if="showGenerator" class="generator-content">
              <password-generator
                @password-generated="handlePasswordGenerated"
              />
            </div>
          </div>

          <seasoned-input
            v-model="password"
            placeholder="Password"
            icon="Keyhole"
            type="password"
            class="password-input"
            @keydown.enter="focusOnNextElement"
          />

          <seasoned-input
            v-model="passwordRepeat"
            placeholder="Confirm password"
            icon="Keyhole"
            type="password"
            class="password-input"
            @keydown.enter="submit"
          />
        </div>

        <div v-if="password.length > 0" class="register__password-requirements">
          <p class="requirements-title">Password must contain:</p>
          <div class="requirements-grid">
            <div class="requirement" :class="{ met: password.length >= 8 }">
              <span class="requirement-icon">{{
                password.length >= 8 ? "✓" : "✗"
              }}</span>
              <span class="requirement-text">At least 8 characters</span>
            </div>
            <div class="requirement" :class="{ met: /[A-Z]/.test(password) }">
              <span class="requirement-icon">{{
                /[A-Z]/.test(password) ? "✓" : "✗"
              }}</span>
              <span class="requirement-text">One uppercase letter</span>
            </div>
            <div class="requirement" :class="{ met: /[a-z]/.test(password) }">
              <span class="requirement-icon">{{
                /[a-z]/.test(password) ? "✓" : "✗"
              }}</span>
              <span class="requirement-text">One lowercase letter</span>
            </div>
            <div class="requirement" :class="{ met: /[0-9]/.test(password) }">
              <span class="requirement-icon">{{
                /[0-9]/.test(password) ? "✓" : "✗"
              }}</span>
              <span class="requirement-text">One number</span>
            </div>
          </div>
        </div>

        <seasoned-button class="auth-button" @click="submit">
          Create Account
        </seasoned-button>
      </form>

      <div class="auth-footer">
        <p class="auth-footer-text">
          Already have an account?
          <router-link class="auth-link" to="/login">
            Sign in here
          </router-link>
        </p>
      </div>

      <seasoned-messages v-model:messages="messages"></seasoned-messages>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useStore } from "vuex";
  import { useRouter } from "vue-router";
  import SeasonedButton from "@/components/ui/SeasonedButton.vue";
  import SeasonedInput from "@/components/ui/SeasonedInput.vue";
  import SeasonedMessages from "@/components/ui/SeasonedMessages.vue";
  import PasswordGenerator from "@/components/settings/PasswordGenerator.vue";
  import IconKey from "@/icons/IconKey.vue";
  import type { Ref } from "vue";
  import { register } from "../api";
  import { focusFirstFormInput, focusOnNextElement } from "../utils";
  import { ErrorMessageTypes } from "../interfaces/IErrorMessage";
  import type { IErrorMessage } from "../interfaces/IErrorMessage";

  const username: Ref<string> = ref("");
  const password: Ref<string> = ref("");
  const passwordRepeat: Ref<string> = ref("");
  const messages: Ref<IErrorMessage[]> = ref([]);
  const formElement: Ref<HTMLFormElement> = ref(null);
  const showGenerator = ref(false);

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

  function addSuccessMessage(message: string, title?: string) {
    messages.value.push({
      message,
      title,
      type: ErrorMessageTypes.Success
    });
  }

  function validate() {
    const errors = [];

    if (username.value.length === 0) {
      errors.push("Email must not be empty");
    }

    if (password.value.length === 0) {
      errors.push("Password must not be empty");
    }

    if (password.value.length < 8) {
      errors.push("Password must be at least 8 characters");
    }

    if (!/[A-Z]/.test(password.value)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password.value)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/[0-9]/.test(password.value)) {
      errors.push("Password must contain at least one number");
    }

    if (password.value !== passwordRepeat.value) {
      errors.push("Passwords do not match");
    }

    if (errors.length > 0) {
      errors.forEach(error => addErrorMessage(error, "Validation error"));
      return Promise.reject();
    }

    return Promise.resolve(true);
  }

  function createUser() {
    return register(username.value, password.value)
      .then(response => {
        addSuccessMessage(
          "Account created successfully! Redirecting to login...",
          "Success"
        );
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        return response;
      })
      .catch(error => {
        addErrorMessage(error?.message || "Registration failed", "Error");
        return null;
      });
  }

  function submit() {
    clearMessages();
    validate().then(createUser);
  }

  function handlePasswordGenerated(generatedPassword: string) {
    password.value = generatedPassword;
    passwordRepeat.value = generatedPassword;
  }

  function toggleGenerator() {
    showGenerator.value = !showGenerator.value;
  }
</script>

<style lang="scss" scoped>
  @import "scss/shared-auth";

  .register {
    // Password inputs use monospace font
    :deep(.password-input input[type="password"]),
    :deep(.password-input input[type="text"]) {
      font-family: "Courier New", monospace;
    }
  }

  .register__password-section {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .password-generator {
    .generator-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.875rem 1rem;
      background: var(--background-ui);
      border: 1px solid var(--text-color-10);
      border-radius: 8px;
      color: var(--text-color);
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: var(--background-color-secondary);
        border-color: var(--text-color-20);
      }

      .toggle-icon {
        width: 18px;
        height: 18px;
        color: var(--highlight-color);
      }
    }

    .generator-content {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--text-color-10);
    }
  }

  .register__password-requirements {
    background: var(--background-ui);
    border: 1px solid var(--text-color-10);
    border-radius: 8px;
    padding: 1.25rem;
    margin-top: -0.25rem;

    .requirements-title {
      margin: 0 0 1rem 0;
      font-size: 0.95rem;
      font-weight: 500;
      color: $text-color;
    }

    .requirements-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;

      @include mobile-only {
        grid-template-columns: 1fr;
      }
    }

    .requirement {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: var(--text-color-60);

      &-icon {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: var(--text-color-10);
        font-size: 0.75rem;
        font-weight: bold;
        color: var(--text-color-60);
      }

      &-text {
        line-height: 1.3;
      }

      &.met {
        color: var(--success-color, #51cf66);

        .requirement-icon {
          background: var(--success-color, #51cf66);
          color: white;
        }
      }
    }
  }
</style>
