/**
 * @file Functions to make safe network requests
 * using neverthrow for functional error handling
 * neverthrow API: https://github.com/supermacro/neverthrow
 */

const get = (url) =>
  NT.ResultAsync.fromPromise(
    getWithTokenIfLoggedIn(url).then((resp) => resp.data),
    getErrorStatusCode
  )

const post = (url, data) =>
  NT.ResultAsync.fromPromise(
    postWithTokenIfLoggedIn(url, data).then((resp) => resp.data),
    getErrorStatusCode
  )

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
  getToken,
  getNameFromUrl,
  getEntryTypeFromUrl,
}

///////////////////////////////////////////////////////////////////////////////

const getErrorStatusCode = (error) => error.response?.status ?? 500

const toAuthHeader = (token) => ({ Authorization: `Bearer ${token}` })

/** Make a GET and include token if user is logged in */
const getWithTokenIfLoggedIn = (url) =>
  axios.get(url, tokenIfLoggedIn())

/** Make a POST and include token if user is logged in */
const postWithTokenIfLoggedIn = (url, data) =>
  axios.post(url, data, tokenIfLoggedIn())

const tokenIfLoggedIn = () => ({
  headers: Nullable.map(getToken(), toAuthHeader) ?? {}
})
