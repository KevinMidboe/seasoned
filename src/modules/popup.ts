/* eslint-disable no-param-reassign */
import { MediaTypes } from "../interfaces/IList";
import type { IStatePopup, IPopupQuery } from "../interfaces/IStatePopup";

/* eslint-disable-next-line import-x/no-cycle */
import router from "../routes";

const removeIncludedQueryParams = (params: URLSearchParams, key: string) => {
  if (params.has(key)) params.delete(key);
  return params;
};

function paramsToObject(entries: Iterator<[string, string]>) {
  const result = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of entries) {
    result[key] = value;
  }

  return result;
}

const updateQueryParams = (id: number = null, type: MediaTypes = null) => {
  let params = new URLSearchParams(window.location.search);
  params = removeIncludedQueryParams(params, "movie");
  params = removeIncludedQueryParams(params, "show");
  params = removeIncludedQueryParams(params, "person");

  if (id && type) {
    params.append(type, id.toString());
  }

  router.push({
    path: window.location.pathname,
    query: paramsToObject(params.entries())
  });
};

const state: IStatePopup = {
  id: null,
  type: null,
  open: false
};

/* eslint-disable @typescript-eslint/no-shadow */
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
    open: ({ commit }, { id, type }: { id: number; type: MediaTypes }) => {
      if (!Number.isNaN(id)) {
        id = Number(id);
      }

      commit("SET_OPEN", { id, type });
      updateQueryParams(id, type);
    },
    close: ({ commit }) => {
      commit("SET_CLOSE");
      updateQueryParams(); // reset
    },
    resetStateFromUrlQuery: ({ commit }, query: IPopupQuery) => {
      let { movie, show, person } = query;
      movie = !Number.isNaN(movie) ? Number(movie) : movie;
      show = !Number.isNaN(show) ? Number(show) : show;
      person = !Number.isNaN(person) ? Number(person) : person;

      if (movie) commit("SET_OPEN", { id: movie, type: "movie" });
      else if (show) commit("SET_OPEN", { id: show, type: "show" });
      else if (person) commit("SET_OPEN", { id: person, type: "person" });
      else commit("SET_CLOSE");
    }
  }
};
