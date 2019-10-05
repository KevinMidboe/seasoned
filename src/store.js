import Vue from 'vue'
import Vuex from 'vuex'

import torrentModule from './modules/torrentModule.js'
import darkmodeModule from './modules/darkmodeModule.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    torrentModule,
    darkmodeModule
  }
})

export default store
