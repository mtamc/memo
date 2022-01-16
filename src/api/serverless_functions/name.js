/** @typedef {import('@netlify/functions').Handler} Handler */
const responses = require('../utils/responses')
const { matchVerbAndNumberOfUrlSegments } = require('../utils/router/general')
const { findOwnName, setOwnName } = require('../utils/router/users')

/** @type Handler */
exports.handler = async (event, context) =>
  matchVerbAndNumberOfUrlSegments(event)
    // GET /api/name
    .with(['GET', 0], () => findOwnName(context))
    // GET /api/name/:newName
    .with(['GET', 1], () => setOwnName(event, context))
    .otherwise(() => responses.badRequest())
