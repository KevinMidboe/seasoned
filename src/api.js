import axios from 'axios'
import storage from '@/storage.js'

// const SEASONED_URL = 'https://api.kevinmidboe.com/api/'
const SEASONED_URL = 'http://localhost:31459/api/'

const ELASTIC_URL = 'http://localhost:9200/'

// TODO
//  - Move autorization token and errors here?

// - - - TMDB - - - 

const getMovie = (id, credits) => {
  let url = SEASONED_URL + 'v2/movie/' + id
  if (credits) {
    url += '?credits=true'
  }

  return axios.get(url)
    .catch(error => { console.error(`api error getting movie: ${id}`); throw error })
}

const getShow = (id, credits) => {
  let url = SEASONED_URL + 'v2/show/' + id
  if (credits) {
    url += '?credits=true'
  }
  return axios.get(url)
    .catch(error => { console.error(`api error getting show: ${id}`); throw error })
}

const getListByName = (listPath, page) => {
  const url = `${SEASONED_URL}${listPath}?page=${page}`
  // TODO - remove. this is temporary fix for user-requests endpoint (also import)
  const headers = { authorization: storage.token }
  return axios.get(url, { headers: headers })
    .catch(error => { console.error(`api error getting list: ${listPath}, page: ${page}`); throw error })
}

const search = (query, page) => {
  const url = `${SEASONED_URL}v2/search?query=${query}&page=${page}`
  return axios.get(url)
    .catch(error => { console.error(`api error searching: ${query}, page: ${page}`); throw error })
}

// - - - Torrents - - - 

const searchTorrents = (query, filter='all', page, authorization_token) => {
  // const url = `${SEASONED_URL}v1/pirate/search?query=${query}&filter=${filter}&page=${page}`
  const url = `https://api.kevinmidboe.com/api/v1/pirate/search?query=${query}&filter=${filter}&page=${page}`
  const headers = { authorization: authorization_token }
  return axios.get(url, { headers: headers })
    .catch(error => { console.error(`api error searching torrents: ${query}`); throw error })
}

// - - - Plex/Request - - - 

const request = (id, type, authorization_token) => {
  const url = `${SEASONED_URL}v1/plex/request/${id}&type=${type}`
  const headers = { authorization: authorization_token }
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



export { getMovie, getShow, getListByName, search, searchTorrents, request, plexAuthenticate, getEmoji, elasticSearchMoviesAndShows }
