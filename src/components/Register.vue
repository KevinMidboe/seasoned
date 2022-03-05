<template>
  <section>
    <h1>Register new user</h1>

    <div class="form">
      <seasoned-input
        placeholder="username"
        icon="Email"
        type="email"
        :value.sync="username"
        @enter="submit"
      />

      <seasoned-input
        placeholder="password"
        icon="Keyhole"
        type="password"
        :value.sync="password"
        @enter="submit"
      />
      <seasoned-input
        placeholder="repeat password"
        icon="Keyhole"
        type="password"
        :value.sync="passwordRepeat"
        @enter="submit"
      />

      <seasoned-button @click="submit">Register</seasoned-button>
    </div>

    <router-link class="link" to="/signin"
      >Have a user? Sign in here</router-link
    >

    <seasoned-messages :messages.sync="messages"></seasoned-messages>
  </section>
</template>

<script>
import { mapActions } from "vuex";
import { register } from "@/api";
import SeasonedButton from "@/components/ui/SeasonedButton";
import SeasonedInput from "@/components/ui/SeasonedInput";
import SeasonedMessages from "@/components/ui/SeasonedMessages";

export default {
  components: { SeasonedButton, SeasonedInput, SeasonedMessages },
  data() {
    return {
      messages: [],
      username: null,
      password: null,
      passwordRepeat: null
    };
  },
  methods: {
    ...mapActions("user", ["login"]),
    submit() {
      this.messages = [];
      let { username, password, passwordRepeat } = this;

      if (username == null || username.length == 0) {
        this.messages.push({ type: "error", title: "Missing username" });
        return;
      } else if (password == null || password.length == 0) {
        this.messages.push({ type: "error", title: "Missing password" });
        return;
      } else if (passwordRepeat == null || passwordRepeat.length == 0) {
        this.messages.push({ type: "error", title: "Missing repeat password" });
        return;
      } else if (passwordRepeat != password) {
        this.messages.push({ type: "error", title: "Passwords do not match" });
        return;
      }

      this.registerUser(username, password);
    },
    registerUser(username, password) {
      register(username, password, true)
        .then(data => {
          if (data.success && this.login()) {
            eventHub.$emit("setUserStatus");
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
