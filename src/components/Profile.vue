<template>
  <section class="profile">
    <div class="profile__content" v-if="userLoggedIn">
      <header class="profile__header">
        <h2 class="profile__title">{{ emoji }} Welcome {{ userName }}</h2>
        
        <div>
           <router-link class="" :to="{name: 'settings'}">
          </router-link>
            <button v-if="showSettings" class="button__active" @click="toggleSettings" style="margin-right: 2em;">Hide settings</button>
            <button v-else class="button" @click="toggleSettings" style="margin-right: 2em;">Show settings</button>
          <button class="button" @click="logOut">Log Out</button>
        </div>
      </header>
      <settings v-if="showSettings"></settings>

      <movies-list v-for="item in listTypes" v-if="!showSettings && item.isProfileContent" :type="'component'" :mode="item.type" :category="item.query" :shortList="true"></movies-list>
      <!-- <movies-list v-for="item in listTypes" v-if="item.isCategory" :type="'component'" :mode="item.type" :shortList="true"></movies-list> -->
      <!-- <created-lists></created-lists> -->
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
import storage from '../storage.js'
import MoviesList from './MoviesList.vue'
import Settings from './Settings.vue'
import SeasonedButton from '@/components/ui/SeasonedButton.vue'

import { getEmoji } from '@/seasonedAPI.js'
// import CreatedLists from './CreatedLists.vue'

export default {
  components: { MoviesList, Settings },
  data(){
    return{
      userLoggedIn: '',
      userName: '',
      emoji: '',
      showSettings: false,
      listTypes: storage.listTypes
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

<style lang="scss">
@import "./src/scss/variables";
@import "./src/scss/media-queries";
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
