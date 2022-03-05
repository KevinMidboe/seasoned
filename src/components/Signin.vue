<template>
  <section>
    <h1>Sign in</h1>

    <div class="form">
      <seasoned-input
        ref="username"
        placeholder="username"
        icon="Email"
        type="email"
        @enter="submit"
        :value.sync="username"
      />
      <seasoned-input
        placeholder="password"
        icon="Keyhole"
        type="password"
        :value.sync="password"
        @enter="submit"
      />

      <seasoned-button @click="submit">sign in</seasoned-button>
    </div>
    <router-link class="link" to="/register"
      >Don't have a user? Register here</router-link
    >

    <seasoned-messages :messages.sync="messages"></seasoned-messages>
  </section>
</template>

<script>
import { mapActions } from "vuex";
import { login } from "@/api";
import storage from "../storage";
import SeasonedInput from "@/components/ui/SeasonedInput";
import SeasonedButton from "@/components/ui/SeasonedButton";
import SeasonedMessages from "@/components/ui/SeasonedMessages";

export default {
  components: { SeasonedInput, SeasonedButton, SeasonedMessages },
  data() {
    return {
      messages: [],
      username: null,
      password: null
    };
  },
  methods: {
    ...mapActions("user", ["login"]),
    submit() {
      this.messages = [];
      let { username, password } = this;

      if (!username || username.length == 0) {
        this.messages.push({ type: "error", title: "Missing username" });
        return;
      }

      if (!password || password.length == 0) {
        this.messages.push({ type: "error", title: "Missing password" });
        return;
      }

      this.signin(username, password);
    },
    signin(username, password) {
      login(username, password, true)
        .then(data => {
          if (data.success && this.login()) {
            this.$router.push({ name: "profile" });
          }
        })
        .catch(error => {
          if (error.status === 401) {
            this.messages.push({
              type: "error",
              title: "Access denied",
              message: "Incorrect username or password"
            });
          } else {
            this.messages.push({
              type: "error",
              title: "Unexpected error",
              message: error.message
            });
          }
        });
    }
  },
  created() {
    document.title = "Sign in" + storage.pageTitlePostfix;
    storage.backTitle = document.title;
  },
  mounted() {
    try {
      this.$refs.username.$el.getElementsByTagName("input")[0].focus();
    } catch {}
  }
};
</script>

<style lang="scss" scoped>
@import "src/scss/variables";

section {
  padding: 1.3rem;

  @include tablet-min {
    padding: 4rem;
  }

  .form > div,
  input,
  button {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0px;
    }
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
