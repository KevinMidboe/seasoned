/* eslint-disable no-param-reassign */
import type ITorrent from "../interfaces/ITorrent";
import type IStateTorrent from "../interfaces/IStateTorrent";

const state: IStateTorrent = {
  results: [],
  resultCount: null
};

/* eslint-disable @typescript-eslint/no-shadow */
export default {
  namespaced: true,
  state,
  getters: {
    results: (state: IStateTorrent) => state.results,
    resultCount: (state: IStateTorrent) => state.resultCount
  },

  mutations: {
    SET_RESULTS: (state: IStateTorrent, results: ITorrent[]) => {
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
    setResults({ commit }, results: ITorrent[]) {
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
