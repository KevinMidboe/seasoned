<template>
  <section class="profile">
    <div class="profile__content" v-if="userLoggedIn">
      <section class='settings'>
        <h3 class='settings__header'>Plex account</h3>
        <span class="settings__info">Sign in to your plex account to get information about recently added movies and to see your watch history</span>

        <form class="form">
          <seasoned-input text="plex username" icon="Email"
                          @inputValue="setValue('plexUsername', $event)"/>
          <seasoned-input text="plex password" icon="Keyhole" type="password"
                          @inputValue="setValue('plexPassword', $event)"/>

          <seasoned-button @click="authenticatePlex">link plex account</seasoned-button>
        </form>

        <hr class='setting__divider'>

        <h3 class='settings__header'>Change password</h3>
        <form class="form">
          <seasoned-input text="new password" icon="Keyhole" type="password"
                          @inputValue="setValue('newPass', $event)"/>
          <seasoned-input text="repeat new password" icon="Keyhole" type="password"
                          @inputValue="setValue('newPassConfirm', $event)"/>

          <seasoned-button @click="changePassword">change password</seasoned-button>
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
import storage from '@/storage.js'
import SeasonedInput from '@/components/ui/SeasonedInput.vue'
import SeasonedButton from '@/components/ui/SeasonedButton.vue'

import { plexAuthenticate } from '@/api.js'

export default {
  components: { SeasonedInput, SeasonedButton },
  data(){
    return{
      userLoggedIn: '',
      plexUsername: undefined,
      plexPassword: undefined,
      newPass: undefined,
      newPassConfirm: undefined
    }
  },
  methods: {
    setValue(l, t) {
      console.log('l, t', l, t)
      this[l] = t
    },
    changePassword() {
      return
    },
    authenticatePlex() {
      let username = this.plexUsername
      let password = this.plexPassword

      plexAuthenticate(username, password)
      .then((resp) => {
         let data = resp.data;
         console.log('response from plex:', data.user)
      })
      .catch((error) => {
         console.log('error: ', error)
      })
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
}
</script>

<style lang="scss" scoped>
@import "./src/scss/variables";
@import "./src/scss/media-queries";
a {
   text-decoration: none;
}

// DUPLICATE CODE
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
        @include desktop-min {
           width: 400px;
        }
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
