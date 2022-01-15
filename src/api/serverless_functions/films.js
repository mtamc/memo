const { match } = require('ts-pattern')
const responses = require('../utils/responses')
const { matchVerbAndNumberOfUrlSegment, getUrlSegmentAndFind, getReqBodyAndCreate } = require('../utils/router')

exports.handler = async (event, context) =>
  matchVerbAndNumberOfUrlSegment(event)
    .with(['GET', 1], () => getUrlSegmentAndFind('films', event))
    .with(['POST', 0], () => getReqBodyAndCreate('films', event))
    .otherwise(() => responses.badRequest())


