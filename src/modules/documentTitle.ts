import type IStateDocumentTitle from "../interfaces/IStateDocumentTitle";

const capitalize = (string: string) => {
  if (!string) return;

  return string.includes(" ")
    ? string
        .split(" ")
        .map(
          word => word.charAt(0).toUpperCase() + word.slice(1).replace("_", " ")
        )
        .join(" ")
    : string.charAt(0).toUpperCase() + string.slice(1);
};

const setDocumentTitle = (state: IStateDocumentTitle) => {
  document.title = `${state.emoji} ${state.titlePrefix} | ${capitalize(
    state.title
  )}`;
};

const state: IStateDocumentTitle = {
  emoji: "",
  titlePrefix: "seasoned",
  title: undefined
};

export default {
  namespaced: true,
  state,
  getters: {
    title: (state: IStateDocumentTitle) => state.title
  },
  mutations: {
    SET_EMOJI: (state: IStateDocumentTitle, emoji: string) => {
      state.emoji = emoji;
      setDocumentTitle(state);
    },
    SET_TITLE: (state: IStateDocumentTitle, title: string) => {
      state.title = title;
      setDocumentTitle(state);
    }
  },
  actions: {
    updateEmoji({ commit }, emoji: String) {
      commit("SET_EMOJI", emoji);
    },
    updateTitle({ commit }, title: String) {
      commit("SET_TITLE", title);
    }
  }
};
