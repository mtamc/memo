/**
 * @file This file exports simple Error constructors
 * to standardize projectwide error shapes.
 */
/** @typedef {{ error: string, context?: string }} Error */
/** @typedef {(context?: string) => Error} ErrorCreator */

/** @type {(name: string) => ErrorCreator} */
const error = (name) => (context) => ({ error: name, context })

/** @type {Object.<string, ErrorCreator>} */
module.exports = {
  db: error('DBError'),
  req: error('RequestError'),
  internal: error('InternalError')
}

