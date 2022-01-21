/**
 * @file General utility functions
 */

/** A tag`function` that does nothing, for syntax-highlighting purposes */
const html = function (t) {
  for (var s = t[0], i = 1, l = arguments.length; i < l; i++)
    s += arguments[i] + t[i]
  return s
}

const log = (x) => (console.trace(), x)

const noOp = () => undefined

/**
 * Sets the HTML content of the selected element to
 * the provided component. Run the provided initializer
 * function if one came with the component.
 */
const setContent = (selector, content) =>
  Array.isArray(content)
    ? ( $(selector).html(content[0]), (() => { try { content[1]?.() } catch (e) { console.log('failed'); console.log(content); console.trace() } })())
    : $(selector).html(content)


Utils = {
  html,
  noOp,
  setContent,
  log
}
