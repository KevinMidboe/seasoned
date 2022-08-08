import { PopupTypes } from "../interfaces/IStatePopup";
import type { IStatePopup } from "../interfaces/IStatePopup";

const removeIncludedQueryParams = (params, key) => {
  if (params.has(key)) params.delete(key);
  return params;
};

const updateQueryParams = (id: number | null = null, type: string = "") => {
  let params = new URLSearchParams(window.location.search);
  params = removeIncludedQueryParams(params, "movie");
  params = removeIncludedQueryParams(params, "show");
  params = removeIncludedQueryParams(params, "person");

  if (id && type in PopupTypes) {
    params.append(type, id.toString());
  }

  let url = `${window.location.protocol}//${window.location.hostname}${
    window.location.port ? `:${window.location.port}` : ""
  }${window.location.pathname}${params.toString().length ? `?${params}` : ""}`;

  if (window.preventPushState) {
    window.history.replaceState({}, "search", url);
    window.preventPushState = false;
  } else {
    window.history.pushState({}, "search", url);
  }
};

const state: IStatePopup = {
  id: null,
  type: null,
  open: false
};

export default {
  namespaced: true,
  state,
  getters: {
    isOpen: state => state.open,
    id: state => state.id,
    type: state => state.type
  },
  mutations: {
    SET_OPEN: (state, { id, type }) => {
      state.id = id;
      state.type = type;
      state.open = true;
    },
    SET_CLOSE: state => {
      state.id = null;
      state.type = null;
      state.open = false;
    }
  },
  actions: {
    open: ({ commit }, { id, type = "movie" }) => {
      if (!isNaN(id)) id = Number(id);
      commit("SET_OPEN", { id, type });
      updateQueryParams(id, type);
    },
    close: ({ commit }) => {
      commit("SET_CLOSE");
      updateQueryParams(); // reset
    }
  }
};
