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
const errors = require('./errors')

/**
 * @template T
 * @typedef {(x: any) => Result<T, Error>} Validator
 */

/** @typedef {'films' | 'games'} ValidCollection */

/** @type {<T>(parser: ZodType, x: T) => Result<T, Error>} */
const validate = (parser, x) =>
  Result.fromThrowable(parser.parse, (e) => errors.req(JSON.stringify(e)))(x)

// Work (abstract) =================================================

const entryTypeParser = z.enum(['Game', 'Film', 'TVShow', 'Book'])

/**
 * @typedef {object} Work
 * @property {'Game'|'Film'|'TVShow'|'Book'} entryType
 * @property {string} englishTranslatedTitle
 * @property {string} [originalTitle]
 * @property {number} [releaseYear]
 * @property {number} [duration]
 * @property {string} [imageUrl]
 * @property {string[]} [genres]
 */

const workParser = z.object({
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

// Exports =========================================================

/**@type {Object.<ValidCollection, Validator<any>>} */
module.exports = {
  films,
  games,
  tvShows,
  books
}
