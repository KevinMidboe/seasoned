import router from "../routes";
import { ListTypes } from "../interfaces/IList";
import type { IStatePopup } from "../interfaces/IStatePopup";

const removeIncludedQueryParams = (params, key) => {
  if (params.has(key)) params.delete(key);
  return params;
};

function paramsToObject(entries) {
  const result = {};
  for (const [key, value] of entries) {
    // each 'entry' is a [key, value] tupple
    result[key] = value;
  }
  return result;
}

const updateQueryParams = (id: number | null = null, type: string = "") => {
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
    },
    resetStateFromUrlQuery: ({ commit }, query: any) => {
      let { movie, show, person } = query;
      movie = !isNaN(movie) ? Number(movie) : movie;
      show = !isNaN(show) ? Number(show) : show;
      person = !isNaN(person) ? Number(person) : person;

      if (movie) commit("SET_OPEN", { id: movie, type: "movie" });
      else if (show) commit("SET_OPEN", { id: show, type: "show" });
      else if (person) commit("SET_OPEN", { id: person, type: "person" });
      else commit("SET_CLOSE");
    }
  }
};
