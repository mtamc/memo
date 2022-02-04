/**
 * @file Netlify API calls and utility
 */

// API CALLS

const getUserName = () => Http.get(ENDPOINTS.name)

const getUserIdFromName = (name) => Http.get(ENDPOINTS.idFromName(name))

const getEntries = (type, username, limit) => Http.get(ENDPOINTS.entries(type, username, limit))

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

const updateEntry = (type, ref, entry) => Http.patch(
  ENDPOINTS.updateEntry(type, ref),
  entry
)

const deleteEntry = (type, ref) => Http.del(
  ENDPOINTS.deleteEntry(type, ref)
)


// UTILITY

const entryTypes = ['games', 'films', 'books', 'tv']

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
  deleteEntry,
}

///////////////////////////////////////////////////////////////////////////////

const API_URL_BASE = '/.netlify/functions/'

const ENDPOINTS = {
  name: API_URL_BASE + 'name',
  idFromName: (name) => API_URL_BASE + 'name/' + name,
  entries: (type, username, limit) => `${API_URL_BASE}entries/${type}/${username}${limit ? `/${limit}` : ''}`,
  searchWorks: (type, query) => `${API_URL_BASE}works/search/${type}/${query}`,
  retrieveWork: (type, apiRef) => `${API_URL_BASE}works/retrieve/${type}/${apiRef}`,
  createEntry: (type) => `${API_URL_BASE}entries/${type}`,
  updateEntry: (type, dbRef) => `${API_URL_BASE}entries/${type}/${dbRef}`,
  deleteEntry: (type, dbRef) => `${API_URL_BASE}entries/${type}/${dbRef}`,
}
