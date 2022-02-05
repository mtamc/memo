/**
 * @file This file exports parsers which verify that
 * data POSTed by user matches the shape of our data structures.
 *
 * Exports MUST be named after a valid DB collection.
 */
/**
 * @template T
 * @typedef {import('./utils').Validator<T>} Validator
 */

/** @typedef {(
 * 'filmEntries' | 'gameEntries' | 'tvShowEntries' | 'bookEntries' | 'users' | 'tvShows' | 'films' | 'games' | 'books'
 * )} ValidCollection */

/** @type {Record<ValidCollection, Validator<any>>} */
module.exports = {
  filmEntries: require('./films').filmEntries,
  films: require('./films').films,
  gameEntries: require('./games').gameEntries,
  games: require('./games').games,
  tvShowEntries: require('./tvShows').tvShowEntries,
  tvShows: require('./tvShows').tvShows,
  bookEntries: require('./books').bookEntries,
  books: require('./books').books,
  users: require('./users').users,
}
