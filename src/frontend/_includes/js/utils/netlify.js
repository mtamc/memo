/**
 * @file Netlify API calls and utility
 */

// API CALLS

const getUserName = () => Http.get(ENDPOINTS.name)

const getUserIdFromName = (name) => Http.get(ENDPOINTS.idFromName(name))

const getEntries = (type, username) => Http.get(ENDPOINTS.entries(type, username))

const setName = (newName) => Http.post(ENDPOINTS.name, { newName })

const searchWorks = (type, query) => Http.get(
  ENDPOINTS.searchWorks(type, encodeURIComponent(query))
)

const retrieveWork = (type, ref) => Http.get(
  ENDPOINTS.retrieveWork(type, ref)
)

const createEntry = (type, entry) => Http.post(
  ENDPOINTS.createEntry(type),
  entry
)

const updateEntry = (type, ref, entry) => Http.put(
  ENDPOINTS.updateEntry(type, ref),
  entry
)


// UTILITY

const entryTypes = ['games', 'films', 'books', 'tv_shows']

const getToken = Http.getToken

const isLoggedIn = () => !R.isNil(getToken())

Netlify = {
  getToken,
  getUserName,
  getEntries,
  getUserIdFromName,
  searchWorks,
  retrieveWork,
  setName,
  entryTypes,
  isLoggedIn,
  createEntry,
  updateEntry,
}

///////////////////////////////////////////////////////////////////////////////

const API_URL_BASE = '/api/'

const ENDPOINTS = {
  name: API_URL_BASE + 'name',
  idFromName: (name) => API_URL_BASE + 'name/' + name,
  entries: (type, username) => `${API_URL_BASE}entries/${type}/${username}`,
  searchWorks: (type, query) => `${API_URL_BASE}works/search/${type}/${query}`,
  retrieveWork: (type, apiRef) => `${API_URL_BASE}works/retrieve/${type}/${apiRef}`,
  createEntry: (type) => `${API_URL_BASE}entries/${type}`,
  updateEntry: (type, dbRef) => `${API_URL_BASE}entries/${type}/${dbRef}`,
}
