const capitalize = (string) => {
  return string.includes(' ') ? 
    string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).replace('_', ' ')).join(' ')
    : string.charAt(0).toUpperCase() + string.slice(1)
}

const setDocumentTitle = (state) => {
  document.title = `${state.emoji} ${state.titlePrefix} | ${capitalize(state.title)}`
}

export default {
  namespaced: true,
  state: {
    emoji: '',
    titlePrefix: 'request',
    title: undefined
  },
  getters: {
    title: (state) => {
      return state.title
    }
  },
  mutations: {
    SET_EMOJI: (state, emoji) => {
      state.emoji = emoji
      setDocumentTitle(state)
    },
    SET_TITLE: (state, title) => {
      state.title = title
      setDocumentTitle(state)
    }
  },
  actions: {
    updateEmoji({ commit }, emoji) {
      commit('SET_EMOJI', emoji)
    },
    updateTitle({ commit }, title) {
      commit('SET_TITLE', title)
    }
  }
}
