/**
 * @file This file exports helpers which relate to
 * no specific domain. They fill general holes
 * in JavaScript stdlib.
 */
const { Result } = require('neverthrow')

/** @template T @param {T} x */
const log = (x) => (console.log(x), x)

/** @template T @param {T} x */
const warn = (x) => (console.warn(x), x)

/** @type {(val: any) => Result<string, string>} */
const safeJSONStringify = Result.fromThrowable(JSON.stringify, String)

/**
 * Helper for type safety.
 * @template A,B
 * @param {[A, B]} x
 */
const tuple = (x) => x

module.exports = {
  log,
  warn,
  safeJSONStringify,
  tuple,
}
