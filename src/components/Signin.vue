<template>
  <section>
    <h1>Sign in</h1>

    <seasoned-input text="username" icon="Email" type="username"
                    @inputValue="setValue('username', $event)" />
    <seasoned-input text="password" icon="Keyhole" type="password"
                    @inputValue="setValue('password', $event)" @enter="signin"/>

    <seasoned-button @click="signin">sign in</seasoned-button>

    <router-link class="link" to="/register">Don't have a user? Register here</router-link>
    <seasoned-messages :messages.sync="messages"></seasoned-messages>

  </section>
</template>



<script>
import axios from 'axios'
import storage from '../storage.js'
import SeasonedInput from '@/components/ui/SeasonedInput.vue'
import SeasonedButton from '@/components/ui/SeasonedButton.vue'
import SeasonedMessages from '@/components/ui/SeasonedMessages.vue'

export default {
  components: { SeasonedInput, SeasonedButton, SeasonedMessages },
  data(){
    return{
      messages: [],
      username: undefined,
      password: undefined
    }
  },
  methods: {
    setValue(l, t) {
      this[l] = t
    },
    signin(){
      let username = this.username;
      let password = this.password;

      axios.post(`https://api.kevinmidboe.com/api/v1/user/login`, {
        username: username,
        password: password
      })
      .then(resp => {
        let data = resp.data;
        if (data.success){
          localStorage.setItem('token', data.token);
          localStorage.setItem('username', username);
          localStorage.setItem('admin', data.admin);
          
          eventHub.$emit('setUserStatus');
          this.$router.push({ name: 'profile' })
        }
      })
      .catch(error => {
        if (error.message.endsWith('401')) {
          this.messages.push({ type: 'warning', title: 'Access denied', message: 'Incorrect username or password' })
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
