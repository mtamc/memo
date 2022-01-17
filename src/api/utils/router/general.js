/**
 * @file Routing function that do not relate to a specific domain
 */
/** @typedef {import('@netlify/functions').HandlerEvent} Event */
/** @typedef {import('@netlify/functions').HandlerContext} Context */
/** @typedef {import('../responses').Response} Response */
/** @typedef {import('../errors').Error} Error */
/** @typedef {import('../parsers').ValidCollection} ValidCollection */
const db = require('../db')
const { match } = require('ts-pattern')
const { length } = require('ramda')
const { tuple } = require('../general')
const { getUrlSegments } = require('./utils')

/**
 * This is the main routing utility we use in our Netlify functions.
 * @param {Event} event
 * @example
 *     matchVerbAndNumberOfUrlSegments(event)
 *      .with(['GET', 1], () => getFirstUrlSegmentAndFindByRef('films', event))
 *      .with(['POST', 0], () => getReqBodyAndCreate('films', event))
 *      .otherwise(() => responses.badRequest())
 */
const matchVerbAndNumberOfUrlSegments = (event) =>
  match(tuple([event.httpMethod, length(getUrlSegments(event))]))

module.exports = {
  matchVerbAndNumberOfUrlSegments,
}
