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
  return urlParams.get('user') ?? getLastPathnameSegment()
}

const getEntryTypeFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('type') ?? getFirstPathnameSegment()
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

const makeRequest = (method, url, data) => (
  NT.ResultAsync.fromPromise(
    refreshTokenIfNecessary().then((jwt) =>
      axios({ method, url, data, ...tokenIfLoggedIn(jwt) })
        .then(({ data }) => data),
    ),
    getErrorStatusCode
  )
)

const tokenIfLoggedIn = (jwt) => ({
  headers: Nullable.map(jwt ?? getToken(), toAuthHeader) ?? {}
})

const getLastPathnameSegment = () => {
  const segments = window.location.pathname?.split?.('/').filter(s => s)
  return segments?.[segments?.length - 1]
}

const getFirstPathnameSegment = () => {
  const segments = window.location.pathname?.split?.('/').filter(s => s)
  return segments?.[0]
}

const refreshTokenIfNecessary = async () => {
  return netlifyIdentity.currentUser()?.jwt?.()
}
