/**
 * @file This file exports simple Error constructors
 * to standardize projectwide error shapes.
 */
/** @typedef {{ error: string, context?: any }} Error */
/** @typedef {(context?: any) => Error} ErrorCreator */

/** @type {(name: string) => ErrorCreator} */
const error = (name) => (context) => ({ error: name, context: String(context) })

/** @type {Object.<string, ErrorCreator>} */
module.exports = {
  db: error('DBError'),
  req: error('RequestError'),
  unauthorized: error('UnauthorizedError'),
  notFound: error('NotFound'),
  internal: error('InternalError')
}
