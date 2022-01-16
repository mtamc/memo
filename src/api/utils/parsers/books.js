/** @typedef {import('./works').Work} Work */
/** @typedef {import('./entries').Entry} entry */
/**
 * @template T
 * @typedef {import('./utils').Validator<T>} Validator
 */
const { workParser } = require('./works')
const { validate } = require('./utils')
const { z } = require('zod')
const { entryParser } = require('./entries')

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

/**
 * @typedef {object} BookEntryProps
 * @property {Book} commonMetadata
 * @typedef {Entry & BookEntryProps} BookEntry
 */

/** @type Validator<BookEntry> */
const bookEntries = (x) => validate(entryParser(bookParser), x)

module.exports = {
  bookEntries
}
