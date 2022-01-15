// EXPORTED

const getToken = () => netlifyIdentity?.currentUser()?.token?.access_token

const get = (url) =>
  NT.ResultAsync.fromPromise(
    getWithTokenIfLoggedIn(url).then((resp) => resp.data),
    (error) => error.response?.status ?? 500,
  )

window.Http = {
  get,
  getToken,
}

///////////////////////////////////////////////////////////////////////////////

// unexported

const toAuthHeader = (token) => ({ Authorization: `Bearer ${token}` })

/** Make a GET and include token if user is logged in */
const getWithTokenIfLoggedIn = (url) =>
  axios.get(url, {
    headers: Nullable.map(getToken(), toAuthHeader) ?? {},
  })

