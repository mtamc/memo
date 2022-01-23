/** @typedef {import('@netlify/functions').Handler} Handler */
const responses = require('../utils/responses')
const {
  searchForWork,
  retrieveWork,
} = require('../controllers/works')
const { matchVerbAndNumberOfUrlSegments } = require('../router')
const { getUrlSegments } = require('../controllers/utils')

/** @type Handler */
exports.handler = async (event, context) =>
  matchVerbAndNumberOfUrlSegments(event)

    .with(['GET', 3], () =>

        // GET /api/works/search/:type/:search
        getUrlSegments(event)[0] === 'search'   ? searchForWork(event)

        // GET /api/works/retrieve/:type/:ref
      : getUrlSegments(event)[0] === 'retrieve' ? retrieveWork(event)

      : responses.notFound()
    )

    .otherwise(() => responses.notFound())
