/** @file entries */
/** @typedef {import('@netlify/functions').Handler} Handler */
const responses = require('../utils/responses')
const {
  getReview,
} = require('../controllers/reviews')
const { matchVerbAndNumberOfUrlSegments } = require('../router')

/** @type Handler */
exports.handler = async (event, context) =>
  matchVerbAndNumberOfUrlSegments(event)

    // GET /api/reviews/:type/:entryId
    .with(['GET', 2], () => getReview(event))

    .otherwise(() => responses.notFound())
