const { match } = require('ts-pattern')
const responses = require('../utils/responses')
const { segments, getUrlSegmentAndFind, getReqBodyAndCreate } = require('../utils/router')

exports.handler = async (event, context) =>
  match([event.httpMethod, segments(event).length])
    .with(['GET', 1], () => getUrlSegmentAndFind('films', event))
    .with(['POST', 0], () => getReqBodyAndCreate('films', event))
    .otherwise(() => responses.badRequest())
