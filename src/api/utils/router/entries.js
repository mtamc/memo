/** @typedef {import('@netlify/functions').HandlerEvent} Event */
/** @typedef {import('@netlify/functions').HandlerContext} Context */
/** @typedef {import('../parsers').ValidCollection} ValidCollection */
/** @typedef {import('../errors').Error} Error */
/** @typedef {import('../responses').Response} Response */
const responses = require('../responses')
const { Result, ResultAsync, combine, err, ok } = require('neverthrow')
const errors = require('../errors')
const { getUserId, getSegment } = require('./utils')
const { identity } = require('ramda')
const { tuple } = require('../general')
const db = require('../db')
const { match } = require('ts-pattern')

/** @type {(event: Event, context: Context) => Promise<Response>} */
const getFirstUrlSegmentAsEntryTypeAndFindByUser = (event, context) => {
  const userId = getUserId(context)
  const collection = toEntryCollection(getSegment(0, event))
  const entries = combine(tuple([userId, collection])).asyncAndThen(
    ([uid, col]) => ResultAsync.fromPromise(
      db.findAllByField(col, 'userId', uid),
      errors.notFound
    )
  )

  return entries.match(identity, responses.fromError)
}

module.exports = {
  getFirstUrlSegmentAsEntryTypeAndFindByUser,
}

////////////////////////////////////////////////////////////////////////////////

/** @type {(segment: string) => Result<ValidCollection, Error>} */
const toEntryCollection = (segment) =>
  match(segment)
    .with('films', () => okEntry('filmEntries'))
    .with('books', () => okEntry('bookEntries'))
    .with('tv_shows', () => okEntry('tvShowEntries'))
    .with('games', () => okEntry('gameEntries'))
    .otherwise(() => err(errors.notFound()))

/** @type {(collection: ValidCollection) => Result<ValidCollection, Error>} */
const okEntry = (collection) => ok(collection)

