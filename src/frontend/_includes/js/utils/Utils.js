/**
 * @file General utility functions
 */

/** A tag`function` that does nothing, for syntax-highlighting purposes */
const html = function (t) {
  for (var s = t[0], i = 1, l = arguments.length; i < l; i++)
    s += arguments[i] + t[i]
  return s
}

const noOp = () => undefined

const setContent = (selector, content) =>
  Array.isArray(content)
    ? ( $(selector).html(content[0]), content[1]?.() )
    : $(selector).html(content)

Utils = {
  html,
  noOp,
  setContent
}
