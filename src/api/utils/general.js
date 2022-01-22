/**
 * @file This file exports helpers which relate to
 * no specific domain. They fill general holes
 * in JavaScript stdlib.
 */
const { Result, ResultAsync, err, ok } = require('neverthrow')
const { identity, isNil } = require('ramda')

/** @type {<T>(x: T) => T} */
const log = (x) => (console.log(x), x)

/** @type {<T>(x: T) => T} */
const warn = (x) => (console.warn(x), x)

/** @type {(val: any) => Result<string, string>} */
const safeJSONStringify = Result.fromThrowable(JSON.stringify, String)

/** @type {<T,U>(x: [T, U]) => x} */
const pair = (x) => x

/** @type {<T,U,V>(x: [T, U, V]) => x} */
const triplet = (x) => x

/** @type {(err: any) => never} */
const throwIt = (err) => { throw err }

/** @type {<T>(ra: ResultAsync<T, T>) => Promise<T>} */
const toPromise = (ra) =>
  ra.match(identity, identity)

/** @type {<T>(x: T | undefined | null) => Result<T, undefined>} */
const validateExists = (x) =>
  isNil(x) ? err(undefined) : ok(x)

module.exports = {
  log,
  warn,
  safeJSONStringify,
  pair,
  triplet,
  throwIt,
  toPromise,
  validateExists
}
