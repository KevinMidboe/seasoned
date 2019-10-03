import Vue from 'vue'
import Vuex from 'vuex'

import torrentModule from './modules/torrentModule.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    torrentModule
  }
})

export default store
