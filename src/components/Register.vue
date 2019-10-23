<template>
  <section class="profile">
    <div class="profile__content">
      <header class="profile__header">
        <h2 class="profile__title">Register new user</h2>
      </header>

      <form class="form">
        <div class="form__buffer"></div>

        <div class="center">
          <div class="form__group">
            <svg class="form__group__input-icon">
              <use xlink:href="#iconEmail"></use>
            </svg>
            <input class="form__group-input" type="username" ref="username" placeholder="Username" >
          </div>
          <div class="form__group">
            <svg class="form__group__input-icon">
              <use xlink:href="#iconKeyhole"></use>
            </svg>
            <input class="form__group-input" type="password" ref="password" placeholder="Password">
          </div>
          <div class="form__group">
            <svg class="form__group__input-icon">
              <use xlink:href="#iconKeyhole"></use>
            </svg>
            <input class="form__group-input" type="password" ref="password_re" placeholder="Repeat password">
          </div>

          <transition name="message-fade">
            <div class="message" :class="messageClass" v-if="showMessage">
              <span class="message-text">{{ messageText }}</span>
              <span class="message-dismiss" v-on:click="dismissMessage">X</span>
            </div>
          </transition>

          <div class="form__group">
            <button type="button" class="button" v-on:click="requestNewUser">Register</button>
          </div>
        </div>
      </form>
      
      <div class="form__group">
        <router-link class="form__group-link" :to="{name: 'signin'}" exact title="Sign in here">
          <span class="form__group-signin">Sign in here</span>
        </router-link>
      </div>

      <!-- <created-lists></created-lists> -->
    </div>
    <section class="not-found" v-if="userLoggedIn === false">
      <div class="not-found__content">
        <h2 class="not-found__title">Authentication Request Failed</h2>
        <button class="not-found__button button" @click="requestToken">Log In</button>
      </div>
    </section>
  </section>
</template>

<script>
import axios from 'axios'
import storage from '../storage.js'
import MoviesList from './MoviesList.vue'
// import CreatedLists from './CreatedLists.vue'

export default {
  components: { MoviesList },
  data(){
    return{
      userLoggedIn: '',
      userName: '',
      showMessage: false,
      messageClass: 'message-success',
      messageText: 'hello world'
    }
  },
  methods: {
    requestNewUser(){
      let username = this.$refs.username.value;
      let password = this.$refs.password.value;
      let password_re = this.$refs.password_re.value;

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
    logOut(){
      localStorage.clear();
      eventHub.$emit('setUserStatus');
      this.$router.push({ name: 'home' });
    }
  },
  created(){
    document.title = 'Profile' + storage.pageTitlePostfix;
    storage.backTitle = document.title;
  },
  mounted(){
    // this.$refs.email.focus();
  }
}
</script>

<style lang="scss">
@import "./src/scss/variables";
@import "./src/scss/media-queries";
.message-enter-active {
  transition: all .3s ease;
}
.message-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.message-fade-enter, .message-fade-leave-to {
  opacity: 0;
}
.message{
  width: 75%;
  max-width: 35rem;
  margin: 0 auto;
  margin-bottom: 1rem;
  padding: 12px 15px 12px 15px;
  position: relative;
  &-text{
    font-weight: 300;
  }
  &-dismiss{
    position: absolute;
    font-size: 17px;
    font-weight: 100;
    top: 0;
    right: 0;
    margin-top: 2px;
    margin-right: 5px;
    cursor: pointer;
  }
}

.message-warning{
  background-color: #f2dede;
  border: 1px solid #b75b91;
  color: #b75b91;
}
.message-success{
  background-color: #dff0d9;
  border: 1px solid #3e7549;
  color: #3e7549;
}

.center {
  justify-content: center;
}
.form{
  z-index: 15;
  background-color: $c-light;
  display: flex;
  flex-direction: column;
  @include tablet-min{
  }
  &__buffer{
    width: 100%;
    height: 4rem;
  }
  &__group{
    display: flex;
    justify-content: center;
    @include tablet-min{
    }
    &-input{
      width: 75%;
      max-width: 35rem;
      padding: 15px 10px 15px 45px;
      outline: none;
      background-color: $c-white;
      color: $c-dark;
      font-weight: 100;
      font-size: 20px;
      border: 1px solid $c-dark;
      margin-left: -2.2rem;
      z-index: 3;
      &:focus, &:hover {
        border-color: $c-dark;
      }
    }
    &-input[type="username"] {
      margin-bottom: 3rem;
    }
    &__input-icon{
      width: 24px;
      height: 24px;
      fill: rgba($c-dark, 0.5);
      transition: fill 0.5s ease;
      pointer-events: none;
      margin-top: 15px;
      margin-left: 15px;
      z-index: 8;
    }
    &-link{
      text-decoration: none;
      color: black;
      margin-top: 1rem;
    }
    &-signin{
      text-transform: uppercase;
      font-weight: 300;
      font-size: 11px;
      line-height: 2;
      letter-spacing: 0.5px;
    }
  }
}

</style>
