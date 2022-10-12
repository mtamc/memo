/** @typedef {import('@netlify/functions').HandlerEvent} Event */
/** @typedef {import('@netlify/functions').HandlerContext} Context */
/** @typedef {import('../utils/parsers').ValidCollection} ValidCollection */
/** @typedef {import('../utils/errors').Error} Error */
/** @typedef {import('../utils/responses').Response} Response */
const responses = require('../utils/responses')
const { Result, combine, err, ok, okAsync } = require('neverthrow')
const errors = require('../utils/errors')
const { getUserId, getSegment, getReqBody, findIdOfName } = require('./utils')
const { triplet, quad, toPromise, toAsync } = require('../utils/general')
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
const createNewUserListEntry = (event) => toPromise(
  combine(triplet([
    getUserId(event),
    getReqBody(event),
    toEntryCollection(getSegment(0, event)),
  ]))
    .asyncMap(createEntry)
    .mapErr(responses.fromError)
)

/** @type {(event: Event, context: Context) => Promise<Response>} */
const updateEntry = (event) => toPromise(
  toEntryCollection(getSegment(0, event))
    .asyncAndThen((col) =>
      combine(quad([
        toAsync(getUserId(event)),
        toAsync(getReqBody(event)),
        okAsync(col),
        db.findOneByRef_(col, getSegment(1, event)),
      ]))
    )
    .map(([uid, body, col, entry]) =>
      entry.data.userId === uid
        ? updateEntry_(uid, body, col, entry)
        : responses.unauthorized()
    )
    .mapErr(responses.fromError)
)

/** @type {(event: Event, context: Context) => Promise<Response>} */
const deleteEntry = (event) => toPromise(
  toEntryCollection(getSegment(0, event))
    .asyncAndThen((col) =>
      combine(triplet([
        toAsync(getUserId(event)),
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
  db.findAllUserEntriesWithMetadata_(col, uid, parseInt(limit ?? '') || undefined)
    .map(({ data }) => data.map(({ entry, work }) => ({
      ...entry.data,
      commonMetadata: work.data,
      dbRef: entry.ref.id
    })))
))

/** @type {([userId, body, collection]: [string, any, ValidCollection]) => Promise<Response>} */
const createEntry = ([userId, body, collection]) => {
  const { review, ...entryWithoutReview } = body
  /** @type any */
  const reviewCollection = collection.replace('Entries', 'Reviews')

  return db.create_(collection, { ...entryWithoutReview, userId, updatedDate: Date.now() })
    .andThen((entry) => db.create_(reviewCollection, {
      text: review,
      entryRef: entry.ref.id,
    }))
    .match(responses.ok, responses.internalError)
}

const updateEntry_ = (uid, body, col, entry) => {
  const { review, ...entryWithoutReview } = body

  /** @type any */
  const reviewCollection = col.replace('Entries', 'Reviews')

  db.updateByRef(col, entry.ref.id, { ...entryWithoutReview, updatedDate: Date.now() })

  db.findOneByField_(reviewCollection, 'entryRef', entry.ref.id)
    .andThen(({ ref }) =>
      ref
        ? db.updateByRef_(reviewCollection, ref.id, { text: review })
        // Shouldn't be needed, but just in case.
        : db.create_(reviewCollection, {
            text: review,
            entryRef: entry.ref.id,
          })
    )

  return entry.data.userId === uid
    ? db.updateByRef(col, entry.ref.id, { ...body, updatedDate: Date.now() })
    : responses.unauthorized()
}

