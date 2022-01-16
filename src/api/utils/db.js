/**
 * @file This file exports functions that take DB query parameters,
 * perform the query and return a Netlify HTTP response.
 *
 * As much as possible, it these functions should not be used in
 * Netlify functions directly. Instead, create functions in the
 * `router` module which pre-parse the HTTP request before
 * calling these DB functions.
 *
 * Learn to make FaunaDb queries:
 * https://fireship.io/lessons/fauna-db-quickstart/
 */
/** @typedef {import('faunadb').Client} Client */
/** @typedef {import('faunadb').ExprArg} ExprArg */
/** @typedef {import('zod').ZodType} ZodType */
/** @typedef {import('./responses').Response} Response */
/** @typedef {import('./parsers').ValidCollection} ValidCollection */
/** @typedef {import('./errors').Error} Error */
const faunadb = require('faunadb')
const responses = require('./responses')
const { match } = require('ts-pattern')
const errors = require('./errors')
const q = faunadb.query
const { Get, Ref, Collection, Create, Match, Index, Paginate, Documents, Lambda, Update, Select } = q
const parsers = require('./parsers/')
const { fromPromise, ResultAsync } = require('neverthrow')

/** @type {(collection: ValidCollection, ref: ExprArg) => Promise<Response>} */
const findByRef = (collection, ref) =>
  query(Get(Ref(Collection(collection), ref)))

/**
 * NOTE: You must create a FaunaDB index named ${collection}__${field}
 * @type {(collection: ValidCollection, field: string, value: ExprArg) => Promise<Response>}
 */
const findOneByField = (collection, field, value) =>
  query(Get(Match(Index(`${collection}__${field}`), value)))

/**
 * NOTE: You must create a FaunaDB index named ${collection}__${field}
 * @type {(collection: ValidCollection, field: string, value: ExprArg) => ResultAsync<any, Error>}
 */
const findOneByField_ = (collection, field, value) =>
  query_(Get(Match(Index(`${collection}__${field}`), value)))

/**
 * NOTE: You must create a FaunaDB index named ${collection}__${field}
 * @type {(collection: ValidCollection, field: string, value: ExprArg) => Promise<Response>}
 */
const findAllByField = (collection, field, value) =>
  query(q.Map(
    Paginate(Match(Index(`${collection}__${field}`), value)),
    Lambda(x => Get(x))
  ))

/** @type {(collection: ValidCollection) => Promise<Response>} */
const findAll = (collection) =>
  query(q.Map(
    Paginate(Documents(Collection(collection))),
    Lambda(x => Get(x))
  ))

/** @type {(ref: ExprArg, updat: ExprArg) => Promise<Response>} */
const updateByRef = (ref, update) =>
  query(Update(Ref(ref), update))

/** @type {(collection: ValidCollection, data: ExprArg) => Promise<Response>} */
const create = (collection, data) =>
  parsers[collection](data).match(
    (data) => query(Create(Collection(collection), { data })),
    (err) => Promise.resolve(responses.badRequest(err)),
  )

module.exports = {
  findByRef,
  findAll,
  findAllByField,
  findOneByField,
  findOneByField_,
  updateByRef,
  create
}

///////////////////////////////////////////////////////////////////////////////

/** @type {Client} */
const db = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET })

/** @type {(queryContent: ExprArg) => Promise<Response>} */
const query = (queryContent) =>
  db
    .query(queryContent)
    .then((doc) => responses.ok(doc)) // Dunno why the typechecker requires pointful here
    .catch(dbErrToResponse)

/** @type {(queryContent: ExprArg) => ResultAsync<object, Error> } */
const query_ = (queryContent) =>
  fromPromise(db.query(queryContent), errors.db)

/** @type {(err: any) => Response} */
const dbErrToResponse = (err) => {
  const response = match(err.name)
    .with('BadRequest', () => responses.badRequest)
    .with('NotFound', () => responses.notFound)
    .otherwise(() => responses.internalError)

  return response(errors.db(err?.description))
}
