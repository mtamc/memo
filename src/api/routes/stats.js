/** @typedef {import('@netlify/functions').Handler} Handler */
const responses = require('../utils/responses')
const {
  getUserStats
} = require('../controllers/stats')
const { matchVerbAndNumberOfUrlSegments } = require('../router')

/** @type Handler */
exports.handler = async (event, context) =>
  matchVerbAndNumberOfUrlSegments(event)

    // GET /api/stats/:username
    .with(['GET', 1], () => getUserStats(event))

    .otherwise(() => responses.notFound())
