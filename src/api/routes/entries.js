/** @file entries */
/** @typedef {import('@netlify/functions').Handler} Handler */
const responses = require('../utils/responses')
const {
  getAllEntriesForUser,
  createNewUserListEntry,
} = require('../controllers/entries')
const { matchVerbAndNumberOfUrlSegments } = require('../router')

/** @type Handler */
exports.handler = async (event, context) =>
  matchVerbAndNumberOfUrlSegments(event)

    // GET /api/entries/:type/:username
    .with(['GET', 2], () => getAllEntriesForUser(event))

    // POST /api/entries/:type
    .with(['POST', 1], () => createNewUserListEntry(event, context))

    .otherwise(() => responses.notFound())
