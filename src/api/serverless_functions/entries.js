/** @file entries */
/** @typedef {import('@netlify/functions').Handler} Handler */
const responses = require('../utils/responses')
const { getAllEntriesForUser } = require('../utils/router/entries')
const { matchVerbAndNumberOfUrlSegments, } = require('../utils/router/general')

/** @type Handler */
exports.handler = async (event, context) =>
  matchVerbAndNumberOfUrlSegments(event)
    .with(['GET', 2], () =>
      getAllEntriesForUser(event),
    )
    .otherwise(() => responses.notFound())
