<template>
  <div>
    <h3 class="settings__header">Plex account</h3>

    <div v-if="!plexId">
      <span class="info"
        >Sign in to your plex account to get information about recently added
        movies and to see your watch history</span
      >

      <form class="form">
        <seasoned-input
          placeholder="plex username"
          type="email"
          v-model="username"
        />
        <seasoned-input
          placeholder="plex password"
          type="password"
          v-model="password"
          @enter="authenticatePlex"
        >
        </seasoned-input>

        <seasoned-button @click="authenticatePlex"
          >link plex account</seasoned-button
        >
      </form>
    </div>

    <div v-else>
      <span class="info"
        >Awesome, your account is already authenticated with plex! Enjoy viewing
        your seasoned search history, plex watch history and real-time torrent
        download progress.</span
      >
      <seasoned-button @click="unauthenticatePlex"
        >un-link plex account</seasoned-button
      >
    </div>
    <seasoned-messages v-model:messages="messages" />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, defineEmits } from "vue";
  import { useStore } from "vuex";
  import seasonedInput from "@/components/ui/SeasonedInput.vue";
  import SeasonedButton from "@/components/ui/SeasonedButton.vue";
  import SeasonedMessages from "@/components/ui/SeasonedMessages.vue";
  import { linkPlexAccount, unlinkPlexAccount } from "../../api";
  import type { Ref, ComputedRef } from "vue";
  import type IErrorMessage from "../../interfaces/IErrorMessage";

  interface Emit {
    (e: "reload");
  }

  const username: Ref<string> = ref("");
  const password: Ref<string> = ref("");
  const messages: Ref<IErrorMessage[]> = ref([]);

  const store = useStore();
  const emit = defineEmits<Emit>();

  const loggedIn: ComputedRef<boolean> = computed(
    () => store.getters["user/loggedIn"]
  );
  const plexId: ComputedRef<boolean> = computed(
    () => store.getters["user/plexId"]
  );
  const settings: ComputedRef<boolean> = computed(
    () => store.getters["user/settings"]
  );

  async function authenticatePlex() {
    let username = this.plexUsername;
    let password = this.plexPassword;

    const { success, message } = await linkPlexAccount(
      username.value,
      password.value
    );

    if (success) {
      username.value = "";
      password.value = "";
      emit("reload");
    }

    messages.value.push({
      type: success ? "success" : "error",
      title: success ? "Authenticated with plex" : "Something went wrong",
      message: message
    });
  }

  async function unauthenticatePlex() {
    const response = await unlinkPlexAccount();

    if (response?.success) {
      emit("reload");
    }

    messages.value.push({
      type: response.success ? "success" : "error",
      title: response.success
        ? "Unlinked plex account "
        : "Something went wrong",
      message: response.message
    });
  }
</script>

<style lang="scss" scoped>
  .info {
    display: block;
    margin-bottom: 25px;
  }
</style>
