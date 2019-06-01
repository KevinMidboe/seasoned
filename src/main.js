import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import router from './routes'

import Toast from './plugins/Toast'
import DataTablee from 'vue-data-tablee'
import VModal from 'vue-js-modal'

import App from './App.vue'

window.eventHub = new Vue();

Vue.use(VueRouter)
Vue.use(Toast)
Vue.use(DataTablee)
Vue.use(VModal, { dialog: true })

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App />'
})
