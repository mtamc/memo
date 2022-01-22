/**
 * @file Netlify API calls and utility
 */

// API CALLS

const getUserName = () => Http.get(ENDPOINTS.name)

const getUserIdFromName = (name) => Http.get(ENDPOINTS.idFromName(name))

const getEntries = (type, username) => Http.get(ENDPOINTS.entries(type, username))

const setName = (newName) => Http.post(ENDPOINTS.name, { newName })

// UTILITY

const entryTypes = ['games', 'films', 'books', 'tv_shows']

const getToken = Http.getToken

const isLoggedIn = () => !R.isNil(getToken())

const toData = (resp) => resp.data.map((doc) => doc.data)

Netlify = {
  getToken,
  getUserName,
  getEntries,
  getUserIdFromName,
  setName,
  entryTypes,
  isLoggedIn,
  toData,
}

///////////////////////////////////////////////////////////////////////////////

const API_URL_BASE = '/api/'

const ENDPOINTS = {
  name: API_URL_BASE + 'name',
  idFromName: (name) => API_URL_BASE + 'name/' + name,
  entries: (type, username) => `${API_URL_BASE}entries/${type}/${username}`
}
