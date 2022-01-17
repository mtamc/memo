/**
 * @file This module exports converters which take
 * an unsafe Promise of a DB response which may throw,
 * and return either safe Promises of a HTTP response
 * or safe ResultAsyncs of the DB-returned object.
 */
/** @typedef {import('../responses').Response} Response */
/** @typedef {import('../errors').Error} Error */
const responses = require('../responses')
const { match } = require('ts-pattern')
const { fromPromise, ResultAsync } = require('neverthrow')
const errors = require('../errors')

/** @type {(returnedDocument: Promise<any>) => Promise<Response>} */
const toResponse = (returnedDocument) =>
  returnedDocument.then(responses.ok).catch(dbErrToResponse)

/** @type {(returnedDocument: Promise<any>) => ResultAsync<object, Error> } */
const toResult = (returnedDocument) =>
  fromPromise(returnedDocument, errors.db)

module.exports = {
  toResponse,
  toResult,
}

///////////////////////////////////////////////////////////////////////////////

/** @type {(err: any) => Response} */
const dbErrToResponse = (err) => {
  const response = match(err.name)
    .with('BadRequest', () => responses.badRequest)
    .with('NotFound', () => responses.notFound)
    .otherwise(() => responses.internalError)

  return response(errors.db(err?.description))
}
