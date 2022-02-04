/** @file entries */
/** @typedef {import('@netlify/functions').Handler} Handler */
const responses = require('../utils/responses')
const {
  getAllEntriesForUser,
  createNewUserListEntry,
  updateEntry,
  deleteEntry,
} = require('../controllers/entries')
const { matchVerbAndNumberOfUrlSegments } = require('../router')

/** @type Handler */
exports.handler = async (event, context) =>
  matchVerbAndNumberOfUrlSegments(event)

    // GET /api/entries/:type/:username/:limit?
    .with(['GET', 2], () => getAllEntriesForUser(event))
    .with(['GET', 3], () => getAllEntriesForUser(event))

    // POST /api/entries/:type
    .with(['POST', 1], () => createNewUserListEntry(event, context))

    // PATCH /api/entries/:type/:dbRef
    .with(['PATCH', 2], () => updateEntry(event, context))

    // DELETE /api/entries/:type/:dbRef
    .with(['DELETE', 2], () => deleteEntry(event, context))

    .otherwise(() => responses.notFound())
