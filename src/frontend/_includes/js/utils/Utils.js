/**
 * @file General utility functions
 */

/** A tag`function` that does nothing, for syntax-highlighting purposes */
const noOpTagFunction = function (t) {
  for (var s = t[0], i = 1, l = arguments.length; i < l; i++)
    s += arguments[i] + t[i]
  return s
}

/** A tag`function` that does nothing, for syntax-highlighting purposes */
const html = noOpTagFunction

const css = noOpTagFunction

const log = (x) => (console.trace(), x)

const noOp = () => undefined

Utils = {
  html,
  css,
  noOp,
  log,
}
