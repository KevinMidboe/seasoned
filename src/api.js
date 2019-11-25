import axios from 'axios'
import storage from '@/storage'
import config from '@/config.json'
import path from 'path'

const SEASONED_URL = config.SEASONED_URL
const ELASTIC_URL = config.ELASTIC_URL
const ELASTIC_INDEX = config.ELASTIC_INDEX

// TODO
//  - Move autorization token and errors here?

// - - - TMDB - - - 

/**
 * Fetches tmdb movie by id. Can optionally include cast credits in result object.
 * @param {number} id
 * @param {boolean} [credits=false] Include credits
 * @returns {object} Tmdb response
 */
const getMovie = (id, checkExistance=false, credits=false, release_dates=false) => {
  const url = new URL('v2/movie', SEASONED_URL)
  url.pathname = path.join(url.pathname, id.toString())
  if (checkExistance) {
    url.searchParams.append('check_existance', true)
  }
  if (credits) {
    url.searchParams.append('credits', true)
  }
  if(release_dates) {
    url.searchParams.append('release_dates', true)
  }

  return fetch(url.href)
    .then(resp => resp.json())
    .catch(error => { console.error(`api error getting movie: ${id}`); throw error })
}

/**
 * Fetches tmdb show by id. Can optionally include cast credits in result object.
 * @param {number} id
 * @param {boolean} [credits=false] Include credits
 * @returns {object} Tmdb response
 */
const getShow = (id, credits=false) => {
  const url = new URL('v2/show', SEASONED_URL)
  url.pathname = path.join(url.pathname, id.toString())
  if (credits) {
    url.searchParams.append('credits', true)
  }

  return fetch(url.href)
    .then(resp => resp.json())
    .catch(error => { console.error(`api error getting show: ${id}`); throw error })
}

/**
 * Fetches tmdb list by name.
 * @param {string} name List the fetch
 * @param {number} [page=1]
 * @returns {object} Tmdb list response
 */
const getTmdbMovieListByName = (name, page=1) => {
  const url = new URL('v2/movie/' + name, SEASONED_URL)
  url.searchParams.append('page', page)
  const headers = { authorization: storage.token }

  return fetch(url.href, { headers: headers })
    .then(resp => resp.json())
    // .catch(error => { console.error(`api error getting list: ${name}, page: ${page}`); throw error })
}

/**
 * Fetches requested items.
 * @param {number} [page=1]
 * @returns {object} Request response
 */
const getRequests = (page=1) => {
  const url = new URL('v2/request', SEASONED_URL)
  url.searchParams.append('page', page)
  const headers = { authorization: storage.token }

  return fetch(url.href, { headers: headers })
    .then(resp => resp.json())
    // .catch(error => { console.error(`api error getting list: ${name}, page: ${page}`); throw error })
}


const getUserRequests = (page=1) => {
  const url = new URL('v1/user/requests', SEASONED_URL)
  url.searchParams.append('page', page)

  const headers = { authorization: localStorage.getItem('token') }

  return fetch(url.href, { headers })
    .then(resp => resp.json())
}

/**
 * Fetches tmdb movies and shows by query.
 * @param {string} query
 * @param {number} [page=1]
 * @returns {object} Tmdb response
 */
const searchTmdb = (query, page=1) => {
  const url = new URL('v2/search', SEASONED_URL)
  url.searchParams.append('query', query)
  url.searchParams.append('page', page)

  const headers = { authorization: localStorage.getItem('token') }

  return fetch(url.href, { headers })
    .then(resp => resp.json())
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
  const url = new URL('/api/v1/pirate/search', SEASONED_URL)
  url.searchParams.append('query', query)

  const headers = { authorization: storage.token }

  return fetch(url.href, { headers: headers })
    .then(resp => resp.json())
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
  const url = new URL('v1/pirate/add', SEASONED_URL)

  const body = {
    magnet: magnet,
    name: name,
    tmdb_id: tmdb_id
  }
  const headers = { authorization: storage.token }

  return fetch(url.href, { method: 'POST', headers, body })
    .then(resp => resp.json())
    .catch(error => { console.error(`api error adding magnet: ${name} ${error}`); throw error })
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
  const url = new URL('v2/request', SEASONED_URL)
//  url.pathname = path.join(url.pathname, id.toString())
//  url.searchParams.append('type', type)

  const headers = {
    'Authorization': authorization_token,
    'Content-Type': 'application/json'
  }
  const body = {
    id: id,
    type: type
  }

  return fetch(url.href, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  })
  .then(resp => resp.json())
  .catch(error => { console.error(`api error requesting: ${id}, type: ${type}`); throw error })
}

/**
 * Check request status by tmdb id and type
 * @param {number} tmdb id
 * @param {string} type
 * @returns {object} Success/Failure response
 */
const getRequestStatus = (id, type, authorization_token=undefined) => {
  const url = new URL('v2/request', SEASONED_URL)
  url.pathname = path.join(url.pathname, id.toString())
  url.searchParams.append('type', type)

  return fetch(url.href)
    .then(resp => {
      const status = resp.status;
      if (status === 200) { return true }
      else if (status === 404) { return false }
      else {
        console.error(`api error getting request status for id ${id} and type ${type}`)
      }
    })
    .catch(err => Promise.reject(err))
}

// - - - Seasoned user endpoints - - -

const register = (username, password) => {
  const url = new URL('v1/user', SEASONED_URL)
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  }

  return fetch(url.href, options)
    .then(resp => resp.json())
    .catch(error => {
      console.error('Unexpected error occured before receiving response. Error:', error)
      // TODO log to sentry the issue here
      throw error
    })
}

const login = (username, password) => {
  const url = new URL('v1/user/login', SEASONED_URL)
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  }

  return fetch(url.href, options)
    .then(resp => checkStatus)
    .then(resp => resp.json())
    .catch(error => {
      console.error('Unexpected error occured before receiving response. Error:', error)
      // TODO log to sentry the issue here
      throw error
    })
}

// - - - Authenticate with plex - - -

const plexAuthenticate = (username, password) => {
  const url = new URL('v1/user/authenticate', SEASONED_URL)
  const body = { username, password }
  const headers = {
    'Content-Type': 'application/json',
    authorization: storage.token
  }

  return fetch(url.href, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  })
  .then(resp => resp.json())
  .catch(error => { console.error(`api error authentication plex: ${username}`); throw error })
}


// - - - Random emoji - - -

const getEmoji = () => {
  const url = new URL('v1/emoji', SEASONED_URL)

  return fetch(url.href)
    .then(resp => resp.json())
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
  const url = new URL(path.join(ELASTIC_INDEX, '/_search'), ELASTIC_URL)
  const headers = {
    'Content-Type': 'application/json'
  }

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

  return fetch(url.href, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  })
    .then(resp => resp.json())
    .catch(error => { console.log(`api error searching elasticsearch: ${query}`); throw error })
}



export {
  getMovie,
  getShow,
  getTmdbMovieListByName,
  searchTmdb,
  getUserRequests,
  getRequests,
  searchTorrents,
  addMagnet,
  request,
  getRequestStatus,
  plexAuthenticate,
  register,
  login,
  getEmoji,
  elasticSearchMoviesAndShows
}
