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
    refreshTokenIfNecessary().then(() =>
      axios({ method, url, data, ...tokenIfLoggedIn() })
        .then(({ data }) => data),
    ),
    getErrorStatusCode
  )
)

const tokenIfLoggedIn = () => ({
  headers: Nullable.map(getToken(), toAuthHeader) ?? {}
})

const getLastPathnameSegment = () => {
  const segments = window.location.pathname?.split?.('/').filter(s => s)
  return segments?.[segments?.length - 1]
}

const getFirstPathnameSegment = () => {
  const segments = window.location.pathname?.split?.('/').filter(s => s)
  return segments?.[0]
}

const refreshTokenIfNecessary = () => {
  console.log("in xhr refresh fn")
  // If the token in the local storage is newer than the one
  // on the current tab, then use the one in the local storage
  // (This happens when you're on multiple memo tabs at once)
  const localStorageToken = (() => {
    try {
      return JSON.parse(localStorage.getItem('gotrue.user')).token
    } catch {
      return undefined
    }
  })()

  if (localStorageToken?.expires_at > netlifyIdentity.currentUser()?.token?.expires_at) {
    netlifyIdentity.currentUser().token = localStorageToken
  }

  if (netlifyIdentity.currentUser()?.token?.expires_at == null) {
    console.log("no token found, trying to refresh but doubtful")
    return netlifyIdentity.currentUser()?.jwt?.(true)
  } else if (netlifyIdentity.currentUser()?.token?.expires_at < Date.now()) {
    console.log("token must be refreshed, refreshing")
    return netlifyIdentity.currentUser()?.jwt?.(true)
  } else {
    console.log('not refreshing token')
  }
}


