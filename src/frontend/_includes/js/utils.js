const get = (url) =>
  NT.ResultAsync.fromPromise(
    axios.get(url).then((resp) => resp.data),
    (error) => error.response?.status ?? 500,
  )

window.http = {
  get,
}

/** A tag`function` that does nothing, for syntax-highlighting purposes */
window.html = function (t) {
  for (var s = t[0], i = 1, l = arguments.length; i < l; i++)
    s += arguments[i] + t[i];
  return s;
}
