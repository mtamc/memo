/**
 * @file This file exports helpers which relate to
 * no specific domain. They fill general holes
 * in JavaScript stdlib.
 */
const { Result, ResultAsync } = require('neverthrow')
const {identity} = require('ramda')

/** @type {<T>(x: T) => T} */
const log = (x) => (console.log(x), x)

/** @type {<T>(x: T) => T} */
const warn = (x) => (console.warn(x), x)

/** @type {(val: any) => Result<string, string>} */
const safeJSONStringify = Result.fromThrowable(JSON.stringify, String)

/** @type {<T,U>(x: [T, U]) => x} */
const tuple = (x) => x

/** @type {<T,U,V>(x: [T, U, V]) => x} */
const triplet = (x) => x

/** @type {(err: any) => never} */
const throwIt = (err) => { throw err }

/** @type {<T>(ra: ResultAsync<T, T>) => Promise<T>} */
const toPromise = (ra) =>
  ra.match(identity, identity)

module.exports = {
  log,
  warn,
  safeJSONStringify,
  tuple,
  triplet,
  throwIt,
  toPromise
}
