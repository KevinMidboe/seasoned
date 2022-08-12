import type IStateHamburger from "../interfaces/IStateHamburger";

const state: IStateHamburger = {
  open: false
};

/* eslint-disable @typescript-eslint/no-shadow, no-return-assign */
export default {
  namespaced: true,
  state,
  getters: {
    isOpen: state => state.open
  },
  mutations: {
    SET_OPEN: state => (state.open = true),
    SET_CLOSE: state => (state.open = false),
    TOGGLE: state => (state.open = !state.open)
  },
  actions: {
    open: ({ commit }) => commit("SET_OPEN"),
    close: ({ commit }) => commit("SET_CLOSE"),
    toggle: ({ commit }) => commit("TOGGLE")
  }
};
