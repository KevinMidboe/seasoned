export default {
  namespaced: true,
  state: {
    darkmodeSupported: undefined,
    userChoice: undefined
  },
  getters: {
    darkmodeSupported: (state) => {
      return state.darkmodeSupported
    }
  },
  mutations: {
    SET_DARKMODE_SUPPORT: (state, browserSupported) => {
      state.darkmodeSupported = browserSupported
    }
  },
  actions: {
    findAndSetDarkmodeSupported({ commit }) {
      const browserSupported = window.matchMedia('(prefers-color-scheme)').media !== 'not all'
      commit('SET_DARKMODE_SUPPORT', browserSupported)
    }
  }
}
