const faunadb = require('faunadb')
const NT = require('neverthrow')
const responses = require('../responses')
const { identity } = require('ramda')
const { match } = require('ts-pattern')
const { dbError } = require('../errors')
const { Get, Ref, Collection, Create } = faunadb.query

const db = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET })

const query = (queryContent) =>
  NT.fromPromise(db.query(queryContent), identity).match(
    responses.ok,
    dbErrToResponse,
  )

const dbErrToResponse = (err) => {
  const response = match(err.name)
    .with('BadRequest', () => responses.badRequest)
    .with('NotFound', () => responses.notFound)
    .otherwise(() => responses.internalError)

  return response(dbError(err))
}

const findByRef = (collection, ref) =>
  query(Get(Ref(Collection(collection), ref)))

const create = (collection, data) =>
  query(Create(Collection(collection), { data }))

module.exports = {
  findByRef,
  create,
  dbErrToResponse,
}
