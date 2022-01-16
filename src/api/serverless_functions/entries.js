/** @file entries */
/** @typedef {import('@netlify/functions').Handler} Handler */
const responses = require('../utils/responses')
const {
  matchVerbAndNumberOfUrlSegments,
  getFirstUrlSegmentAsEntryTypeAndFindByUser,
  getFirstUrlSegmentAsEntryTypeAndCreateForUser,
} = require('../utils/router/general')

/** @type Handler */
exports.handler = async (event, context) =>
  matchVerbAndNumberOfUrlSegments(event)
    .with(['GET', 1], () =>
      getFirstUrlSegmentAsEntryTypeAndFindByUser(event, context),
    )
    .with(['POST', 1], () =>
      getFirstUrlSegmentAsEntryTypeAndCreateForUser(event, context),
    )
    .otherwise(() => responses.badRequest())
