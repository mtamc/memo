/** @typedef {import('@netlify/functions').Handler} Handler */
const responses = require('../utils/responses')
const {
  matchVerbAndNumberOfUrlSegments,
  withFirstSegmentAsUserFindAll,
  getReqBodyAndCreate
} = require('../utils/router')

/** @type Handler */
exports.handler = async (event, context) =>
  matchVerbAndNumberOfUrlSegments(event)
    .with(['GET', 1], () => withFirstSegmentAsUserFindAll('films', event))
    .with(['POST', 0], () => getReqBodyAndCreate('films', event))
    .otherwise(() => responses.badRequest())


