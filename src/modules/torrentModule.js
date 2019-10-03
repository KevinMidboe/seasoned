
export default {
  namespaced: true,
  state: {
    results: [],
    resultCount: null
  },
  getters: {
    results: (state) => {
      return state.results
    },
    resultCount: (state) => {
      return state.resultCount
    }
  },

  mutations: {
    SET_RESULTS: (state, results) => {
      state.results = results;
    },
    SET_RESULT_COUNT: (state, count) => {
      state.resultCount = count;
    },
    RESET: (state) => {
      state.results = []
      state.resultCount = null
    }
  },
  actions: {
    setResults({ commit }, results) {
      commit('SET_RESULTS', results)
    },
    setResultCount({ commit }, count) {
      commit('SET_RESULT_COUNT', count)
    },
    reset({ commit }) {
      commit('RESET')
    }
  }
}
