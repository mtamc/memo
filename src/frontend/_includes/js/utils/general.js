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

const log = (x) => (console.log(), x)

const noOp = () => undefined

const waitForEl = (selector) => new Promise((resolve) => {
  if (document.querySelector(selector)) {
    return resolve(document.querySelector(selector))
  }

  const observer = new MutationObserver((mutations) => {
    if (document.querySelector(selector)) {
      resolve(document.querySelector(selector))
      observer.disconnect()
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
})

Utils = {
  html,
  css,
  noOp,
  log,
  waitForEl
}
