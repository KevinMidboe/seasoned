import Vue from 'vue'
import Vuex from 'vuex'

import darkmodeModule from './modules/darkmodeModule'
import documentTitle from './modules/documentTitle'
import torrentModule from './modules/torrentModule'
import userModule from './modules/userModule'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    darkmodeModule,
    documentTitle,
    torrentModule,
    userModule
  }
})

export default store
