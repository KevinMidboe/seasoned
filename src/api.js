import config from "@/config.json";

const SEASONED_URL = config.SEASONED_URL || window.location.origin;
const ELASTIC_URL = config.ELASTIC_URL;
const ELASTIC_INDEX = config.ELASTIC_INDEX;

// TODO
//  - Move autorization token and errors here?

const checkStatusAndReturnJson = response => {
  if (!response.ok) {
    throw resp;
  }
  return response.json();
};

// - - - TMDB - - -

/**
 * Fetches tmdb movie by id. Can optionally include cast credits in result object.
 * @param {number} id
 * @param {boolean} [credits=false] Include credits
 * @returns {object} Tmdb response
 */
const getMovie = (
  id,
  checkExistance = false,
  credits = false,
  release_dates = false
) => {
  const url = new URL("/api/v2/movie", SEASONED_URL);
  url.pathname = `${url.pathname}/${id.toString()}`;
  if (checkExistance) {
    url.searchParams.append("check_existance", true);
  }
  if (credits) {
    url.searchParams.append("credits", true);
  }
  if (release_dates) {
    url.searchParams.append("release_dates", true);
  }

  return fetch(url.href)
    .then(resp => resp.json())
    .catch(error => {
      console.error(`api error getting movie: ${id}`);
      throw error;
    });
};

/**
 * Fetches tmdb show by id. Can optionally include cast credits in result object.
 * @param {number} id
 * @param {boolean} [credits=false] Include credits
 * @returns {object} Tmdb response
 */
const getShow = (id, checkExistance = false, credits = false) => {
  const url = new URL("/api/v2/show", SEASONED_URL);
  url.pathname = `${url.pathname}/${id.toString()}`;
  if (checkExistance) {
    url.searchParams.append("check_existance", true);
  }
  if (credits) {
    url.searchParams.append("credits", true);
  }

  return fetch(url.href)
    .then(resp => resp.json())
    .catch(error => {
      console.error(`api error getting show: ${id}`);
      throw error;
    });
};

/**
 * Fetches tmdb person by id. Can optionally include cast credits in result object.
 * @param {number} id
 * @param {boolean} [credits=false] Include credits
 * @returns {object} Tmdb response
 */
const getPerson = (id, credits = false) => {
  const url = new URL("/api/v2/person", SEASONED_URL);
  url.pathname = `${url.pathname}/${id.toString()}`;
  if (credits) {
    url.searchParams.append("credits", true);
  }

  return fetch(url.href)
    .then(resp => resp.json())
    .catch(error => {
      console.error(`api error getting person: ${id}`);
      throw error;
    });
};

const getCredits = (type, id) => {
  if (type === "movie") {
    return getMovieCredits(id);
  } else if (type === "show") {
    return getShowCredits(id);
  } else if (type === "person") {
    return getPersonCredits(id);
  }

  return [];
};

/**
 * Fetches tmdb movie credits by id.
 * @param {number} id
 * @returns {object} Tmdb response
 */
const getMovieCredits = id => {
  const url = new URL("/api/v2/movie", SEASONED_URL);
  url.pathname = `${url.pathname}/${id.toString()}/credits`;

  return fetch(url.href)
    .then(resp => resp.json())
    .catch(error => {
      console.error(`api error getting movie: ${id}`);
      throw error;
    });
};

/**
 * Fetches tmdb show credits by id.
 * @param {number} id
 * @returns {object} Tmdb response
 */
const getShowCredits = id => {
  const url = new URL("/api/v2/show", SEASONED_URL);
  url.pathname = `${url.pathname}/${id.toString()}/credits`;

  return fetch(url.href)
    .then(resp => resp.json())
    .catch(error => {
      console.error(`api error getting show: ${id}`);
      throw error;
    });
};

/**
 * Fetches tmdb person credits by id.
 * @param {number} id
 * @returns {object} Tmdb response
 */
const getPersonCredits = id => {
  const url = new URL("/api/v2/person", SEASONED_URL);
  url.pathname = `${url.pathname}/${id.toString()}/credits`;

  return fetch(url.href)
    .then(resp => resp.json())
    .catch(error => {
      console.error(`api error getting person: ${id}`);
      throw error;
    });
};

/**
 * Fetches tmdb list by name.
 * @param {string} name List the fetch
 * @param {number} [page=1]
 * @returns {object} Tmdb list response
 */
const getTmdbMovieListByName = (name, page = 1) => {
  const url = new URL("/api/v2/movie/" + name, SEASONED_URL);
  url.searchParams.append("page", page);

  return fetch(url.href).then(resp => resp.json());
  // .catch(error => { console.error(`api error getting list: ${name}, page: ${page}`); throw error })
};

/**
 * Fetches requested items.
 * @param {number} [page=1]
 * @returns {object} Request response
 */
const getRequests = (page = 1) => {
  const url = new URL("/api/v2/request", SEASONED_URL);
  url.searchParams.append("page", page);

  return fetch(url.href).then(resp => resp.json());
  // .catch(error => { console.error(`api error getting list: ${name}, page: ${page}`); throw error })
};

const getUserRequests = (page = 1) => {
  const url = new URL("/api/v1/user/requests", SEASONED_URL);
  url.searchParams.append("page", page);

  return fetch(url.href).then(resp => resp.json());
};

/**
 * Fetches tmdb movies and shows by query.
 * @param {string} query
 * @param {number} [page=1]
 * @returns {object} Tmdb response
 */
const searchTmdb = (query, page = 1, adult = false, mediaType = null) => {
  const url = new URL("/api/v2/search", SEASONED_URL);
  if (mediaType != null && ["movie", "show", "person"].includes(mediaType)) {
    url.pathname += `/${mediaType}`;
  }

  url.searchParams.append("query", query);
  url.searchParams.append("page", page);
  url.searchParams.append("adult", adult);

  return fetch(url.href)
    .then(resp => resp.json())
    .catch(error => {
      console.error(`api error searching: ${query}, page: ${page}`);
      throw error;
    });
};

// - - - Torrents - - -

/**
 * Search for torrents by query
 * @param {string} query
 * @param {boolean} credits Include credits
 * @returns {object} Torrent response
 */
const searchTorrents = query => {
  const url = new URL(
    "https://api.request.movie/api/v1/pirate/search",
    SEASONED_URL
  );
  url.searchParams.append("query", query);

  return fetch(url.href)
    .then(resp => resp.json())
    .catch(error => {
      console.error(`api error searching torrents: ${query}`);
      throw error;
    });
};

/**
 * Add magnet to download queue.
 * @param {string} magnet Magnet link
 * @param {boolean} name Name of torrent
 * @param {boolean} tmdb_id
 * @returns {object} Success/Failure response
 */
const addMagnet = (magnet, name, tmdb_id) => {
  const url = new URL("/api/v1/pirate/add", SEASONED_URL);

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      magnet: magnet,
      name: name,
      tmdb_id: tmdb_id
    })
  };

  return fetch(url.href, options)
    .then(resp => resp.json())
    .catch(error => {
      console.error(`api error adding magnet: ${name} ${error}`);
      throw error;
    });
};

// - - - Plex/Request - - -

/**
 * Request a movie or show from id. If authorization token is included the user will be linked
 * to the requested item.
 * @param {number} id Movie or show id
 * @param {string} type Movie or show type
 * @returns {object} Success/Failure response
 */
const request = (id, type) => {
  const url = new URL("/api/v2/request", SEASONED_URL);

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, type })
  };

  return fetch(url.href, options)
    .then(resp => resp.json())
    .catch(error => {
      console.error(`api error requesting: ${id}, type: ${type}`);
      throw error;
    });
};

/**
 * Check request status by tmdb id and type
 * @param {number} tmdb id
 * @param {string} type
 * @returns {object} Success/Failure response
 */
const getRequestStatus = (id, type = undefined) => {
  const url = new URL("/api/v2/request", SEASONED_URL);
  url.pathname = `${url.pathname}/${id.toString()}`;
  url.searchParams.append("type", type);

  return fetch(url.href)
    .then(resp => {
      const status = resp.status;
      if (status === 200) {
        return true;
      } else if (status === 404) {
        return false;
      } else {
        console.error(
          `api error getting request status for id ${id} and type ${type}`
        );
      }
    })
    .catch(err => Promise.reject(err));
};

const watchLink = (title, year) => {
  const url = new URL("/api/v1/plex/watch-link", SEASONED_URL);
  url.searchParams.append("title", title);
  url.searchParams.append("year", year);

  return fetch(url.href)
    .then(resp => resp.json())
    .then(response => response.link);
};

const movieImages = id => {
  const url = new URL(`v2/movie/${id}/images`, SEASONED_URL);

  return fetch(url.href).then(resp => resp.json());
};

// - - - Seasoned user endpoints - - -

const register = (username, password) => {
  const url = new URL("/api/v1/user", SEASONED_URL);
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  };

  return fetch(url.href, options)
    .then(resp => resp.json())
    .catch(error => {
      console.error(
        "Unexpected error occured before receiving response. Error:",
        error
      );
      // TODO log to sentry the issue here
      throw error;
    });
};

const login = (username, password, throwError = false) => {
  const url = new URL("/api/v1/user/login", SEASONED_URL);
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  };

  return fetch(url.href, options).then(resp => {
    if (resp.status == 200) return resp.json();

    if (throwError) throw resp;
    else console.error("Error occured when trying to sign in.\nError:", resp);
  });
};

const logout = () => {
  const url = new URL("/api/v1/user/logout", SEASONED_URL);
  const options = { method: "POST" };

  return fetch(url.href, options).then(resp => {
    if (resp.status == 200) return resp.json();

    if (throwError) throw resp;
    else console.error("Error occured when trying to log out.\nError:", resp);
  });
};

const getSettings = () => {
  const url = new URL("/api/v1/user/settings", SEASONED_URL);

  return fetch(url.href)
    .then(resp => resp.json())
    .catch(error => {
      console.log("api error getting user settings");
      throw error;
    });
};

const updateSettings = settings => {
  const url = new URL("/api/v1/user/settings", SEASONED_URL);

  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings)
  };

  return fetch(url.href, options)
    .then(resp => resp.json())
    .catch(error => {
      console.log("api error updating user settings");
      throw error;
    });
};

// - - - Authenticate with plex - - -

const linkPlexAccount = (username, password) => {
  const url = new URL("/api/v1/user/link_plex", SEASONED_URL);
  const body = { username, password };

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  };

  return fetch(url.href, options)
    .then(resp => resp.json())
    .catch(error => {
      console.error(`api error linking plex account: ${username}`);
      throw error;
    });
};

const unlinkPlexAccount = (username, password) => {
  const url = new URL("/api/v1/user/unlink_plex", SEASONED_URL);

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  };

  return fetch(url.href, options)
    .then(resp => resp.json())
    .catch(error => {
      console.error(`api error unlinking plex account: ${username}`);
      throw error;
    });
};

// - - - User graphs - - -

const fetchChart = (urlPath, days, chartType) => {
  const url = new URL("/api/v1/user" + urlPath, SEASONED_URL);
  url.searchParams.append("days", days);
  url.searchParams.append("y_axis", chartType);

  return fetch(url.href).then(resp => {
    if (!resp.ok) {
      console.log("DAMN WE FAILED!", resp);
      throw Error(resp.statusText);
    }

    return resp.json();
  });
};

// - - - Random emoji - - -

const getEmoji = () => {
  const url = new URL("/api/v1/emoji", SEASONED_URL);

  return fetch(url.href)
    .then(resp => resp.json())
    .catch(error => {
      console.log("api error getting emoji");
      throw error;
    });
};

// - - - ELASTIC SEARCH - - -
// This elastic index contains titles mapped to ids. Lightning search
// used for autocomplete

/**
 * Search elastic indexes movies and shows by query. Doc includes Tmdb daily export of Movies and
 * Tv Shows. See tmdb docs for more info: https://developers.themoviedb.org/3/getting-started/daily-file-exports
 * @param {string} query
 * @returns {object} List of movies and shows matching query
 */
const elasticSearchMoviesAndShows = (query, count = 22) => {
  const url = new URL(`${ELASTIC_INDEX}/_search`, ELASTIC_URL);

  const body = {
    sort: [{ popularity: { order: "desc" } }, "_score"],
    query: {
      bool: {
        should: [
          {
            match_phrase_prefix: {
              original_name: query
            }
          },
          {
            match_phrase_prefix: {
              original_title: query
            }
          }
        ]
      }
    },
    size: count
  };

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  };

  return fetch(url.href, options)
    .then(resp => resp.json())
    .catch(error => {
      console.log(`api error searching elasticsearch: ${query}`);
      throw error;
    });
};

export {
  getMovie,
  getShow,
  getPerson,
  getMovieCredits,
  getShowCredits,
  getPersonCredits,
  getCredits,
  getTmdbMovieListByName,
  searchTmdb,
  getUserRequests,
  getRequests,
  searchTorrents,
  addMagnet,
  request,
  watchLink,
  movieImages,
  getRequestStatus,
  linkPlexAccount,
  unlinkPlexAccount,
  register,
  login,
  logout,
  getSettings,
  updateSettings,
  fetchChart,
  getEmoji,
  elasticSearchMoviesAndShows
};
