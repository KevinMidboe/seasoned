import axios from 'axios'
import storage from '@/storage.js'

// const BASE_URL = 'https://api.kevinmidboe.com/api/'
const BASE_URL = 'http://localhost:31459/api/'

// TODO
//  - Move autorization token and errors here?

// - - - TMDB - - - 

const getMovie = (id, credits) => {
  let url = BASE_URL + 'v2/movie/' + id
  if (credits) {
    url += '?credits=true'
  }

  return axios.get(url)
    .catch(error => { console.error(`api error getting movie: ${id}`); throw error })
}

const getShow = (id, credits) => {
  let url = BASE_URL + 'v2/show/' + id
  if (credits) {
    url += '?credits=true'
  }
  return axios.get(url)
    .catch(error => { console.error(`api error getting show: ${id}`); throw error })
}

const getListByName = (listPath, page) => {
  const url = `${BASE_URL}${listPath}?page=${page}`
  // TODO - remove. this is temporary fix for user-requests endpoint (also import)
  const headers = { authorization: storage.token }
  return axios.get(url, { headers: headers })
    .catch(error => { console.error(`api error getting list: ${listPath}, page: ${page}`); throw error })
}

const search = (query, page) => {
  const url = `${BASE_URL}v2/search?query=${query}&page=${page}`
  return axios.get(url)
    .catch(error => { console.error(`api error searching: ${query}, page: ${page}`); throw error })
}

// - - - Torrents - - - 

const searchTorrents = (query, filter='all', page, authorization_token) => {
  // const url = `${BASE_URL}v1/pirate/search?query=${query}&filter=${filter}&page=${page}`
  const url = `https://api.kevinmidboe.com/api/v1/pirate/search?query=${query}&filter=${filter}&page=${page}`
  const headers = { authorization: authorization_token }
  return axios.get(url, { headers: headers })
    .catch(error => { console.error(`api error searching torrents: ${query}`); throw error })
}

// - - - Plex/Request - - - 

const request = (id, type, authorization_token) => {
  const url = `${BASE_URL}v1/plex/request/${id}&type=${type}`
  const headers = { authorization: authorization_token }
  return axios.post(url, { headers: headers })
    .catch(error => { console.error(`api error requesting: ${id}, type: ${type}`); throw error })
}


// - - - Random emoji - - -

const getEmoji = () => {
  const url = `${BASE_URL}v1/emoji`
  return axios.get(url)
    .catch(error => { console.log('api error getting emoji'); throw error })
}



export { getMovie, getShow, getListByName, search, searchTorrents, request, getEmoji }
