const { Result } = require('neverthrow')
const { reqError } = require('./errors')
const { create, findByRef } = require('./db')
const responses = require('./responses')
const { match } = require('ts-pattern')
const { length } = require('ramda')

const getUrlSegments = (event) =>
  event.path
    .replace(/\.netlify\/functions\/[^/]+/, '')
    .replace(/api\/[^/]+/, '')
    .split('/')
    .filter((s) => s)

const routeArg = (event) => segments(event)[0]

const getReqBodyAndCreate = (collection, event) =>
  getReqBody(event).match(
    (body) => create(collection, body),
    (err) => Promise.resolve(responses.badRequest(err)),
  )

const getUrlSegmentAndFind = (collection, event) =>
  findByRef(collection, routeArg(event))

const matchVerbAndNumberOfUrlSegments = (event) =>
  match([event.httpMethod, length(getUrlSegments(event))])

module.exports = {
  getUrlSegments,
  routeArg,
  getReqBodyAndCreate,
  getUrlSegmentAndFind,
  matchVerbAndNumberOfUrlSegments
}

///////////////////////////////////////////////////////////////////////////////

const getReqBody = Result.fromThrowable(
  (event) => JSON.parse(event.body),
  err => reqError(String(err)),
)
