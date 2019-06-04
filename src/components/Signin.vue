<template>
  <section class="profile">
    <div class="profile__content">
      <h2 class='settings__header'>Sign in</h2>

      <form class="form">
        <div class="form__buffer"></div>

          <seasoned-input text="username" icon="Email" type="username"
                          @inputValue="setValue('username', $event)" />
          <seasoned-input text="username" icon="Keyhole" type="password"
                          @inputValue="setValue('password', $event)" />

          <seasoned-button @click="signin">sign in</seasoned-button>
          
          <transition name="message-fade">
              <div class="message" :class="messageClass" v-if="showMessage">
                <span class="message-text">{{ messageText }}</span>
                <span class="message-dismiss" @click="showMessage=false">X</span>
              </div>
            </transition>
      </form>
      
      <div class="form__group">
        <router-link class="form__group-link" :to="{name: 'register'}" exact title="Sign in here">
          <span class="form__group-signin">Don't have a user? Register here</span>
        </router-link>
      </div>

    </div>
  </section>
</template>

<script>
import axios from 'axios'
import storage from '../storage.js'
import SeasonedInput from '@/components/ui/SeasonedInput.vue'
import SeasonedButton from '@/components/ui/SeasonedButton.vue'

export default {
  components: { SeasonedInput, SeasonedButton },
  data(){
    return{
      userLoggedIn: '',
      showMessage: false,
      messageClass: 'message-success',
      messageText: 'hello world',
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

<style lang="scss" scoped>
@import "./src/scss/variables";
@import "./src/scss/message";

// DUPLICATE CODE
.settings {
  padding: 35px;

  &__header {
    margin: 0;
    line-height: 16px;
    color: $c-dark;
    font-weight: 300;
    margin-bottom: 20px;
    text-transform: uppercase;
  }
}
.profile__content {
  padding: 35px;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.form {
  > div:last-child {
    margin-top: 1rem;
  }

  &__group{
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
        // @include desktop-min {
        //    width: 400px;
        // }
     }
  }
}
</style>
