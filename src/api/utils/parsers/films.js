/** @typedef {import('./works').Work} Work */
/**
 * @template T
 * @typedef {import('./utils').Validator<T>} Validator
 */
const { workParser } = require('./works')
const { validate } = require('./utils')
const { z } = require('zod')
const { entryParser } = require('./entries')

const filmParser = workParser.extend({
  entryType: z.literal('Film'),
  directors: z.array(z.string()).nullable().or(z.undefined()),
  actors: z.array(z.string()).nullable().or(z.undefined()),
})

/** @typedef {z.infer<typeof filmParser>} Film */

const filmEntryParser = entryParser(filmParser)

/** @typedef {z.infer<typeof filmEntryParser>} FilmEntry */

/** @type Validator<FilmEntry> */
const filmEntries = (x) => validate(filmEntryParser, x)

/** @type Validator<Film> */
const films = (x) => validate(filmParser, x)

module.exports = {
  filmEntries,
  films,
}
