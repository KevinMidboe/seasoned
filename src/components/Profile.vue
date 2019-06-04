<template>
  <section class="profile">
    <div class="profile__content" v-if="userLoggedIn">
      <header class="profile__header">
        <h2 class="profile__title">{{ emoji }} Welcome {{ userName }}</h2>
        
        <div class="button--group">
          <seasoned-button @click="showSettings = !showSettings">{{ showSettings ? 'hide settings' : 'show settings' }}</seasoned-button>

          <seasoned-button @click="logOut">Log out</seasoned-button>
        </div>
      </header>
      <settings v-if="showSettings"></settings>

      <movies-list :propList="user_requestsList"></movies-list>

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
import MoviesList from '@/components/MoviesList.vue'
import Settings from '@/components/Settings.vue'
import SeasonedButton from '@/components/ui/SeasonedButton.vue'

import { getEmoji } from '@/api.js'
// import CreatedLists from './CreatedLists.vue'

export default {
  components: { MoviesList, Settings, SeasonedButton },
  data(){
    return{
      userLoggedIn: '',
      userName: '',
      emoji: '',
      showSettings: false,
      user_requestsList: storage.user_requestsList
    }
  },
  methods: {
    createSession(token){
      axios.get(`https://api.themoviedb.org/3/authentication/session/new?api_key=${storage.apiKey}&request_token=${token}`)
      .then(function(resp){
          let data = resp.data;
          if(data.success){
            let id = data.session_id;
            localStorage.setItem('session_id', id);
            eventHub.$emit('setUserStatus');
            this.userLoggedIn = true;
            this.getUserInfo();
          }
      }.bind(this));
    },
    getUserInfo(){
      this.userName = localStorage.getItem('username'); 
    },
    toggleSettings() {
      this.showSettings = this.showSettings ? false : true;
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
    if(!localStorage.getItem('token')){
      this.userLoggedIn = false;
    } else {
      this.userLoggedIn = true;
      this.getUserInfo();

      getEmoji()
        .then(resp => this.emoji = resp.data.emoji )
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./src/scss/variables";
@import "./src/scss/media-queries";

// DUPLICATE CODE
.profile{
  &__header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid rgba($c-dark, 0.05);
    @include tablet-min{
      padding: 29px 30px;
    }
    @include tablet-landscape-min{
      padding: 29px 50px;
    }
    @include desktop-min{
      padding: 29px 60px;
    }
  }
  &__title{
    margin: 0;
    font-size: 16px;
    line-height: 16px;
    color: $c-dark;
    font-weight: 300;
    @include tablet-min{
      font-size: 18px;
      line-height: 18px;
    }
  }
}
</style>
