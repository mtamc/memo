/** @typedef {import('@netlify/functions').HandlerEvent} Event */
/** @typedef {import('@netlify/functions').HandlerContext} Context */
/** @typedef {import('../parsers').ValidCollection} ValidCollection */
/** @typedef {import('../errors').Error} Error */
/** @typedef {import('../responses').Response} Response */
const responses = require('../responses')
const { Result, ResultAsync, combine, err, ok, okAsync } = require('neverthrow')
const errors = require('../errors')
const { getUserId, getSegment, getReqBody } = require('./utils')
const { identity } = require('ramda')
const { tuple, triplet } = require('../general')
const db = require('../db/')
const { match } = require('ts-pattern')
const { findIdOfName_ } = require('./users')

/** @type {(event: Event, context: Context) => Promise<Response>} */
const getFirstUrlSegmentAsEntryTypeAndFindByUser = (event, context) => {
  const userId = getUserId(context)
  const collection = toEntryCollection(getSegment(0, event))
  const entries = combine(tuple([userId, collection])).asyncAndThen(
    ([uid, col]) =>
      ResultAsync.fromPromise(
        db.findOneByField(col, 'userId', uid),
        errors.notFound,
      ),
  )

  return entries.match(identity, responses.fromError)
}

/** @type {(event: Event) => Promise<Response>} */
const getAllEntriesForUser = (event) =>
  combine(
    tuple([
      toEntryCollection(getSegment(0, event)).asyncAndThen(okAsync),
      findIdOfName_(getSegment(1, event)),
    ]),
  )
    .map(([collection, id]) => db.findAllByField(collection, 'userId', id))
    .match(identity, responses.fromError)

/** @type {(event: Event, context: Context) => Promise<Response>} */
const createNewUserListEntry = (event, context) =>
  combine(
    triplet([
      getUserId(context),
      getReqBody(event),
      toEntryCollection(getSegment(0, event)),
    ]),
  )
    .asyncMap(([userId, body, collection]) =>
      db.create(collection, { ...body, userId }),
    )
    .match(identity, responses.fromError)

module.exports = {
  getFirstUrlSegmentAsEntryTypeAndFindByUser,
  getAllEntriesForUser,
  createNewUserListEntry
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
