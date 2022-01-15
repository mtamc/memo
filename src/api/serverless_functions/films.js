const { match } = require('ts-pattern')
const responses = require('../utils/responses')
const { matchVerbAndNumberOfUrlSegments, getUrlSegmentAndFind, getReqBodyAndCreate } = require('../utils/router')

exports.handler = async (event, context) =>
  matchVerbAndNumberOfUrlSegments(event)
    .with(['GET', 1], () => getUrlSegmentAndFind('films', event))
    .with(['POST', 0], () => getReqBodyAndCreate('films', event))
    .otherwise(() => responses.badRequest())


