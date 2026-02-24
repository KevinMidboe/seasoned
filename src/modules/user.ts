/* eslint-disable no-param-reassign */

import { Module } from "vuex";
import { parseJwt } from "../utils";

/* --------------------------------------------------------------------------- */
/* ── Utility helpers (cookie handling)  ────────────────────────────────── */
/* --------------------------------------------------------------------------- */

export interface CookieOptions {
  path?: string;
  expires?: number | string | boolean;
  [option: string]: string | number | boolean | undefined;
}

/**
 * Read a cookie value.
 */
export function getCookie(name: string): string | null {
  const array = document.cookie.split(";");
  let match = null;

  array.forEach((item: string) => {
    const query = `${name}=`;
    if (!item.trim().startsWith(query)) return;
    match = item.trim().substring(query.length);
  });

  return match;
}

/**
 * Write a cookie.
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  const opts: CookieOptions = {
    path: "/",
    ...options
  };

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  /* eslint-disable-next-line no-restricted-syntax */
  for (const [key, val] of Object.entries(opts)) {
    cookie += `; ${key}`;
    if (val !== true) cookie += `=${val}`;
  }

  document.cookie = cookie;
}

/**
 * Delete a cookie.
 */
export function deleteCookie(name: string): void {
  setCookie(name, "", { "max-age": 0 });
}

/* --------------------------------------------------------------------------- */
/* ── State / Types  ─────────────────────────────────────────────────── */
/* --------------------------------------------------------------------------- */

export interface Settings {
  /** Example property – replace with your real shape. */
  plexUserId?: string | null;
  // add the rest of your settings fields here
}

export interface UserState {
  token: string | null;
  admin: boolean;
  settings: Settings | null;
  username: string | null;
}

export interface RootState {
  val?: string;
  // your root state interface – leave empty if you don't use it
}

/* --------------------------------------------------------------------------- */
/* ── Vuex module  ──────────────────────────────────────────────────────── */
/* --------------------------------------------------------------------------- */

const userModule: Module<UserState, RootState> = {
  namespaced: true,

  /* ── State ───────────────────────────────────────────────────── */
  state: {
    token: null,
    admin: false,
    settings: null,
    username: null
  },

  /* ── Getters ─────────────────────────────────────────────────── */
  getters: {
    username: (state): string | null => state.username,
    settings: (state): Settings | null => state.settings,
    token: (state): string | null => state.token,
    loggedIn: (state): boolean => !!state && state.username !== null,
    admin: (state): boolean => state.admin,
    plexUserId: (state): string | null => state?.settings?.plexUserId ?? null
  },

  /* ── Mutations ─────────────────────────────────────────────────── */
  mutations: {
    SET_TOKEN(state, token: string | null): void {
      state.token = token;
    },
    SET_USERNAME(state, username: string | null): void {
      state.username = username;
    },
    SET_SETTINGS(state, settings: Settings | null): void {
      state.settings = settings;
    },
    SET_ADMIN(state, admin: boolean): void {
      state.admin = admin;
    },
    LOGOUT(state): void {
      state.token = null;
      state.username = null;
      state.settings = null;
      state.admin = false;
      deleteCookie("authorization");
    }
  },

  /* ── Actions ─────────────────────────────────────────────────── */
  actions: {
    async initUserFromCookie({ dispatch }): Promise<boolean | null> {
      const jwtToken = getCookie("authorization");
      if (!jwtToken) return null;

      const token = parseJwt(jwtToken);
      return dispatch("setupStateFromToken", token);
    },

    setupStateFromToken({ commit }, token: any): boolean {
      try {
        const { username, admin, settings } = token;
        if (!username) return false;

        commit("SET_TOKEN", token);
        commit("SET_USERNAME", username);
        commit("SET_SETTINGS", settings);
        commit("SET_ADMIN", admin !== undefined);

        return true;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Unable to parse JWT, failed with error:", e);
        return false;
      }
    },

    setSettings({ commit }, settings: Settings): void {
      if (!(settings instanceof Object)) {
        throw new Error("Parameter is not an object.");
      }
      commit("SET_SETTINGS", settings);
    },

    logout({ commit }): void {
      commit("LOGOUT");
    },

    login({ dispatch }): Promise<boolean | null> {
      return dispatch("initUserFromCookie");
    }
  }
};

const user = userModule;
export default user;
