/* eslint-disable n/no-unsupported-features/node-builtins */
import { IList, IMediaCredits, IPersonCredits } from "./interfaces/IList";

const API_HOSTNAME = import.meta.env.VITE_SEASONED_API;
const ELASTIC_URL = import.meta.env.VITE_ELASTIC_URL;
const ELASTIC_API_KEY = import.meta.env.VITE_ELASTIC_API_KEY;

// - - - TMDB - - -

/**
 * Fetches tmdb movie by id. Can optionally include cast credits in result object.
 * @param {number} id
 * @returns {object} Tmdb response
 */
const getMovie = (
  id,
  {
    checkExistance,
    credits,
    releaseDates
  }: { checkExistance: boolean; credits: boolean; releaseDates?: boolean }
) => {
  const url = new URL("/api/v2/movie", API_HOSTNAME);
  url.pathname = `${url.pathname}/${id.toString()}`;
  if (checkExistance) {
    url.searchParams.append("check_existance", "true");
  }
  if (credits) {
    url.searchParams.append("credits", "true");
  }
  if (releaseDates) {
    url.searchParams.append("release_dates", "true");
  }

  return fetch(url.href)
    .then(resp => resp.json())
    .catch(error => {
      console.error(`api error getting movie: ${id}`); // eslint-disable-line no-console
      throw error;
    });
};

/**
 * Fetches tmdb show by id. Can optionally include cast credits in result object.
 * @param {number} id
 * @param {boolean} [credits=false] Include credits
 * @returns {object} Tmdb response
 */
const getShow = (
  id,
  {
    checkExistance,
    credits,
    releaseDates
  }: { checkExistance: boolean; credits: boolean; releaseDates?: boolean }
) => {
  const url = new URL("/api/v2/show", API_HOSTNAME);
  url.pathname = `${url.pathname}/${id.toString()}`;
  if (checkExistance) {
    url.searchParams.append("check_existance", "true");
  }
  if (credits) {
    url.searchParams.append("credits", "true");
  }
  if (releaseDates) {
    url.searchParams.append("release_dates", "true");
  }

  return fetch(url.href)
    .then(resp => resp.json())
    .catch(error => {
      console.error(`api error getting show: ${id}`); // eslint-disable-line no-console
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
  const url = new URL("/api/v2/person", API_HOSTNAME);
  url.pathname = `${url.pathname}/${id.toString()}`;
  if (credits) {
    url.searchParams.append("credits", "true");
  }

  return fetch(url.href)
    .then(resp => resp.json())
    .catch(error => {
      console.error(`api error getting person: ${id}`); // eslint-disable-line no-console
      throw error;
    });
};

/**
 * Fetches tmdb movie credits by id.
 * @param {number} id
 * @returns {object} Tmdb response
 */
const getMovieCredits = (id: number): Promise<IMediaCredits> => {
  const url = new URL("/api/v2/movie", API_HOSTNAME);
  url.pathname = `${url.pathname}/${id.toString()}/credits`;

  return fetch(url.href)
    .then(resp => resp.json())
    .catch(error => {
      console.error(`api error getting movie: ${id}`); // eslint-disable-line no-console
      throw error;
    });
};

/**
 * Fetches tmdb show credits by id.
 * @param {number} id
 * @returns {object} Tmdb response
 */
const getShowCredits = (id: number): Promise<IMediaCredits> => {
  const url = new URL("/api/v2/show", API_HOSTNAME);
  url.pathname = `${url.pathname}/${id.toString()}/credits`;

  return fetch(url.href)
    .then(resp => resp.json())
    .catch(error => {
      console.error(`api error getting show: ${id}`); // eslint-disable-line no-console
      throw error;
    });
};

/**
 * Fetches tmdb person credits by id.
 * @param {number} id
 * @returns {object} Tmdb response
 */
const getPersonCredits = (id: number): Promise<IPersonCredits> => {
  const url = new URL("/api/v2/person", API_HOSTNAME);
  url.pathname = `${url.pathname}/${id.toString()}/credits`;

  return fetch(url.href)
    .then(resp => resp.json())
    .catch(error => {
      console.error(`api error getting person: ${id}`); // eslint-disable-line no-console
      throw error;
    });
};

/**
 * Fetches tmdb list by name.
 * @param {string} name List the fetch
 * @param {number} [page=1]
 * @returns {object} Tmdb list response
 */
const getTmdbMovieListByName = (name: string, page = 1): Promise<IList> => {
  const url = new URL(`/api/v2/movie/${name}`, API_HOSTNAME);
  url.searchParams.append("page", page.toString());

  return fetch(url.href).then(resp => resp.json());
  // .catch(error => { console.error(`api error getting list: ${name}, page: ${page}`); throw error }) // eslint-disable-line no-console
};

/**
 * Fetches requested items.
 * @param {number} [page=1]
 * @returns {object} Request response
 */
const getRequests = (page = 1) => {
  const url = new URL("/api/v2/request", API_HOSTNAME);
  url.searchParams.append("page", page.toString());

  return fetch(url.href).then(resp => resp.json());
  // .catch(error => { console.error(`api error getting list: ${name}, page: ${page}`); throw error }) // eslint-disable-line no-console
};

const getUserRequests = (page = 1) => {
  const url = new URL("/api/v1/user/requests", API_HOSTNAME);
  url.searchParams.append("page", page.toString());

  return fetch(url.href).then(resp => resp.json());
};

/**
 * Fetches tmdb movies and shows by query.
 * @param {string} query
 * @param {number} [page=1]
 * @returns {object} Tmdb response
 */
const searchTmdb = (query, page = 1, adult = false, mediaType = null) => {
  const url = new URL("/api/v2/search", API_HOSTNAME);
  if (mediaType != null && ["movie", "show", "person"].includes(mediaType)) {
    url.pathname += `/${mediaType}`;
  }

  url.searchParams.append("query", query);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("adult", adult.toString());

  return fetch(url.href)
    .then(resp => resp.json())
    .catch(error => {
      console.error(`api error searching: ${query}, page: ${page}`); // eslint-disable-line no-console
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
  const url = new URL("/api/v1/pirate/search", API_HOSTNAME);
  url.searchParams.append("query", query);

  return fetch(url.href)
    .then(resp => resp.json())
    .catch(error => {
      console.error(`api error searching torrents: ${query}`); // eslint-disable-line no-console
      throw error;
    });
};

/**
 * Add magnet to download queue.
 * @param {string} magnet Magnet link
 * @param {boolean} name Name of torrent
 * @param {boolean} tmdbId
 * @returns {object} Success/Failure response
 */
const addMagnet = (magnet: string, name: string, tmdbId: number | null) => {
  const url = new URL("/api/v1/pirate/add", API_HOSTNAME);

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      magnet,
      name,
      tmdb_id: tmdbId
    })
  };

  return fetch(url.href, options)
    .then(resp => resp.json())
    .catch(error => {
      console.error(`api error adding magnet: ${name} ${error}`); // eslint-disable-line no-console
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
  const url = new URL("/api/v2/request", API_HOSTNAME);

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, type })
  };

  return fetch(url.href, options)
    .then(resp => resp.json())
    .catch(error => {
      console.error(`api error requesting: ${id}, type: ${type}`); // eslint-disable-line no-console
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
  const url = new URL("/api/v2/request", API_HOSTNAME);
  url.pathname = `${url.pathname}/${id.toString()}`;
  url.searchParams.append("type", type);

  return fetch(url.href)
    .then(resp => {
      const { status } = resp;
      if (status === 200) return true;

      return false;
    })
    .catch(err => Promise.reject(err));
};

const watchLink = (title, year) => {
  const url = new URL("/api/v1/plex/watch-link", API_HOSTNAME);
  url.searchParams.append("title", title);
  url.searchParams.append("year", year);

  return fetch(url.href)
    .then(resp => resp.json())
    .then(response => response.link);
};

const movieImages = id => {
  const url = new URL(`v2/movie/${id}/images`, API_HOSTNAME);

  return fetch(url.href).then(resp => resp.json());
};

// - - - Seasoned user endpoints - - -

const register = (username, password) => {
  const url = new URL("/api/v1/user", API_HOSTNAME);
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  };

  return fetch(url.href, options)
    .then(resp => resp.json())
    .catch(error => {
      const errorMessage =
        "Unexpected error occured before receiving response. Error:";
      // eslint-disable-next-line no-console
      console.error(errorMessage, error);
      // TODO log to sentry the issue here
      throw error;
    });
};

const login = async (
  username: string,
  password: string,
  throwError = false
) => {
  const url = new URL("/api/v1/user/login", API_HOSTNAME);
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  };

  return fetch(url.href, options).then(resp => {
    if (resp.status === 200) return resp.json();

    if (throwError) throw resp;
    console.error("Error occured when trying to sign in.\nError:", resp); // eslint-disable-line no-console
    return Promise.reject(resp);
  });
};

const logout = async (throwError = false) => {
  const url = new URL("/api/v1/user/logout", API_HOSTNAME);
  const options = { method: "POST" };

  return fetch(url.href, options).then(resp => {
    if (resp.status === 200) return resp.json();

    if (throwError) throw resp;
    console.error("Error occured when trying to log out.\nError:", resp); // eslint-disable-line no-console
    return Promise.reject(resp);
  });
};

const getSettings = () => {
  const url = new URL("/api/v1/user/settings", API_HOSTNAME);

  return fetch(url.href)
    .then(resp => resp.json())
    .catch(error => {
      console.log("api error getting user settings"); // eslint-disable-line no-console
      throw error;
    });
};

const updateSettings = settings => {
  const url = new URL("/api/v1/user/settings", API_HOSTNAME);

  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings)
  };

  return fetch(url.href, options)
    .then(resp => resp.json())
    .catch(error => {
      console.log("api error updating user settings"); // eslint-disable-line no-console
      throw error;
    });
};

// - - - Authenticate with plex - - -

const linkPlexAccount = (username, password) => {
  const url = new URL("/api/v1/user/link_plex", API_HOSTNAME);
  const body = { username, password };

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  };

  return fetch(url.href, options)
    .then(resp => resp.json())
    .catch(error => {
      console.error(`api error linking plex account: ${username}`); // eslint-disable-line no-console
      throw error;
    });
};

const unlinkPlexAccount = () => {
  const url = new URL("/api/v1/user/unlink_plex", API_HOSTNAME);

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  };

  return fetch(url.href, options)
    .then(resp => resp.json())
    .catch(error => {
      console.error(`api error unlinking your plex account`); // eslint-disable-line no-console
      throw error;
    });
};

// - - - User graphs - - -

const fetchGraphData = (urlPath, days, chartType) => {
  const url = new URL(`/api/v1/user/${urlPath}`, API_HOSTNAME);
  url.searchParams.append("days", days);
  url.searchParams.append("y_axis", chartType);

  return fetch(url.href).then(resp => {
    if (!resp.ok) {
      console.log("DAMN WE FAILED!", resp); // eslint-disable-line no-console
      throw Error(resp.statusText);
    }

    return resp.json();
  });
};

// - - - Random emoji - - -

const getEmoji = () => {
  const url = new URL("/api/v1/emoji", API_HOSTNAME);

  return fetch(url.href)
    .then(resp => resp.json())
    .catch(error => {
      console.log("api error getting emoji"); // eslint-disable-line no-console
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
  const url = new URL(`${ELASTIC_URL}/_search`);

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
    headers: {
      "Content-Type": "application/json",
      Authorization: `ApiKey ${ELASTIC_API_KEY}`
    },
    body: JSON.stringify(body)
  };

  return fetch(url.href, options)
    .then(resp => resp.json())
    .catch(error => {
      console.log(`api error searching elasticsearch: ${query}`); // eslint-disable-line no-console
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
  fetchGraphData,
  getEmoji,
  elasticSearchMoviesAndShows
};
