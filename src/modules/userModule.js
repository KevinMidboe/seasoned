import { getSettings } from '@/api'

function setLocalStorageByKey(key, value) {
  if (value instanceof Object || value instanceof Array) {
    value = JSON.stringify(value)
  }
  const buff = Buffer.from(value)
  const encodedValue = buff.toString('base64')
  localStorage.setItem(key, encodedValue)
}

function getLocalStorageByKey(key) {
  const encodedValue = localStorage.getItem(key)
  if (encodedValue == null) {
    return undefined
  }
  const buff = new Buffer(encodedValue, 'base64')
  const value = buff.toString('utf-8')

  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

const ifMissingSettingsAndTokenExistsFetchSettings = 
  () => getLocalStorageByKey('token') ? getSettings() : null

export default {
  namespaced: true,
  state: {
    admin: false,
    settings: undefined,
    username: undefined,
    plex_userid: undefined
  },
  getters: {
    admin: (state) => {
      return state.admin
    },
    settings: (state, foo, bar) => {
      console.log('is this called?')
      const settings = state.settings || getLocalStorageByKey('settings')
      if (settings instanceof Object) {
        return settings
      }

      ifMissingSettingsAndTokenExistsFetchSettings()
      return undefined
    },
    username: (state) => {
      const settings = state.settings || getLocalStorageByKey('settings')

      if (settings instanceof Object && settings.hasOwnProperty('user_name')) {
        return settings.user_name
      }

      ifMissingSettingsAndTokenExistsFetchSettings()
      return undefined
    },
    plex_userid: (state) => {
      const settings = state.settings || getLocalStorageByKey('settings')
      console.log('plex_userid from store', settings)

      if (settings instanceof Object && settings.hasOwnProperty('plex_userid')) {
        return settings.plex_userid
      }

      ifMissingSettingsAndTokenExistsFetchSettings()
      return undefined
    },
    isPlexAuthenticated: (state) => {
      let hasPlexId = state.settings['plex_userid']
      return hasPlexId != undefined
    }
  },
  mutations: {
    SET_ADMIN: (state, isAdmin) => {
      state.admin = isAdmin
    },
    SET_USERNAME: (state, username) => {
      state.username = username
      console.log('username')
      setLocalStorageByKey('username', username)
    },
    SET_SETTINGS: (state, settings) => {
      state.settings = settings
      console.log('settings')
      setLocalStorageByKey('settings', settings)
    }
  },
  actions: {
    setAdmin: ({commit}, isAdmin) => {
      if (!(isAdmin instanceof Object)) {
        throw "Parameter is not a boolean value."
      }
      commit('SET_ADMIN', isAdmin)
    },
    setSettings: ({commit}, settings) => {
      console.log('settings input', settings)
      if (!(settings instanceof Object)) {
        throw "Parameter is not a object."
      }
      commit('SET_SETTINGS', settings)
    }
  }
}
