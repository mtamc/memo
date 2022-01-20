/**
 * @file Netlify API calls and utility
 */

// API CALLS

const getUserName = () => Http.get(ENDPOINTS.name)

const getEntries = (type, username) => Http.get(ENDPOINTS.entries(type, username))

const setName = (newName) => Http.post(ENDPOINTS.name, { newName })

// UTILITY

const entryTypes = ['games', 'films', 'books', 'tv_shows']

const getToken = Http.getToken

const isLoggedIn = () => !R.isNil(getToken())

Netlify = {
  getToken,
  getUserName,
  getEntries,
  setName,
  entryTypes,
  isLoggedIn
}

///////////////////////////////////////////////////////////////////////////////

const API_URL_BASE = '/api/'

const ENDPOINTS = {
  name: API_URL_BASE + 'name',
  entries: (type, username) => `${API_URL_BASE}entries/${type}/${username}`
}
