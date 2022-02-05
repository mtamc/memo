/** @typedef {import('@netlify/functions').Handler} Handler */
const responses = require('../utils/responses')
const { matchVerbAndNumberOfUrlSegments, } = require('../router')
const { setBio } = require('../controllers/bio')

/** @type Handler */
exports.handler = async (event, context) =>
  matchVerbAndNumberOfUrlSegments(event)

    // POST /api/bio
    .with(['POST', 0], () => setBio(event, context))

    .otherwise(() => responses.notFound())
