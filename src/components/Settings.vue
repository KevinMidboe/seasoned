<template>
  <section class="profile">
    <div class="profile__content" v-if="loggedIn">
      <section class="settings">
        <h3 class="settings__header">Plex account</h3>

        <div v-if="!plexId">
          <span class="settings__info"
            >Sign in to your plex account to get information about recently
            added movies and to see your watch history</span
          >

          <form class="form">
            <seasoned-input
              placeholder="plex username"
              icon="Email"
              :value.sync="plexUsername"
            />
            <seasoned-input
              placeholder="plex password"
              icon="Keyhole"
              type="password"
              :value.sync="plexPassword"
              @submit="authenticatePlex"
            />

            <seasoned-button @click="authenticatePlex"
              >link plex account</seasoned-button
            >
          </form>
        </div>
        <div v-else>
          <span class="settings__info"
            >Awesome, your account is already authenticated with plex! Enjoy
            viewing your seasoned search history, plex watch history and
            real-time torrent download progress.</span
          >
          <seasoned-button @click="unauthenticatePlex"
            >un-link plex account</seasoned-button
          >
        </div>
        <seasoned-messages :messages.sync="messages" />

        <hr class="setting__divider" />

        <h3 class="settings__header">Change password</h3>
        <form class="form">
          <seasoned-input
            placeholder="new password"
            icon="Keyhole"
            type="password"
            :value.sync="newPassword"
          />

          <seasoned-input
            placeholder="repeat new password"
            icon="Keyhole"
            type="password"
            :value.sync="newPasswordRepeat"
          />

          <seasoned-button @click="changePassword"
            >change password</seasoned-button
          >
        </form>

        <hr class="setting__divider" />
      </section>
    </div>

    <section class="not-found" v-else>
      <div class="not-found__content">
        <h2 class="not-found__title">Authentication Request Failed</h2>
        <router-link :to="{ name: 'signin' }" exact title="Sign in here">
          <button class="not-found__button button">Sign In</button>
        </router-link>
      </div>
    </section>
  </section>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import storage from "@/storage";
import SeasonedInput from "@/components/ui/SeasonedInput";
import SeasonedButton from "@/components/ui/SeasonedButton";
import SeasonedMessages from "@/components/ui/SeasonedMessages";

import { linkPlexAccount, unlinkPlexAccount, getSettings } from "@/api";

export default {
  components: { SeasonedInput, SeasonedButton, SeasonedMessages },
  data() {
    return {
      messages: [],
      plexUsername: null,
      plexPassword: null,
      newPassword: null,
      newPasswordRepeat: null,
      emoji: null
    };
  },
  computed: {
    ...mapGetters("user", ["loggedIn", "plexId", "settings"])
  },
  methods: {
    ...mapActions("user", ["login", "updateSettings"]),
    changePassword() {
      return;
    },
    created() {
      if (!this.settings) {
        console.log("settings does not exists.", this.settings);
        getSettings().then(resp => {
          const { settings } = resp;
          if (settings) updateSettings(settings);
        });
      }
    },
    async authenticatePlex() {
      let username = this.plexUsername;
      let password = this.plexPassword;

      const { success, message } = await linkPlexAccount(username, password);

      this.messages.push({
        type: success ? "success" : "error",
        title: success ? "Authenticated with plex" : "Something went wrong",
        message: message
      });
    },
    async unauthenticatePlex() {
      const response = await unlinkPlexAccount();

      this.messages.push({
        type: response.success ? "success" : "error",
        title: response.success
          ? "Unlinked plex account "
          : "Something went wrong",
        message: response.message
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./src/scss/variables";
@import "./src/scss/media-queries";

a {
  text-decoration: none;
}

// DUPLICATE CODE
.form {
  > div:last-child {
    margin-top: 1rem;
  }

  &__group {
    justify-content: unset;
    &__input-icon {
      margin-top: 8px;
      height: 22px;
      width: 22px;
    }
    &-input {
      padding: 10px 5px 10px 45px;
      height: 40px;
      font-size: 17px;
      width: 75%;
      @include desktop-min {
        width: 400px;
      }
    }
  }
}
.settings {
  padding: 3rem;

  @include mobile-only {
    padding: 1rem;
  }

  &__header {
    margin: 0;
    line-height: 16px;
    color: $text-color;
    font-weight: 300;
    margin-bottom: 20px;
    text-transform: uppercase;
  }
  &__info {
    display: block;
    margin-bottom: 25px;
  }
  hr {
    display: block;
    height: 1px;
    border: 0;
    border-bottom: 1px solid $text-color-50;
    margin-top: 30px;
    margin-bottom: 70px;
    margin-left: 20px;
    width: 96%;
    text-align: left;
  }
  span {
    font-weight: 200;
    size: 16px;
  }
}
</style>
