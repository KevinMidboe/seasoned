import Vue from 'vue'
import Vuex from 'vuex'

import torrentModule from './modules/torrentModule.js'
import darkmodeModule from './modules/darkmodeModule.js'
import documentTitle from './modules/documentTitle.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    torrentModule,
    darkmodeModule,
    documentTitle
  }
})

export default store
