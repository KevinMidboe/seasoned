import { refreshToken } from "@/api";
import { parseJwt } from "@/utils";

function setLocalStorageByKey(key, value) {
  if (value instanceof Object || value instanceof Array) {
    value = JSON.stringify(value);
  }
  const buff = Buffer.from(value);
  const encodedValue = buff.toString("base64");
  localStorage.setItem(key, encodedValue);
}

function getLocalStorageByKey(key) {
  const encodedValue = localStorage.getItem(key);
  if (encodedValue == null) {
    return null;
  }
  const buff = new Buffer(encodedValue, "base64");
  const value = buff.toString("utf-8");

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export default {
  namespaced: true,
  state: {
    token: null,
    admin: false,
    settings: null,
    username: null
  },
  getters: {
    username: state => state.username,
    settings: state => state.settings,
    token: state => state.token,
    loggedIn: state => state && state.username !== null,
    admin: state => state && state.admin !== null,
    plexId: state => {
      if (state && state.settings && state.settings.plex_userid)
        return state.settings.plex_userid;
      return null;
    }
  },
  mutations: {
    SET_TOKEN: (state, token) => (state.token = token),
    SET_USERNAME: (state, username) => (state.username = username),
    SET_SETTINGS: (state, settings) => (state.settings = settings),
    SET_ADMIN: (state, admin) => (state.admin = admin),
    LOGOUT: state => {
      state.token = null;
      state.username = null;
      state.settings = null;
      state.admin = false;
      localStorage.removeItem("token");
    }
  },
  actions: {
    initFromLocalStorage: async ({ dispatch }) => {
      const token = getLocalStorageByKey("token");
      if (token) await dispatch("setupStateFromToken", token);

      const settings = getLocalStorageByKey("settings");
      if (settings) await dispatch("setSettings", settings);
    },
    setupStateFromToken: ({ commit }, token) => {
      try {
        const jwtData = parseJwt(token);
        const { username, admin } = jwtData;

        if (!username) {
          return false;
        }

        commit("SET_TOKEN", token);
        commit("SET_USERNAME", username);
        commit("SET_ADMIN", admin != undefined ? true : false);
        return true;
      } catch (error) {
        console.log("Unable to parse JWT, failed with error:", error);
        return false;
      }
    },
    setSettings: ({ commit }, settings) => {
      if (!(settings instanceof Object)) {
        throw "Parameter is not a object.";
      }

      commit("SET_SETTINGS", settings);
      setLocalStorageByKey("settings", settings);
    },
    logout: ({ commit }) => commit("LOGOUT"),
    login: async ({ dispatch }, token) => {
      const loggedIn = await dispatch("setupStateFromToken", token);
      if (loggedIn) setLocalStorageByKey("token", token);

      return loggedIn;
    }
  }
};
