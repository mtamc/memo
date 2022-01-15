/** A tag`function` that does nothing, for syntax-highlighting purposes */
const html = function (t) {
  for (var s = t[0], i = 1, l = arguments.length; i < l; i++)
    s += arguments[i] + t[i]
  return s
}

window.Utils = {
  html,
}
