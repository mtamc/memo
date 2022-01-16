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
/** @typedef {import('../responses').Response} Response */
const faunadb = require('faunadb')
const responses = require('../responses')
const { match } = require('ts-pattern')
const errors = require('../errors')
const { Get, Ref, Collection, Create } = faunadb.query

/** @type {(collection: ExprArg, ref: ExprArg) => Promise<Response>} */
const findByRef = (collection, ref) =>
  query(Get(Ref(Collection(collection), ref)))

/** @type {(collection: ExprArg, data: ExprArg) => Promise<Response>} */
const create = (collection, data) =>
  query(Create(Collection(collection), { data }))

module.exports = {
  findByRef,
  create,
}

///////////////////////////////////////////////////////////////////////////////

/** @type {Client} */
const db = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET })

/** @type {(queryContent: ExprArg) => Promise<Response>} */
const query = (queryContent) =>
  db.query(queryContent)
    .then(doc => responses.ok(doc)) // Dunno why the typechecker requires pointful here
    .catch(dbErrToResponse)

/** @type {(err: any) => Response} */
const dbErrToResponse = (err) => {
  const response = match(err.name)
    .with('BadRequest', () => responses.badRequest)
    .with('NotFound', () => responses.notFound)
    .otherwise(() => responses.internalError)

  return response(errors.db(err))
}

