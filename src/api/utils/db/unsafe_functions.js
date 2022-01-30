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
const { throwIt } = require('../general')
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

/** @type {(collection: ValidCollection, field: string, value: ExprArg) => Promise<object>} */
const _findAllByField = (collection, field, value) =>
  findAllUnpaginated(Match(at(collection, field), value))

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

module.exports = {
  _findOneByField,
  _findOneByRef,
  _findAllInCollection,
  _findAllByField,
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

/** @type {(set: ExprArg) => Promise<object>} */
const findAllUnpaginated = (set) =>
  db.query(q.Map(Paginate(set, { size: 100000 }), lambdaGet))

const getCollectionDocs = compose(Documents, Collection)

/** @type {(collection: ValidCollection, ref: ExprArg) => Expr } */
const getDocRef = (collection, ref) =>
  Ref(Collection(collection), ref)
