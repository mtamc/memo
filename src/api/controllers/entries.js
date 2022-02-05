/** @typedef {import('@netlify/functions').HandlerEvent} Event */
/** @typedef {import('@netlify/functions').HandlerContext} Context */
/** @typedef {import('../utils/parsers').ValidCollection} ValidCollection */
/** @typedef {import('../utils/errors').Error} Error */
/** @typedef {import('../utils/responses').Response} Response */
const responses = require('../utils/responses')
const { Result, combine, err, ok, okAsync } = require('neverthrow')
const errors = require('../utils/errors')
const { getUserId, getSegment, getReqBody, findIdOfName } = require('./utils')
const { pair, triplet, quad, toPromise, toAsync } = require('../utils/general')
const db = require('../utils/db/')
const { match } = require('ts-pattern')
const { toResponse } = require('../utils/db/into_safe_values')

/** @type {(event: Event) => Promise<Response>} */
const getAllEntriesForUser = (event) => toPromise(
  combine(triplet([
    findIdOfName(getSegment(1, event)),
    toAsync(toEntryCollection(getSegment(0, event))),
    okAsync(getSegment(2, event))
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
  toEntryCollection(getSegment(0, event))
    .asyncAndThen((col) =>
      combine(quad([
        toAsync(getUserId(context)),
        toAsync(getReqBody(event)),
        okAsync(col),
        db.findOneByRef_(col, getSegment(1, event)),
      ]))
    )
    .map(([uid, body, col, entry]) =>
      entry.data.userId === uid
        ? db.updateByRef(col, entry.ref.id, { ...body, updatedDate: Date.now() })
        : responses.unauthorized()
    )
    .mapErr(responses.fromError)
)

/** @type {(event: Event, context: Context) => Promise<Response>} */
const deleteEntry = (event, context) => toPromise(
  toEntryCollection(getSegment(0, event))
    .asyncAndThen((col) =>
      combine(triplet([
        toAsync(getUserId(context)),
        okAsync(col),
        db.findOneByRef_(col, getSegment(1, event)),
      ]))
    )
    .map(([uid, col, entry]) =>
      entry.data?.userId === uid
        ? db.deleteByRef(col, entry.ref.id)
        : responses.unauthorized()
    )
    .mapErr(responses.fromError)
)


module.exports = {
  getAllEntriesForUser,
  createNewUserListEntry,
  updateEntry,
  deleteEntry,
}

////////////////////////////////////////////////////////////////////////////////

/** @type {(segment: string) => Result<ValidCollection, Error>} */
const toEntryCollection = (segment) =>
  match(segment)
    .with('films', () => okEntry('filmEntries'))
    .with('books', () => okEntry('bookEntries'))
    .with('tv', () => okEntry('tvShowEntries'))
    .with('games', () => okEntry('gameEntries'))
    .otherwise(() => err(errors.notFound()))

/** @type {(collection: ValidCollection) => Result<ValidCollection, Error>} */
const okEntry = (collection) => ok(collection)

/** @type {([uid, col, limit]: [string, ValidCollection, string | undefined]) => Promise<any>} */
const getUserEntries = ([uid, col, limit]) => toResponse(toPromise(
  db.findAllUserEntriesWithMetadata_(col, uid, parseInt(limit || "10000000"))
    .map(({ data }) => data.map(({ entry, work }) => ({
      ...entry.data,
      commonMetadata: work.data,
      dbRef: entry.ref.id
    })))
  .mapErr(e => {
    console.log('Investigating why sometimes retrieving entries randomly fails')
    console.log(limit)
    console.log(e)
  })
))

/** @type {([userId, body, collection]: [string, any, ValidCollection]) => Promise<Response>} */
const createEntry = ([userId, body, collection]) =>
  db.create(collection, { ...body, userId, updatedDate: Date.now() })
