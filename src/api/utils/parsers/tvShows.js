/** @typedef {import('./works').Work} Work */
/** @typedef {import('./entries').Entry} Entry */
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

/**
 * @typedef {object} TVShowProps
 * @property {'TVShow'} entryType
 * @property {string[]} [staff]
 * @property {number} [episodes]
 *
 * @typedef {Work & TVShowProps} TVShow
 */

/**
 * @typedef {object} TVShowEntryProps
 * @property {TVShow} commonMetadata
 * @typedef {Entry & TVShowEntryProps} TVShowEntry
 */

/** @type Validator<TVShowEntry> */
const tvShowEntries = (x) => validate(entryParser(tvShowParser), x)

module.exports = {
  tvShowEntries
}
