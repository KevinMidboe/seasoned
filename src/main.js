import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import router from './routes'
import store from './store'

import Toast from './plugins/Toast'
import DataTablee from 'vue-data-tablee'
import VModal from 'vue-js-modal'

import App from './App.vue'

window.eventHub = new Vue();

Vue.use(VueRouter)
Vue.use(Toast)
Vue.use(DataTablee)
Vue.use(VModal, { dialog: true })

store.dispatch('darkmodeModule/findAndSetDarkmodeSupported')

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App />'
})
