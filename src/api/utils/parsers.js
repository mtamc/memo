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

// Films ===========================================================

const filmParser = workParser.extend({
  entryType: z.literal('Film'),
  staff: z.array(z.string()).or(z.undefined())
})

/**
 * @typedef {object} FilmProps
 * @property {'Film'} entryType
 * @property {string[]} [genres]
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

// Exports =========================================================

/**@type {Object.<ValidCollection, Validator<any>>} */
module.exports = {
  films,
  games,
}

///////////////////////////////////////////////////////////////////////////////


/** @type {<T>(parser: ZodType, x: T) => Result<T, Error>} */
var validate = (parser, x) =>
  Result.fromThrowable(parser.parse, errors.req)(x)

// Work ============================================================

var entryTypeParser = z.enum(['Game', 'Film', 'TVShow', 'Book'])

/**
 * @typedef {object} Work
 * @property {string} id
 * @property {'Game'|'Film'|'TVShow'|'Book'} entryType
 * @property {string} englishTranslatedTitle
 * @property {string} [originalTitle]
 * @property {number} [releaseYear]
 * @property {number} [duration]
 * @property {string} [imageUrl]
 * @property {string[]} [genres]
 */

var workParser = z.object({
  id: z.string(),
  entryType: entryTypeParser,
  englishTranslatedTitle: z.string(),
  originalTitle: z.string().or(z.undefined()),
  releaseYear: z.number().or(z.undefined()),
  duration: z.number().or(z.undefined()),
  imageUrl: z.string().or(z.undefined()),
  genres: z.array(z.string()).or(z.undefined()),
})
