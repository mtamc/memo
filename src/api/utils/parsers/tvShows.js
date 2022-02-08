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
  directors: z.array(z.string()).nullable().or(z.undefined()),
  actors: z.array(z.string()).nullable().or(z.undefined()),
  episodes: z.number().nullable().or(z.undefined()),
})

/** @typedef {z.infer<typeof tvShowParser>} TVShow */

const tvShowEntryParser = entryParser(tvShowParser)

/** @typedef {z.infer<typeof tvShowEntryParser>} TVShowEntry */

/** @type Validator<TVShowEntry> */
const tvShowEntries = (x) => validate(tvShowEntryParser, x)

/** @type Validator<TVShow> */
const tvShows = (x) => validate(tvShowParser, x)

module.exports = {
  tvShowEntries,
  tvShows
}
