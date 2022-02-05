/** @typedef {import('./works').Work} Work */
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

/** @typedef {z.infer<typeof bookParser>} Book */

const bookEntryParser = entryParser(bookParser)

/** @typedef {z.infer<typeof bookEntryParser>} BookEntry */

/** @type Validator<BookEntry> */
const bookEntries = (x) => validate(bookEntryParser, x)

/** @type Validator<Book> */
const books = (x) => validate(bookParser, x)

module.exports = {
  bookEntries,
  books,
}
