/** @typedef {import('@netlify/functions').Handler} Handler */
const responses = require('../utils/responses')
const { matchVerbAndNumberOfUrlSegments, } = require('../router')
const { findOwnName, setOwnName, getUserIdFromName } = require('../controllers/name')

/** @type Handler */
exports.handler = async (event, context) =>
  matchVerbAndNumberOfUrlSegments(event)

    // GET /api/name
    .with(['GET', 0], () => findOwnName(context))

    // GET /api/name/:someName
    .with(['GET', 1], () => getUserIdFromName(event))

    // GET /api/name/:newName
    .with(['POST', 0], () => setOwnName(event, context))

    .otherwise(() => responses.badRequest())
