<template>
  <section class="profile">
    <div class="profile__content">
      <h2 class='settings__header'>Register new user</h2>

      <form class="form">
        <seasoned-input text="username" icon="Email"
                        @inputValue="setValue('username', $event)"></seasoned-input>
        <seasoned-input text="password" icon="Keyhole" type="password"
                        @inputValue="setValue('password', $event)"></seasoned-input>
        <seasoned-input text="repeat password" icon="Keyhole" type="password"
                        @inputValue="setValue('passwordRepeat', $event)"></seasoned-input>

        <transition name="message-fade">
          <div class="message" :class="messageClass" v-if="showMessage">
            <span class="message-text">{{ messageText }}</span>
            <span class="message-dismiss" v-on:click="dismissMessage">X</span>
          </div>
        </transition>

        <div class="form__group">
          <seasoned-button @click="requestNewUser">Register</seasoned-button>
        </div>
      </form>
      
      <div class="form__group">
        <router-link class="form__group-link" :to="{name: 'signin'}" exact title="Sign in here">
          <span class="form__group-signin">Sign in here</span>
        </router-link>
      </div>

    </div>
    <section class="not-found" v-if="userLoggedIn === false">
      <div class="not-found__content">
        <h2 class="not-found__title">Authentication Request Failed</h2>
        <button class="not-found__button button">Log In</button>
      </div>
    </section>
  </section>
</template>

<script>
import axios from 'axios'
import storage from '@/storage.js'
import SeasonedButton from '@/components/ui/SeasonedButton.vue'
import SeasonedInput from '@/components/ui/SeasonedInput.vue'

export default {
  components: { SeasonedButton, SeasonedInput },
  data(){
    return{
      userLoggedIn: '',
      username: undefined,
      password: undefined,
      passwordRepeat: undefined,
      showMessage: false,
      messageClass: 'message-success',
      messageText: 'hello world'
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
        .then(function(resp) {
          let data = resp.data;
          if (data.success){
            this.msg(data.message, 'success');
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username);
            localStorage.setItem('admin', data.admin)
            
            eventHub.$emit('setUserStatus');
            this.$router.push({ name: 'profile' })
          }
        }.bind(this))
        .catch(function(error){
          this.msg(error.response.data.error, 'warning')
        }.bind(this));
      } 
      else {
        this.msg(verifyCredentials.reason, 'warning');
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
    msg(text, status){
      if (status === 'warning')
        this.messageClass = 'message-warning';
      else if (status === 'success')
        this.messageClass = 'message-success';
      else
        this.messageClass = 'message-info';
      this.messageText = text;
      this.showMessage = true;
      // setTimeout(() => this.showMessage = false, 3500);
    },
    dismissMessage(){
      this.showMessage = false;
    },
    setValue(l, t) {
      this[l] = t
    },
    logOut(){
      localStorage.clear();
      eventHub.$emit('setUserStatus');
      this.$router.push({ name: 'home' });
    }
  },
  created(){
    document.title = 'Profile' + storage.pageTitlePostfix;
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
