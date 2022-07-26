import type ITorrent from "../interfaces/ITorrent";
import type IStateTorrent from "../interfaces/IStateTorrent";

const state: IStateTorrent = {
  results: [],
  resultCount: null
};

export default {
  namespaced: true,
  state: {
    results: [],
    resultCount: null
  },
  getters: {
    results: (state: IStateTorrent) => {
      return state.results;
    },
    resultCount: (state: IStateTorrent) => {
      return state.resultCount;
    }
  },

  mutations: {
    SET_RESULTS: (state: IStateTorrent, results: Array<ITorrent>) => {
      state.results = results;
    },
    SET_RESULT_COUNT: (state: IStateTorrent, count: number) => {
      state.resultCount = count;
    },
    RESET: (state: IStateTorrent) => {
      state.results = [];
      state.resultCount = null;
    }
  },
  actions: {
    setResults({ commit }, results: Array<ITorrent>) {
      commit("SET_RESULTS", results);
    },
    setResultCount({ commit }, count: number) {
      commit("SET_RESULT_COUNT", count);
    },
    reset({ commit }) {
      commit("RESET");
    }
  }
};
