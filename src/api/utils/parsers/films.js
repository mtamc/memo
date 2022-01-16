/** @typedef {import('./works').Work} Work */
/** @typedef {import('./entries').Entry} entry */
/**
 * @template T
 * @typedef {import('./utils').Validator<T>} Validator
 */
const { workParser } = require('./works')
const { validate } = require('./utils')
const { z } = require('zod')

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

/**
 * @typedef {object} FilmEntryProps
 * @property {Film} commonMetadata
 * @typedef {Entry & FilmEntryProps} FilmEntry
 */

/** @type Validator<FilmEntry> */
const filmEntries = (x) => validate(entryParser(filmParser), x)

module.exports = {
  filmEntries
}
