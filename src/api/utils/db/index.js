/**
 * @file This file exports SAFE functions that take DB query parameters,
 * perform the query and return a Netlify HTTP response or a ResultAsync.
 *
 * Functions SUFFIXED with `_` should return a ResultAsync<obj, Error>.
 * Other functions should return a Promise<Response>
 *
 * Functions PREFIXED with `_` are unsafe (may throw) and should
 * be considered private to this module.
 *
 * Basics to make FaunaDb queries:
 * https://fireship.io/lessons/fauna-db-quickstart/
 *
 * Function reference:
 * https://docs.fauna.com/fauna/current/api/fql/functions/
 *
 * NOTE: In order to find by field, you must create FaunaDB indexes
 * in the dashboard named `${collection}__${field}`
 */
/** @typedef {import('faunadb').ExprArg} ExprArg */
/** @typedef {import('faunadb').Expr} Expr */
/** @typedef {import('zod').ZodType} ZodType */
/** @typedef {import('../responses').Response} Response */
/** @typedef {import('../parsers').ValidCollection} ValidCollection */
/** @typedef {import('../errors').Error} Error */
const { ResultAsync } = require('neverthrow')
const { _findOneByField, _findOneByRef, _findAllByField, _findAllInCollection, _updateOneByRef, _create, _deleteOneByRef } = require('./unsafe_functions')
const {compose} = require('ramda')
const { toResponse, toResult } = require('./into_safe_values')

/** @type {(collection: ValidCollection, ref: ExprArg) => Promise<Response>} */
const findOneByRef = compose(toResponse, _findOneByRef)

/** @type {(collection: ValidCollection, ref: ExprArg) => ResultAsync<any, Error>} */
const findOneByRef_ = compose(toResult, _findOneByRef)

/** @type {(collection: ValidCollection, field: string, value: ExprArg) => Promise<Response>} */
const findOneByField = compose(toResponse, _findOneByField)

/** @type {(collection: ValidCollection, field: string, value: ExprArg) => ResultAsync<any, Error>} */
const findOneByField_ = compose(toResult, _findOneByField)

/** @type {(collection: ValidCollection, field: string, value: ExprArg, limit?: number) => Promise<Response>} */
const findAllByField = compose(toResponse, _findAllByField)

/** @type {(collection: ValidCollection, field: string, value: ExprArg, limit?: number) => ResultAsync<any, Error>} */
const findAllByField_ = compose(toResult, _findAllByField)

/** @type {(collection: ValidCollection) => Promise<Response>} */
const findAll = compose(toResponse, _findAllInCollection)

/** @type {(collection: ValidCollection, ref: ExprArg, update: ExprArg) => Promise<Response>} */
const updateByRef = compose(toResponse, _updateOneByRef)

/** @type {(collection: ValidCollection, ref: ExprArg, update: ExprArg) => ResultAsync<any, Error>} */
const updateByRef_ = compose(toResult, _updateOneByRef)

/** @type {(collection: ValidCollection, ref: ExprArg) => Promise<Response>} */
const deleteByRef = compose(toResponse, _deleteOneByRef)

/** @type {(collection: ValidCollection, data: ExprArg) => Promise<Response>} */
const create = compose(toResponse, _create)

module.exports = {
  findOneByRef,
  findOneByRef_,
  findAll,
  findAllByField,
  findAllByField_,
  findOneByField,
  findOneByField_,
  updateByRef,
  updateByRef_,
  create,
  deleteByRef,
}
