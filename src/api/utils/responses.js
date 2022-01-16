/**
 * @file This file exports simple Netlify HTTP Response constructors
 * that also safely convert Response body to JSON string.
 */
const { safeJSONStringify, warn } = require('./general')

/** @typedef {{ statusCode: Number, body?: any }} Response */

/** @typedef {(body?: any) => Response} ResponseCreator */

/** @type {(statusCode: Number) => ResponseCreator} */
const response = (statusCode) => (body) =>
  safeJSONStringify(body).match(
    (body) => ({ statusCode, body }),
    (err) => (warn(err), { statusCode: 500 }),
  )

/** @type {Object.<String, ResponseCreator>} */
module.exports = {
  ok: response(200),
  badRequest: response(400),
  notFound: response(404),
  internalError: response(500),
}
