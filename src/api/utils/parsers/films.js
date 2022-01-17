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
  staff: z.array(z.string()).or(z.undefined()),
})

/** @typedef {z.infer<typeof filmParser>} Film */

const filmEntryParser = entryParser(filmParser)

/** @typedef {z.infer<typeof filmEntryParser>} FilmEntry */

/** @type Validator<FilmEntry> */
const filmEntries = (x) => validate(filmEntryParser, x)

module.exports = {
  filmEntries
}
