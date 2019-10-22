import Vue from 'vue'
import Vuex from 'vuex'

import torrentModule from './modules/torrentModule'
import darkmodeModule from './modules/darkmodeModule'
import documentTitle from './modules/documentTitle'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    torrentModule,
    darkmodeModule,
    documentTitle
  }
})

export default store
