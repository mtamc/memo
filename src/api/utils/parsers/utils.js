/** @typedef {import('zod').ZodType} ZodType */
/** @typedef {import('../errors').Error} Error */
/**
 * @template T
 * @typedef {(x: any) => Result<T, Error>} Validator
 */
const { Result } = require('neverthrow')
const errors = require('../errors')

/** @type {<T>(parser: ZodType, x: T) => Result<T, Error>} */
const validate = (parser, x) =>
  Result.fromThrowable(parser.parse, (e) => errors.req(JSON.stringify(e)))(x)

module.exports = {
  validate
}
