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

/**
 * @typedef {object} GameEntryProps
 * @property {Game} commonMetadata
 * @typedef {Entry & GameEntryProps} GameEntry
 */

/** @type Validator<GameEntry> */
const gameEntries = (x) => validate(entryParser(gameParser), x)

module.exports = {
  gameEntries
}
