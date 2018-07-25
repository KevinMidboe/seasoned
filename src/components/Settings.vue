<template>
  <section class="profile">
   <demo-login-modal/>
    <div class="profile__content" v-if="userLoggedIn">
      <section class='settings'>
         <h3 class='settings__header'>Plex account</h3>
         <span class="settings__info">Sign in to your plex account to get information about recently added movies and to see your watch history</span>
         
         <form class="form">
            <div class="form__group">
               <svg class="form__group__input-icon"><use xlink:href="#iconEmail"></use></svg>
               <input class="form__group-input" type="text" ref="plex_username" placeholder="Plex username"/>
            </div>
            <div class="form__group">
               <svg class="form__group__input-icon"><use xlink:href="#iconKeyhole"></use></svg>
               <input class="form__group-input" type="password" ref="plex_password" placeholder="Repeat new password">
            </div>
         </form>
         <div class="plex">
            <button type="button" class="button" @click="authenticatePlex">Link plex account</button>
         </div>

         <hr class='setting__divider'>

         <h3 class='settings__header'>Change password</h3>
         <form class="form">
            <div class="form__group">
               <svg class="form__group__input-icon"><use xlink:href="#iconKeyhole"></use></svg>
               <input class="form__group-input" type="password" ref="password" placeholder="New password"/>
            </div>
            <div class="form__group">
               <svg class="form__group__input-icon"><use xlink:href="#iconKeyhole"></use></svg>
               <input class="form__group-input" type="password" ref="password_re" placeholder="Repeat new password">
            </div>
            <div class="form__group">
               <button type="button" class="button" @click="$modal.show('demo-login')">Change password</button>
            </div>
         </form>
         <hr class='setting__divider'>
      </section>
    </div>
    <section class="not-found" v-if="!userLoggedIn">
      <div class="not-found__content">
        <h2 class="not-found__title">Authentication Request Failed</h2>
        <router-link :to="{name: 'signin'}" exact title="Sign in here">
          <button class="not-found__button button">Sign In</button>
        </router-link>
      </div>
    </section>
  </section>
</template>

<script>
import axios from 'axios'
import storage from '../storage.js'
import DemoLoginModal from './demo.vue'
// import CreatedLists from './CreatedLists.vue'

export default {
  components: { DemoLoginModal },
  data(){
    return{
      userLoggedIn: '',
    }
  },
  methods: {
   authenticatePlex() {
      let username = this.$refs.plex_username.value;
      let password = this.$refs.plex_password.value;
      console.log(username, password)

      axios({
         method: 'POST',
         url: `https://plex.tv/users/sign_in.json?user[login]=${username}&user[password]=${password}`,
         headers: {
            'Content-Type': 'application/json',
            'X-Plex-Platform': 'Linux',
            'X-Plex-Version': 'v2.0.24',
            'X-Plex-Platform-Version': '4.13.0-36-generic',
            'X-Plex-Device-Name': 'Tautulli',
            'X-Plex-Client-Identifier': 'f9e0748ec84440dd8d0e759ab598326c'
         },
      })
      .then((resp) => {
         let data = resp.data;
         console.log('response from plex:', data.user)
      })
      .catch((error) => {
         console.log('error: ', error)
      })
   }
  },
  created(){
    document.title = 'Settings' + storage.pageTitlePostfix;
    storage.backTitle = document.title;
    if(!localStorage.getItem('token')){
      this.userLoggedIn = false;
    } else {
      this.userLoggedIn = true;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./src/scss/variables";
@import "./src/scss/media-queries";
a {
   text-decoration: none;
}
.plex {
   margin-top: 20px;
}
.form__group{
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
      @include desktop-min {
         width: 400px;
      }
   }
}
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
   &__info {
      display: block;
      margin-bottom: 25px;
   }
   hr {
      display: block;
      height: 1px;
      border: 0;
      border-bottom: 1px solid rgba(8, 28, 36, 0.05);
      margin-top: 30px;
      margin-bottom: 70px;
      margin-left: 20px;
      width: 96%;
      text-align: left;
   }
   span {
      font-weight: 200;
      size: 16px;
   }
}
</style>
