/**
 * @file This file exports parsers which verify that
 * data POSTed by user matches the shape of our data structures.
 *
 * NOTE: DOUBLE-CHECK THAT THE JSDOC TYPEDEFS MATCH THE ZOD
 * PARSERS. IT CANNOT BE DONE AUTOMATICALLY WITHOUT TS.
 */
/**
 * @template T
 * @typedef {import('./utils').Validator<T>} Validator
 */

/** @typedef {(
 * 'filmEntries' | 'gameEntries' | 'tvShowEntries' | 'bookEntries' | 'users'
 * )} ValidCollection */

/** @type {Record<ValidCollection, Validator<any>>} */
module.exports = {
  filmEntries: require('./films').filmEntries,
  gameEntries: require('./games').gameEntries,
  tvShowEntries: require('./tvShows').tvShowEntries,
  bookEntries: require('./books').bookEntries,
  users: require('./users').users
}
