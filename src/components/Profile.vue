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

      <list-header title="User requests" :info="resultCount"/>
      <results-list v-if="results" :results="results" />
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
import storage from '@/storage'
import store from '@/store'
import ListHeader from '@/components/ListHeader'
import ResultsList from '@/components/ResultsList'
import Settings from '@/components/Settings'
import SeasonedButton from '@/components/ui/SeasonedButton'

import { getEmoji, getUserRequests } from '@/api'

export default {
  components: { ListHeader, ResultsList, Settings, SeasonedButton },
  data(){
    return{
      userLoggedIn: '',
      userName: '',
      emoji: '',
      results: undefined,
      totalResults: undefined,
      showSettings: false
    }
  },
  computed: {
    resultCount() {
      if (this.results === undefined)
        return

      const loadedResults = this.results.length
      const totalResults = this.totalResults < 10000 ? this.totalResults : '∞'
      return `${loadedResults} of ${totalResults} results`
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
    if(!localStorage.getItem('token')){
      this.userLoggedIn = false;
    } else {
      this.userLoggedIn = true;
      this.getUserInfo();

      getUserRequests()
        .then(results => {
          this.results = results.results
          this.totalResults = results.total_results
        })

      getEmoji()
        .then(resp => {
          const { emoji } = resp
          this.emoji = emoji
          store.dispatch('documentTitle/updateEmoji', emoji)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./src/scss/variables";
@import "./src/scss/media-queries";

.button--group {
  display: flex;
}

// DUPLICATE CODE
.profile{
  &__header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid $text-color-5;

    @include mobile-only {
      flex-direction: column;
      align-items: flex-start;

      .button--group {
        padding-top: 2rem;
      }
    }

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
    color: $text-color;
    font-weight: 300;
    @include tablet-min{
      font-size: 18px;
      line-height: 18px;
    }
  }
}
</style>
