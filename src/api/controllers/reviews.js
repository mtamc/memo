/** @typedef {import('../utils/responses').Response} Response */
/** @typedef {import('@netlify/functions').HandlerEvent} Event */
const { getSegment } = require('./utils')
const responses = require('../utils/responses')
const db = require('../utils/db/')
const faunadb = require('faunadb')
const q = faunadb.query

/** @type {(event: Event) => Promise<Response>} */
const getReview = async (event) => {
  const entryType = getSegment(0, event)
  const entryId = getSegment(1, event)

  const collection = {
    films: 'filmReviews',
    books: 'bookReviews',
    tv: 'tvShowReviews',
    games: 'gameReviews',
  }[entryType]

  return collection != null
    ? db.findOneByField(collection, 'entryRef', entryId)
    : responses.notFound()
}

module.exports = {
  getReview,
}
