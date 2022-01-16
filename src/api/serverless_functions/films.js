/** @typedef {import('@netlify/functions').Handler} Handler */
const { match } = require('ts-pattern')
const responses = require('../utils/responses')
const {
  matchVerbAndNumberOfUrlSegments,
  getFirstUrlSegmentAndFind,
  getReqBodyAndCreate
} = require('../utils/router')

/** @type Handler */
exports.handler = async (event, context) =>
  matchVerbAndNumberOfUrlSegments(event)
    .with(['GET', 1], () => getFirstUrlSegmentAndFind('films', event))
    .with(['POST', 0], () => getReqBodyAndCreate('films', event))
    .otherwise(() => responses.badRequest())


