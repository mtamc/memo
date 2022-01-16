/** @typedef {import('@netlify/functions').HandlerEvent} Event */
/** @typedef {import('@netlify/functions').HandlerContext} Context */
/** @typedef {import('../errors').Error} Error */
const { Result, ok, err } = require('neverthrow')
const errors = require('../errors')

/** @type {(context: Context) => Result<string, Error>} */
const getUserId = (context) => {
  const user = context.clientContext?.user?.sub
  return user !== undefined
    ? ok(user)
    : err(errors.unauthorized())
}

/** @type {(segmentIndex: number, event: Event) => string} */
const getSegment = (segmentIndex, event) =>
  getUrlSegments(event)[segmentIndex]

/** @type {(event: Event) => string[]} */
const getUrlSegments = (event) =>
  event.path
    .replace(/\.netlify\/functions\/[^/]+/, '')
    .replace(/api\/[^/]+/, '')
    .split('/')
    .filter((s) => s)

/** @type {(event: Event) => Result<any, Error>} */
const getReqBody = Result.fromThrowable(
  (event) => JSON.parse(event.body),
  (err) => errors.req(String(err)),
)

module.exports = {
  getUserId,
  getSegment,
  getUrlSegments,
  getReqBody
}

