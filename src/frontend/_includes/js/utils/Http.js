/**
 * @file Functions to make safe network requests
 * using neverthrow for functional error handling
 * neverthrow API: https://github.com/supermacro/neverthrow
 */
const get = (url) =>
  NT.ResultAsync.fromPromise(
    getWithTokenIfLoggedIn(url).then((resp) => resp.data),
    (error) => error.response?.status ?? 500,
  )

/** Returns the Netlify token or undefined if not logged in */
const getToken = () => netlifyIdentity?.currentUser()?.token?.access_token

window.Http = {
  get,
  getToken
}

///////////////////////////////////////////////////////////////////////////////

const toAuthHeader = (token) => ({ Authorization: `Bearer ${token}` })

/** Make a GET and include token if user is logged in */
const getWithTokenIfLoggedIn = (url) =>
  axios.get(url, {
    headers: Nullable.map(getToken(), toAuthHeader) ?? {},
  })

