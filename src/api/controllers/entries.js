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
const {toResponse} = require('../utils/db/into_safe_values')
const {identity} = require('ramda')

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

/** @type {(event: Event, context: Context) => Promise<Response>} */
const updateEntry = (event, context) => toPromise(
  combine(triplet([
    getUserId(context),
    getReqBody(event),
    toEntryCollection(getSegment(0, event)),
  ]))
  .asyncAndThen(([uid, body, col]) =>
    combine(triplet([
      okAsync(uid),
      okAsync(body),
      db.findOneByRef_(col, getSegment(1, event))
    ]))
  )
  .map(([uid, body, entry]) =>
    entry.data.userId === uid
      ? updateEntry_([entry.ref.id, body])
      : responses.unauthorized()
)
  .mapErr(responses.fromError)
)

module.exports = {
  getAllEntriesForUser,
  createNewUserListEntry,
  updateEntry
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
const getUserEntries = ([uid, col]) => toResponse(toPromise(
  db.findAllByField_(col, 'userId', uid)
    .map(({ data }) => data.map((doc) => ({
      ...doc.data,
      dbRef: doc.ref.id
    })))
))

/** @type {([userId, body, collection]: [string, any, ValidCollection]) => Promise<Response>} */
const createEntry = ([userId, body, collection]) =>
  db.create(collection, { ...body, userId })

/** @type {([refId, body]: [any, any]) => Promise<Response>} */
const updateEntry_ = ([refId, body]) =>
  db.updateByRef(refId, body)
