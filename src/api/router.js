/**
 * @file A minimalistic Netlify router that matches on
 * HTTP verb and number of URL segments
 */
/** @typedef {import('@netlify/functions').HandlerEvent} Event */
/** @typedef {import('@netlify/functions').HandlerContext} Context */
/** @typedef {import('./utils/responses').Response} Response */
/** @typedef {import('./utils/errors').Error} Error */
/** @typedef {import('./utils/parsers').ValidCollection} ValidCollection */
const { match } = require('ts-pattern')
const { length } = require('ramda')
const { tuple } = require('./utils/general')
const { getUrlSegments } = require('./controllers/utils')

/**
 * This is the main routing utility we use in our Netlify functions.
 * @param {Event} event
 * @example
 *     matchVerbAndNumberOfUrlSegments(event)
 *      .with(['GET', 1], () => someExternalController(event, context))
 *      .with(['POST', 0], () => someOtherControllerFunction(event, context))
 *      .otherwise(() => responses.notFound())
 */
const matchVerbAndNumberOfUrlSegments = (event) =>
  match(tuple([event.httpMethod, length(getUrlSegments(event))]))

module.exports = {
  matchVerbAndNumberOfUrlSegments,
}
