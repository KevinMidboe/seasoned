<template>
  <section>
    <h1>Sign in</h1>

    <seasoned-input placeholder="username"
                    icon="Email"
                    type="email"
                    @enter="submit"
                    :value.sync="username" />
    <seasoned-input placeholder="password" icon="Keyhole" type="password" :value.sync="password" @enter="submit"/>

    <seasoned-button @click="submit">sign in</seasoned-button>
    <router-link class="link" to="/register">Don't have a user? Register here</router-link>

    <seasoned-messages :messages.sync="messages"></seasoned-messages>
  </section>
</template>



<script>
import { login } from '@/api'
import storage from '../storage'
import SeasonedInput from '@/components/ui/SeasonedInput'
import SeasonedButton from '@/components/ui/SeasonedButton'
import SeasonedMessages from '@/components/ui/SeasonedMessages'
import { parseJwt } from '@/utils'

export default {
  components: { SeasonedInput, SeasonedButton, SeasonedMessages },
  data(){
    return{
      messages: [],
      username: null,
      password: null
    }
  },
  methods: {
    setValue(l, t) {
      this[l] = t
    },
    submit() {
      this.messages = [];
      let username = this.username;
      let password = this.password;

      if (username == null || username.length == 0) {
        this.messages.push({ type: 'error', title: 'Missing username' })
        return
      }

      if (password == null || password.length == 0) {
        this.messages.push({ type: 'error', title: 'Missing password' })
        return
      }

      this.signin(username, password)
    },
    signin(username, password) {
      login(username, password, true)
        .then(data => {
          if (data.success){
            const jwtData = parseJwt(data.token)
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', jwtData['username']);
            localStorage.setItem('admin', jwtData['admin'] || false);

            eventHub.$emit('setUserStatus');
            this.$router.push({ name: 'profile' })
          }
        })
        .catch(error => {
          if (error.status === 401) {
            this.messages.push({ type: 'error', title: 'Access denied', message: 'Incorrect username or password' })
          }
          else {
            this.messages.push({ type: 'error', title: 'Unexpected error', message: error.message })
          }
        });
    }
  },
  created(){
    document.title = 'Sign in' + storage.pageTitlePostfix;
    storage.backTitle = document.title;
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
