/**
 * @file This file exports the utility functions that Netlify
 * functions should be using for maximum simplicity.
 *
 * Those functions help Netlify functions parse
 * HTTP requests in the tersest way possible, perform DB
 * queries and return HTTP responses.
 */
/** @typedef {import('@netlify/functions').HandlerEvent} Event */
/** @typedef {import('./responses').Response} Response */
/** @typedef {import('./errors').Error} Error */
const { Result } = require('neverthrow')
const errors = require('./errors')
const db = require('./db')
const responses = require('./responses')
const { match } = require('ts-pattern')
const { length } = require('ramda')
const { tuple } = require('./general')

/**
 * This is the main routing utility we use in our Netlify functions.
 * @param {Event} event
 * @example
 *     matchVerbAndNumberOfUrlSegments(event)
 *      .with(['GET', 1], () => getFirstUrlSegmentAndFind('films', event))
 *      .with(['POST', 0], () => getReqBodyAndCreate('films', event))
 *      .otherwise(() => responses.badRequest())
 */
const matchVerbAndNumberOfUrlSegments = (event) =>
  match(tuple([event.httpMethod, length(getUrlSegments(event))]))

/** @type {(collection: string, event: Event) => Promise<Response> } */
const getReqBodyAndCreate = (collection, event) =>
  getReqBody(event).match(
    (body) => db.create(collection, body),
    (err) => Promise.resolve(responses.badRequest(err)),
  )

/** @type {(collection: string, event: Event) => Promise<Response> } */
const getFirstUrlSegmentAndFind = (collection, event) =>
  db.findByRef(collection, getFirstSegment(event))

module.exports = {
  getReqBodyAndCreate,
  getFirstUrlSegmentAndFind,
  matchVerbAndNumberOfUrlSegments,
}

///////////////////////////////////////////////////////////////////////////////

/** @type {(event: Event) => Result<any, Error>} */
const getReqBody = Result.fromThrowable(
  (event) => JSON.parse(event.body),
  (err) => errors.req(String(err)),
)

/** @type {(event: Event) => string} */
const getFirstSegment = (event) => getUrlSegments(event)[0] ?? "<Shouldn't occur>"

/** @type {(event: Event) => string[]} */
const getUrlSegments = (event) =>
  event.path
    .replace(/\.netlify\/functions\/[^/]+/, '')
    .replace(/api\/[^/]+/, '')
    .split('/')
    .filter((s) => s)
