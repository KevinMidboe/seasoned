import axios from 'axios'

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
  console.log('uuuurl', url)
  return axios.get(url)
    .catch(error => console.log('error while getting movie:', error))
}

const getShow = (id, credits) => {
  let url = BASE_URL + 'v2/show/' + id
  if (credits) {
    url += '?credits=true'
  }
  console.log('uuuurl', url)
  return axios.get(url)
    .catch(error => console.log('error while getting show:', error))
}

const getListByName = (listPath, page) => {
  const url = `${BASE_URL}${listPath}?page=${page}`
  return axios.get(url)
    .catch(error => console.log('error while getting list by name:', error))
}

const search = (query, page) => {
  const url = `${BASE_URL}v2/search?query=${query}&page=${page}`
  return axios.get(url)
    .catch(error => console.log('error while searching:', error))
}

// - - - Torrents - - - 

const searchTorrents = (query, filter='all', page, authorization_token) => {
  // const url = `${BASE_URL}v1/pirate/search?query=${query}&filter=${filter}&page=${page}`
  const url = `https://api.kevinmidboe.com/api/v1/pirate/search?query=${query}&filter=${filter}&page=${page}`
  const headers = { authorization: authorization_token }
  return axios.get(url, { headers: headers })
    .catch(error => console.log('error while searching for torrents:', error))
}

// - - - Plex/Request - - - 

const request = (id, type, authorization_token) => {
  const url = `${BASE_URL}v1/plex/request/${id}&type=${type}`
  const headers = { authorization: authorization_token }
  return axios.post(url, { headers: headers })
    .catch(error => console.log('error while requesting item:', error))
}

export { getMovie, getShow, getListByName, search, searchTorrents, request }