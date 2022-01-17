/** @typedef {import('./works').Work} Work */
/**
 * @template T
 * @typedef {import('./utils').Validator<T>} Validator
 */
const { workParser } = require('./works')
const { validate } = require('./utils')
const { z } = require('zod')
const { entryParser } = require('./entries')


const tvShowParser = workParser.extend({
  entryType: z.literal('TVShow'),
  staff: z.array(z.string()).or(z.undefined()),
  episodes: z.number().or(z.undefined()),
})

/** @typedef {z.infer<typeof tvShowParser>} TVShow */

const tvShowEntryParser = entryParser(tvShowParser)

/** @typedef {z.infer<typeof tvShowEntryParser>} TVShowEntry */

/** @type Validator<TVShowEntry> */
const tvShowEntries = (x) => validate(tvShowEntryParser, x)

module.exports = {
  tvShowEntries
}
