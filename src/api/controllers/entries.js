/** @typedef {import('@netlify/functions').HandlerEvent} Event */
/** @typedef {import('@netlify/functions').HandlerContext} Context */
/** @typedef {import('../utils/parsers').ValidCollection} ValidCollection */
/** @typedef {import('../utils/errors').Error} Error */
/** @typedef {import('../utils/responses').Response} Response */
const responses = require('../utils/responses')
const { Result, combine, err, ok, okAsync } = require('neverthrow')
const errors = require('../utils/errors')
const { getUserId, getSegment, getReqBody, findIdOfName } = require('./utils')
const { pair, triplet, toPromise } = require('../utils/general')
const db = require('../utils/db/')
const { match } = require('ts-pattern')

/** @type {(event: Event) => Promise<Response>} */
const getAllEntriesForUser = (event) => toPromise(
  combine(pair([
    findIdOfName(getSegment(1, event)),
    toEntryCollection(getSegment(0, event)).asyncAndThen(okAsync),
  ]))
    .map(getUserEntries)
    .mapErr(responses.fromError)
)

/** @type {(event: Event, context: Context) => Promise<Response>} */
const createNewUserListEntry = (event, context) => toPromise(
  combine(triplet([
    getUserId(context),
    getReqBody(event),
    toEntryCollection(getSegment(0, event)),
  ]))
  .asyncMap(createEntry)
  .mapErr(responses.fromError)
)

module.exports = {
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

/** @type {([uid, col]: [string, ValidCollection]) => Promise<any>} */
const getUserEntries = ([uid, col]) =>
  db.findAllByField(col, 'userId', uid)

/** @type {([userId, body, collection]: [string, any, ValidCollection]) => Promise<any>} */
const createEntry = ([userId, body, collection]) =>
  db.create(collection, { ...body, userId })
