const removeIncludedQueryParams = (params, key) => {
  if (params.has(key)) params.delete(key);
  return params;
};

const updateQueryParams = (id = null, type = null) => {
  let params = new URLSearchParams(window.location.search);
  params = removeIncludedQueryParams(params, "movie");
  params = removeIncludedQueryParams(params, "show");
  params = removeIncludedQueryParams(params, "person");

  if (id && type === "movie") {
    params.append("movie", id);
  }
  if (id && type === "show") {
    params.append("show", id);
  }
  if (id && type === "person") {
    params.append("person", id);
  }

  let url = `${window.location.protocol}//${window.location.hostname}${
    window.location.port ? `:${window.location.port}` : ""
  }${window.location.pathname}${params.toString().length ? `?${params}` : ""}`;

  window.history.replaceState({}, "search", url);
};

export default {
  namespaced: true,
  state: {
    id: null,
    type: null,
    open: false
  },
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
