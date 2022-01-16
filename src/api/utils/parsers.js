/**
 * @file This file exports parsers which verify that
 * data POSTed by user matches the shape of our data structures.
 *
 * NOTE: DOUBLE-CHECK THAT THE JSDOC TYPEDEFS MATCH THE ZOD
 * PARSERS. IT CANNOT BE DONE AUTOMATICALLY WITHOUT TS.
 */
/** @typedef {import('zod').ZodType} ZodType */
/** @typedef {import('./errors').Error} Error */
const { Result } = require('neverthrow')
const { z } = require('zod')
const validator = require('validator')
const { isAlphanumeric } = validator.default
const errors = require('./errors')

/**
 * @template T
 * @typedef {(x: any) => Result<T, Error>} Validator
 */

/** @typedef {(
 * 'films' | 'games' | 'tvShows' | 'books'
 * | 'filmEntries' | 'gameEntries' | 'tvShowEntries' | 'bookEntries' | 'users'
 * )} ValidCollection */

/** @type {<T>(parser: ZodType, x: T) => Result<T, Error>} */
const validate = (parser, x) =>
  Result.fromThrowable(parser.parse, (e) => errors.req(JSON.stringify(e)))(x)

// User ============================================================

const userParser = z.object({
  userId: z.string(),
  username: z.string().max(16).min(2).refine((val) => isAlphanumeric(val)),
})

/**
 * @typedef {object} User
 * @property {string} userId
 * @property {string} username
 */

/** @type Validator<User> */
const users = (x) => validate(userParser, x)

// Work (abstract) =================================================

const entryTypeParser = z.enum(['Game', 'Film', 'TVShow', 'Book'])

/**
 * @typedef {object} Work
 * @property {string} [apiRef]
 * @property {'Game'|'Film'|'TVShow'|'Book'} entryType
 * @property {string} englishTranslatedTitle
 * @property {string} [originalTitle]
 * @property {number} [releaseYear]
 * @property {number} [duration]
 * @property {string} [imageUrl]
 * @property {string[]} [genres]
 */

const workParser = z.object({
  apiRef: z.string().or(z.undefined()),
  entryType: entryTypeParser,
  englishTranslatedTitle: z.string(),
  originalTitle: z.string().or(z.undefined()),
  releaseYear: z.number().or(z.undefined()),
  duration: z.number().or(z.undefined()),
  imageUrl: z.string().or(z.undefined()),
  genres: z.array(z.string()).or(z.undefined()),
})

// Films ===========================================================

const filmParser = workParser.extend({
  entryType: z.literal('Film'),
  staff: z.array(z.string()).or(z.undefined()),
})

/**
 * @typedef {object} FilmProps
 * @property {'Film'} entryType
 * @property {string[]} [staff]
 *
 * @typedef {Work & FilmProps} Film
 */

/** @type Validator<Film> */
const films = (x) => validate(filmParser, x)

// Games ===========================================================

const gameParser = workParser.extend({
  entryType: z.literal('Game'),
  platforms: z.array(z.string()).or(z.undefined()),
  studios: z.array(z.string()).or(z.undefined()),
  publishers: z.array(z.string()).or(z.undefined()),
})

/**
 * @typedef {object} GameProps
 * @property {'Game'} entryType
 * @property {string[]} [studios]
 * @property {string[]} [publishers]
 *
 * @typedef {Work & GameProps} Game
 */

/** @type Validator<Game> */
const games = (x) => validate(gameParser, x)

// TVShows =========================================================

const tvShowParser = workParser.extend({
  entryType: z.literal('TVShow'),
  staff: z.array(z.string()).or(z.undefined()),
  episodes: z.number().or(z.undefined()),
})

/**
 * @typedef {object} TVShowProps
 * @property {'TVShow'} entryType
 * @property {string[]} [staff]
 * @property {number} [episodes]
 *
 * @typedef {Work & TVShowProps} TVShow
 */

/** @type Validator<TVShow> */
const tvShows = (x) => validate(tvShowParser, x)

// Books ===========================================================

const bookParser = workParser.extend({
  entryType: z.literal('Book'),
  authors: z.array(z.string()).or(z.undefined()),
})

/**
 * @typedef {object} BookProps
 * @property {'Book'} entryType
 * @property {string[]} [authors]
 *
 * @typedef {Work & BookProps} Book
 */

/** @type Validator<Book> */
const books = (x) => validate(bookParser, x)

// Entries =========================================================

const statusParser = z.enum(['InProgress', 'Completed', 'Dropped', 'Planned'])

const scoreParser = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
  z.literal(10)
])

/** @param {ZodType} specificWorkParser */
const entryParser = (specificWorkParser) => z.object({
  commonMetadata: specificWorkParser,
  status: statusParser,
  score: scoreParser.or(z.undefined()),
  startedDate: z.number().or(z.undefined()),
  completedDate: z.number().or(z.undefined()),
  review: z.string().or(z.undefined())
})

/**
 * @typedef {object} Entry
 * @property {'InProgress'|'Completed'|'Dropped'|'Planned'} status
 * @property {1|2|3|4|5|6|7|8|9|10} [score]
 * @property {number} [startedDate]
 * @property {number} [completedDate]
 * @property {string} [review]
 */

/**
 * @typedef {object} FilmEntryProps
 * @property {Film} commonMetadata
 * @typedef {Entry & FilmEntryProps} FilmEntry
 */

/** @type Validator<FilmEntry> */
const filmEntries = (x) => validate(entryParser(filmParser), x)

/**
 * @typedef {object} GameEntryProps
 * @property {Game} commonMetadata
 * @typedef {Entry & GameEntryProps} GameEntry
 */

/** @type Validator<GameEntry> */
const gameEntries = (x) => validate(entryParser(gameParser), x)

/**
 * @typedef {object} TVShowEntryProps
 * @property {TVShow} commonMetadata
 * @typedef {Entry & TVShowEntryProps} TVShowEntry
 */

/** @type Validator<TVShowEntry> */
const tvShowEntries = (x) => validate(entryParser(tvShowParser), x)

/**
 * @typedef {object} BookEntryProps
 * @property {Book} commonMetadata
 * @typedef {Entry & BookEntryProps} BookEntry
 */

/** @type Validator<BookEntry> */
const bookEntries = (x) => validate(entryParser(bookParser), x)

// Exports =========================================================

/** @type {Record<ValidCollection, Validator<any>>} */
module.exports = {
  films,
  games,
  tvShows,
  books,
  filmEntries,
  gameEntries,
  tvShowEntries,
  bookEntries,
  users
}
