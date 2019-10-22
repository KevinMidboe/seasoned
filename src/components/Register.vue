<template>
  <section>
    <h1>Register new user</h1>

    <seasoned-input text="username" icon="Email" type="username"
                    @inputValue="setValue('username', $event)" />
    <seasoned-input text="password" icon="Keyhole" type="password"
                    @inputValue="setValue('password', $event)" @enter="requestNewUser"/>
    <seasoned-input text="repeat password" icon="Keyhole" type="password"
                    @inputValue="setValue('password', $event)" @enter="requestNewUser"/>

    <seasoned-button @click="requestNewUser">Register</seasoned-button>

    <router-link class="link" to="/signin">Have a user? Sign in here</router-link>
    <seasoned-messages :messages.sync="messages"></seasoned-messages>
  </section>
</template>

<script>
import axios from 'axios'
import storage from '@/storage.js'
import SeasonedButton from '@/components/ui/SeasonedButton.vue'
import SeasonedInput from '@/components/ui/SeasonedInput.vue'
import SeasonedMessages from '@/components/ui/SeasonedMessages.vue'

export default {
  components: { SeasonedButton, SeasonedInput, SeasonedMessages },
  data(){
    return{
      messages: [],
      username: undefined,
      password: undefined,
      passwordRepeat: undefined
    }
  },
  methods: {
    requestNewUser(){
      let username = this.username
      let password = this.password
      let password_re = this.passwordRepeat

      let verifyCredentials = this.checkCredentials(username, password, password_re);
      
      if (verifyCredentials.verified) {
        axios.post(`https://api.kevinmidboe.com/api/v1/user`, {
          username: username,
          password: password
        })
        .then(resp => {
          let data = resp.data;
          if (data.success){
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username);
            localStorage.setItem('admin', data.admin)
            
            eventHub.$emit('setUserStatus');
            this.$router.push({ name: 'profile' })
          }
        })
        .catch(error => {
          this.messages.push({ type: 'error', title: 'Unexpected error', message: error.response.data.error })
        });
      } 
      else {
        this.messages.push({ type: 'warning', title: 'Parse error', message: verifyCredentials.reason })
      }
    },
    checkCredentials(username, password, password_re) {
      if (password !== password_re) {
        return {
          verified: false,
          reason: 'Passwords do not match'
        }
      } 
      else if (username === undefined) {
        return {
          verified: false,
          reason: 'Please insert username'
        }
      } 
      else {
        return {
          verified: true,
          reason: 'Verified credentials'
        }
      }
    },
    setValue(l, t) {
      this[l] = t
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
