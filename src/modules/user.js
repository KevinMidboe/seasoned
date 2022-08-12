import { refreshToken } from "@/api";
import { parseJwt } from "@/utils";

function getCookie(name) {
  var arrayb = document.cookie.split(";");
  for (const item of arrayb) {
    const query = `${name}=`;

    if (!item.startsWith(query)) continue;
    return item.substr(query.length);
  }

  return null;
}

function setCookie(name, value, options = {}) {
  options = {
    path: "/",
    // add other defaults here if necessary
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie =
    encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

function deleteCookie(name) {
  setCookie(name, "", {
    "max-age": Date.now()
  });
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
    // loggedIn: state => true,
    loggedIn: state => state && state.username !== null,
    admin: state => state.admin,
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
      // deleteCookie('authorization');
    }
  },
  actions: {
    initUserFromCookie: async ({ dispatch }) => {
      const jwtToken = getCookie("authorization");
      if (!jwtToken) return null;

      const token = parseJwt(jwtToken);
      return await dispatch("setupStateFromToken", token);
    },
    setupStateFromToken: ({ commit }, token) => {
      try {
        const { username, admin, settings } = token;

        if (!username) {
          return false;
        }

        commit("SET_TOKEN", token);
        commit("SET_USERNAME", username);
        commit("SET_SETTINGS", settings);
        commit("SET_ADMIN", admin != undefined);
        return true;
      } catch (error) {
        console.error("Unable to parse JWT, failed with error:", error);
        return false;
      }
    },
    setSettings: ({ commit }, settings) => {
      if (!(settings instanceof Object)) {
        throw "Parameter is not a object.";
      }

      commit("SET_SETTINGS", settings);
    },
    logout: ({ commit }) => commit("LOGOUT"),
    login: async ({ dispatch }) => await dispatch("initUserFromCookie")
  }
};
