<template>
  <section>
    <h1>Sign in</h1>

    <form ref="formElement" class="form">
      <seasoned-input
        v-model="username"
        placeholder="username"
        icon="Email"
        type="email"
        @keydown.enter="focusOnNextElement"
      />
      <seasoned-input
        v-model="password"
        placeholder="password"
        icon="Keyhole"
        type="password"
        @keydown.enter="submit"
      />

      <seasoned-button @click="submit">sign in</seasoned-button>
    </form>
    <router-link class="link" to="/register"
      >Don't have a user? Register here</router-link
    >

    <seasoned-messages v-model:messages="messages" />
  </section>
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
    } as IErrorMessage);
  }

  function addWarningMessage(message: string, title?: string) {
    messages.value.push({
      message,
      title,
      type: ErrorMessageTypes.Warning
    } as IErrorMessage);
  }

  function validate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!username.value || username?.value?.length === 0) {
        addWarningMessage("Missing username", "Validation error");
        reject();
      }

      if (!password.value || password?.value?.length === 0) {
        addWarningMessage("Missing password", "Validation error");
        reject();
      }

      resolve(true);
    });
  }

  function signin() {
    login(username.value, password.value, true)
      .then(data => {
        if (data?.success && store.dispatch("user/login")) {
          router.push({ name: "profile" });
        }
      })
      .catch(error => {
        if (error?.status === 401) {
          addErrorMessage("Incorrect username or password", "Access denied");
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
  @import "scss/variables";

  section {
    padding: 1.3rem;

    @include tablet-min {
      padding: 4rem;
    }

    h1 {
      margin: 0;
      line-height: 16px;
      color: $text-color;
      font-weight: 300;
      margin-bottom: 20px;
      text-transform: uppercase;
    }

    .link {
      display: block;
      width: max-content;
      margin-top: 1rem;
    }
  }
</style>
