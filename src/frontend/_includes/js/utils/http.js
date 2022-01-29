/**
 * @file Functions to make safe network requests
 * using neverthrow for functional error handling
 * neverthrow API: https://github.com/supermacro/neverthrow
 */

const get = (url) => makeRequest('get', url)

const post = (url, data) => makeRequest('post', url, data)

const patch = (url, data) => makeRequest('patch', url, data)

const del = (url) => makeRequest('delete', url)

/** Returns the Netlify token or undefined if not logged in */
const getToken = () => netlifyIdentity?.currentUser()?.token?.access_token

const getNameFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('user')
}

const getEntryTypeFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('type')
}


Http = {
  get,
  post,
  patch,
  del,
  getToken,
  getNameFromUrl,
  getEntryTypeFromUrl,
}

///////////////////////////////////////////////////////////////////////////////

const getErrorStatusCode = (error) => error.response?.status ?? 500

const toAuthHeader = (token) => ({ Authorization: `Bearer ${token}` })

const makeRequest = (method, url, data) =>
  NT.ResultAsync.fromPromise(
    axios({ method, url, data, ...tokenIfLoggedIn() })
      .then(({ data }) => data),
    getErrorStatusCode
  )

const tokenIfLoggedIn = () => ({
  headers: Nullable.map(getToken(), toAuthHeader) ?? {}
})
