import IStateDarkmode from "../interfaces/IStateDarkmode";

const state: IStateDarkmode = {
  darkmodeSupported: false,
  userChoice: undefined
};

export default {
  namespaced: true,
  state,
  getters: {
    darkmodeSupported: (state: IStateDarkmode) => {
      return state.darkmodeSupported;
    }
  },
  mutations: {
    SET_DARKMODE_SUPPORT: (
      state: IStateDarkmode,
      browserSupported: boolean
    ) => {
      state.darkmodeSupported = browserSupported;
    }
  },
  actions: {
    findAndSetDarkmodeSupported({ commit }) {
      const browserSupported =
        window.matchMedia("(prefers-color-scheme)").media !== "not all";
      commit("SET_DARKMODE_SUPPORT", browserSupported);
    }
  }
};
