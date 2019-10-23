<template>
  <section class="profile">
    <div class="profile__content">
      <header class="profile__header">
        <h2 class="profile__title">Register new user</h2>
      </header>

      <form class="form">
        <div class="form__buffer"></div>
        <div>
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
            <input class="form__group-input" type="password" ref="password" placeholder="Password" v-on:keyup.enter="signin">
          </div>
          
          <transition name="message-fade">
              <div class="message" :class="messageClass" v-if="showMessage">
                <span class="message-text">{{ messageText }}</span>
                <span class="message-dismiss" @click="showMessage=false">X</span>
              </div>
            </transition>
          
          <div class="form__group">
            <button type="button" class="button" v-on:click="signin">Sign in</button>
          </div>
        </div>
      </form>
      
      <div class="form__group">
        <router-link class="form__group-link" :to="{name: 'register'}" exact title="Sign in here">
          <span class="form__group-signin">Don't have a user? Register here</span>
        </router-link>
      </div>

      <!-- <created-lists></created-lists> -->
    </div>
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
    signin(){
      let username = this.$refs.username.value;
      let password = this.$refs.password.value;

      axios.post(`https://api.kevinmidboe.com/api/v1/user/login`, {
        username: username,
        password: password
      })
      .then(function (resp){
        let data = resp.data;
        if (data.success){
          localStorage.setItem('token', data.token);
          localStorage.setItem('username', username);
          localStorage.setItem('admin', data.admin);
          this.userLoggedIn = true;
          
          eventHub.$emit('setUserStatus');
          this.$router.push({ name: 'profile' })
        }
      }.bind(this))
      .catch(function (error){
        if (error.message.endsWith('401'))
          this.msg('Incorrect username or password ', 'warning')
        else
          this.msg(error.message, 'warning')
      }.bind(this));
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
    toggleView(){
      this.register = false;
    },
  },
  created(){
    document.title = 'Sign in' + storage.pageTitlePostfix;
    storage.backTitle = document.title;
    if (this.userLoggedIn == true) {
      this.$router.push({ name: 'profile' })
    }
  },
  mounted(){
    // this.$refs.email.focus();
  }
}
</script>

<style lang="scss">
</style>
