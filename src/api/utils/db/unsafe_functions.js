/**
 * @file These functions may throw and should be considered
 * private to this module. They must be converted to safe
 * promises or safe ResultAsyncs with toPromise or toResult
 * pefore being re-exported.
 */
/** @typedef {import('../parsers').ValidCollection} ValidCollection */
/** @typedef {import('faunadb').ExprArg} ExprArg */
/** @typedef {import('faunadb').Expr} Expr */
const faunadb = require('faunadb')
const { db } = require('./db')
const { compose } = require('ramda')
const { throwIt, log } = require('../general')
const parsers = require('../parsers/')
const q = faunadb.query
const {
  Get,
  Ref,
  Collection,
  Create,
  Match,
  Index,
  Paginate,
  Documents,
  Lambda,
  Update,
  Delete,
} = q

/** @type {(collection: ValidCollection, field: string, value: ExprArg) => Promise<object>} */
const _findOneByField = (collection, field, value) =>
  findOne(docsInCollectionWithField(collection, field, value))

/** @type {(collection: ValidCollection, ref: ExprArg) => Promise<object>} */
const _findOneByRef = (collection, ref) =>
  findOne(getDocRef(collection, ref))

/** @type {(collection: ValidCollection) => Promise<object>} */
const _findAllInCollection = (collection) =>
  findAllUnpaginated(getCollectionDocs(collection))

/** @type {(collection: ValidCollection, field: string, value: ExprArg, limit?: number) => Promise<object>} */
const _findAllByField = (collection, field, value, limit) =>
  findAllUnpaginated(Match(at(collection, field), value), limit)

/** @type {(collection: ValidCollection, ref: ExprArg, update: ExprArg) => Promise<object>} */
const _updateOneByRef = (collection, ref, update) =>
  updateOne(getDocRef(collection, ref), { data: update })

/** @type {(collection: ValidCollection, ref: ExprArg) => Promise<object>} */
const _deleteOneByRef = (collection, ref) =>
  db.query(Delete(getDocRef(collection, ref)))

/** @type {(collection: ValidCollection, data: ExprArg) => Promise<object>} */
const _create = (collection, data) =>
  parsers[collection](data).match(
    (validDoc) => unsafeCreateDoc(collection, validDoc),
    (err) => throwIt(err)
  )

// For now some code is duplicated, we'll DRY this out later
/** @type {(collection: ValidCollection, userId: string, limit?: number) => Promise<object>} */
const _findAllUserEntriesWithMetadata = async (collection, userId, limit) => {
  let continuation = undefined
  let results = []
  const workCollection = {
    filmEntries: 'films',
    gameEntries: 'games',
    tvShowEntries: 'tvShows',
    bookEntries: 'books',
  }[collection]

  do {
    const after = continuation ? { after: continuation } : {}
    const resp =
      await db.query(
        q.Map(
          Paginate(Match(at(collection, "userId"), userId), { size: 400, ...after }),
          q.Lambda(
            'entry',
            q.Let(
              {
                entry: q.Get(q.Var('entry')),
                work: q.Get(
                  q.Ref(
                    Collection(workCollection),
                    q.Select(['data', 'workRef'], q.Var('entry'))
                  )
                )
              },
              {
                entry: q.Var('entry'),
                work: q.Var('work'),
              }
            )
          )
        )
      )

    continuation = resp.after
    results = [...results, ...resp.data ?? []]
  } while (continuation)

  const resultsByLastUpdatedIfPossible =
    [...results].sort((a, b) => {
      return (b.data?.updatedDate ?? 0) - (a.data?.updatedDate ?? 0)
    })

  const finalResults =
    limit
      ? resultsByLastUpdatedIfPossible.slice(0, limit)
      : resultsByLastUpdatedIfPossible

  return { data: finalResults }
}
module.exports = {
  _findOneByField,
  _findOneByRef,
  _findAllInCollection,
  _findAllByField,
  _findAllUserEntriesWithMetadata,
  _updateOneByRef,
  _create,
  _deleteOneByRef,
}

///////////////////////////////////////////////////////////////////////////////

/** @type {(ref: faunadb.ExprArg) => Promise<object>} */
const findOne = (ref) =>
  db.query(Get(ref))
    .catch((e) => e.name === 'NotFound' ? {} : throwIt(e))

/** @type {(ref: ExprArg, params: ExprArg) => Promise<object>} */
const updateOne = (ref, params) =>
  db.query(Update(ref, params))

/** @type {(ref: ExprArg, params: ExprArg) => Promise<object>} */
const unsafeCreateDoc = (collection, data) =>
  db.query(Create(Collection(collection), { data }))

/** @type {(collection: ValidCollection, field: string) => Expr} */
const at = (collection, field) => Index(`${collection}__${field}`)

/** @type {(collection: ValidCollection, field: string, value: ExprArg) => Expr} */
const docsInCollectionWithField = (collection, field, value) =>
  Match(at(collection, field), value)

const lambdaGet = Lambda((x) => Get(x))


/** @type {(set: ExprArg, limit?: number) => Promise<object>} */
const findAllUnpaginated = async (set, limit) => {
  let continuation = undefined
  let results = []
  do {
    const after = continuation ? { after: continuation } : {}
    const resp =
      await db.query(q.Map(Paginate(set, { size: 400, ...after }), lambdaGet))

    continuation = resp.after
    results = [...results, ...resp.data ?? []]
  } while (continuation)

  // It'd be better to let the consumer specify if they want this behavior
  // but let's roll with hardcoding it for simplicity for now
  const resultsByLastUpdatedIfPossible =
    [...results].sort((a, b) => {
      return (b.data?.updatedDate ?? 0) - (a.data?.updatedDate ?? 0)
    })

  const finalResults =
    limit
      ? resultsByLastUpdatedIfPossible.slice(0, limit)
      : resultsByLastUpdatedIfPossible

  return { data: finalResults }
}

const getCollectionDocs = compose(Documents, Collection)

/** @type {(collection: ValidCollection, ref: ExprArg) => Expr } */
const getDocRef = (collection, ref) =>
  Ref(Collection(collection), ref)
