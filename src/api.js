import axios from 'axios'
import storage from '@/storage.js'
import config from '@/config.json'

const SEASONED_URL = config.SEASONED_URL
const ELASTIC_URL = config.ELASTIC_URL

// TODO
//  - Move autorization token and errors here?

// - - - TMDB - - - 

/**
 * Fetches tmdb movie by id. Can optionally include cast credits in result object.
 * @param {number} id
 * @param {boolean} [credits=false] Include credits
 * @returns {object} Tmdb response
 */
const getMovie = (id, credits=false) => {
  let url = SEASONED_URL + 'v2/movie/' + id
  if (credits) {
    url += '?credits=true'
  }

  return axios.get(url)
    .catch(error => { console.error(`api error getting movie: ${id}`); throw error })
}

/**
 * Fetches tmdb show by id. Can optionally include cast credits in result object.
 * @param {number} id
 * @param {boolean} [credits=false] Include credits
 * @returns {object} Tmdb response
 */
const getShow = (id, credits=false) => {
  let url = SEASONED_URL + 'v2/show/' + id
  if (credits) {
    url += '?credits=true'
  }
  return axios.get(url)
    .catch(error => { console.error(`api error getting show: ${id}`); throw error })
}

/**
 * Fetches tmdb list by path.
 * @param {string} listPath Path of list
 * @param {number} [page=1]
 * @returns {object} Tmdb list response
 */
const getTmdbListByPath = (listPath, page=1) => {
  const url = `${SEASONED_URL}${listPath}?page=${page}`
  // TODO - remove. this is temporary fix for user-requests endpoint (also import)
  const headers = { authorization: storage.token }
  return axios.get(url, { headers: headers })
    .catch(error => { console.error(`api error getting list: ${listPath}, page: ${page}`); throw error })
}

/**
 * Fetches tmdb movies and shows by query.
 * @param {string} query
 * @param {number} [page=1]
 * @returns {object} Tmdb response
 */
const searchTmdb = (query, page=1) => {
  const url = `${SEASONED_URL}v2/search?query=${query}&page=${page}`
  return axios.get(url)
    .catch(error => { console.error(`api error searching: ${query}, page: ${page}`); throw error })
}

// - - - Torrents - - - 

/**
 * Search for torrents by query
 * @param {string} query
 * @param {boolean} credits Include credits
 * @returns {object} Torrent response
 */
const searchTorrents = (query, authorization_token) => {
  // const url = `${SEASONED_URL}v1/pirate/search?query=${query}&filter=${filter}&page=${page}`
  const url = `https://api.kevinmidboe.com/api/v1/pirate/search?query`
  const headers = { authorization: storage.token }
  return axios.get(url, { headers: headers })
    .catch(error => { console.error(`api error searching torrents: ${query}`); throw error })
}

/**
 * Add magnet to download queue.
 * @param {string} magnet Magnet link
 * @param {boolean} name Name of torrent
 * @param {boolean} tmdb_id
 * @returns {object} Success/Failure response
 */
const addMagnet = (magnet, name, tmdb_id) => {
  // const url = `${SEASONED_URL}v1/pirate/add`
  const url = `https://api.kevinmidboe.com/api/v1/pirate/add`

  const body = {
    magnet: magnet,
    name: name,
    tmdb_id: tmdb_id
  }
  const headers = { authorization: storage.token }
  return axios.post(url, body, { headers: headers })
    .catch(error => { console.error(`api error adding magnet: ${name}`); throw error })
}

// - - - Plex/Request - - - 

/**
 * Request a movie or show from id. If authorization token is included the user will be linked
 * to the requested item.
 * @param {number} id Movie or show id
 * @param {string} type Movie or show type
 * @param {string} [authorization_token] To identify the requesting user
 * @returns {object} Success/Failure response
 */
const request = (id, type, authorization_token=undefined) => {
  // const url = `${SEASONED_URL}v1/plex/request/${id}&type=${type}`
  const url = `https://api.kevinmidboe.com/api/v1/plex/request/${id}&type=${type}`

  const headers = authorization_token ? { authorization: authorization_token } : {}
  return axios.post(url, { headers: headers })
    .catch(error => { console.error(`api error requesting: ${id}, type: ${type}`); throw error })
}


// - - - Authenticate with plex - - -

const plexAuthenticate = (username, password) => {
  const url = `https://plex.tv/users/sign_in.json?user[login]=${username}&user[password]=${password}`
  const headers = {
    'Content-Type': 'application/json',
    'X-Plex-Platform': 'Linux',
    'X-Plex-Version': 'v2.0.24',
    'X-Plex-Platform-Version': '4.13.0-36-generic',
    'X-Plex-Device-Name': 'Tautulli',
    'X-Plex-Client-Identifier': '123'
  }

  return axios.post(url, { headers: headers })
    .catch(error => { console.error(`api error authentication plex: ${username}`); throw error })
}


// - - - Random emoji - - -

const getEmoji = () => {
  const url = `${SEASONED_URL}v1/emoji`
  return axios.get(url)
    .catch(error => { console.log('api error getting emoji'); throw error })
}


// - - - ELASTIC SEARCH - - -
// This elastic index contains titles mapped to ids. Lightning search
// used for autocomplete

/**
 * Search elastic indexes movies and shows by query. Doc includes Tmdb daily export of Movies and
 * Tv Shows. See tmdb docs for more info: https://developers.themoviedb.org/3/getting-started/daily-file-exports
 * @param {string} query
 * @returns {object} List of movies and shows matching query
 */
const elasticSearchMoviesAndShows = (query) => {
  const url = `${ELASTIC_URL}shows,movies/_search`
  const body = {
    "sort" : [
      { "popularity" : {"order" : "desc"}},
      "_score"
    ],
    "query": {
      "bool": {
        "should": [{
          "match_phrase_prefix": {
            "original_name": query
          }
        },
        {
          "match_phrase_prefix": {
            "original_title": query
          }
        }]
      }
    },
    "size": 6
  }

  return axios.post(url, body)
    .catch(error => { console.log(`api error searching elasticsearch: ${query}`); throw error })
}



export { getMovie, getShow, getTmdbListByPath, searchTmdb, searchTorrents, addMagnet, request, plexAuthenticate, getEmoji, elasticSearchMoviesAndShows }
