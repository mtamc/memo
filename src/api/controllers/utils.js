/** @typedef {import('@netlify/functions').HandlerEvent} Event */
/** @typedef {import('@netlify/functions').HandlerContext} Context */
/** @typedef {import('../errors').Error} Error */
const { Result, ResultAsync } = require('neverthrow')
const errors = require('../utils/errors')
const db = require('../utils/db')
const { validateExists } = require('../utils/general')
const { JWT } = require("jose")

/** @type {(event: Event) => Result<string, Error>} */
const getUserId = (event) =>
   validateExists(event.headers?.authorization)
    .map((authString) => authString.replace('Bearer ', ''))
    .map((jwt) => JWT.verify(jwt, process.env.TOKEN_SECRET).sub)
    .mapErr(errors.unauthorized)

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

/** @type {(name: string) => ResultAsync<string, Error>} */
const findIdOfName = (name) =>
  db.findOneByField_('users', 'username', name)
    .map(result => result?.data?.userId)

module.exports = {
  getUserId,
  getSegment,
  getUrlSegments,
  getReqBody,
  findIdOfName
}

