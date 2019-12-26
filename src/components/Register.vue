<template>
  <section>
    <h1>Register new user</h1>

    <seasoned-input placeholder="username" icon="Email" type="username" :value.sync="username" />

    <seasoned-input placeholder="password" icon="Keyhole" type="password"
      :value.sync="password" @enter="requestNewUser"/>

    <seasoned-input placeholder="repeat password" icon="Keyhole" type="password"
      :value.sync="passwordRepeat" @enter="requestNewUser"/>

    <seasoned-button @click="requestNewUser">Register</seasoned-button>

    <router-link class="link" to="/signin">Have a user? Sign in here</router-link>
    <seasoned-messages :messages.sync="messages"></seasoned-messages>
  </section>
</template>

<script>
import { register } from '@/api'
import SeasonedButton from '@/components/ui/SeasonedButton'
import SeasonedInput from '@/components/ui/SeasonedInput'
import SeasonedMessages from '@/components/ui/SeasonedMessages'

export default {
  components: { SeasonedButton, SeasonedInput, SeasonedMessages },
  data() {
    return {
      messages: [],
      username: null,
      password: null,
      passwordRepeat: null
    }
  },
  methods: {
    requestNewUser(){
      let { username, password, passwordRepeat } = this

      let verifyCredentials = this.checkCredentials(username, password, passwordRepeat);

      if (verifyCredentials.verified) {

        register(username, password)
          .then(data => {
            if (data.success){
              localStorage.setItem('token', data.token);
              localStorage.setItem('username', username);
              localStorage.setItem('admin', data.admin)

              eventHub.$emit('setUserStatus');
              this.$router.push({ name: 'profile' })
            }
        })
        .catch(error => {
          this.messages.push({ type: 'error', title: 'Unexpected error', message: error.message })
        });
      } 
      else {
        this.messages.push({ type: 'warning', title: 'Parse error', message: verifyCredentials.reason })
      }
    },
    checkCredentials(username, password, passwordRepeat) {
      if (!username || username.length === 0) {
        return {
          verified: false,
          reason: 'Fill inn username'
        }
      } 
      else if (!password || !passwordRepeat) {
        return {
          verified: false,
          reason: "Fill inn both password fields"
        }
      }
      else if (password !== passwordRepeat) {
        return {
          verified: false,
          reason: 'Passwords do not match'
        }
      } 
      else {
        return {
          verified: true,
          reason: 'Verified credentials'
        }
      }
    },
    logOut(){
      localStorage.clear();
      eventHub.$emit('setUserStatus');
      this.$router.push({ name: 'home' });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./src/scss/variables";

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
