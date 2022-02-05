/** @typedef {import('@netlify/functions').Handler} Handler */
const responses = require('../utils/responses')
const { matchVerbAndNumberOfUrlSegments, } = require('../router')
const { getUserFromName } = require('../controllers/user')

/** @type Handler */
exports.handler = async (event, context) =>
  matchVerbAndNumberOfUrlSegments(event)

    // GET /api/user/:username
    .with(['GET', 1], () => getUserFromName(event))

    .otherwise(() => responses.notFound())
