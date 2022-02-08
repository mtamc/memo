/** @typedef {import('./works').Work} Work */
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
  platforms: z.array(z.string()).nullable().or(z.undefined()),
  studios: z.array(z.string()).nullable().or(z.undefined()),
  publishers: z.array(z.string()).nullable().or(z.undefined()),
})

/** @typedef {z.infer<typeof gameParser>} Game */

const gameEntryParser = entryParser(gameParser)

/** @typedef {z.infer<typeof gameEntryParser>} GameEntry */

/** @type Validator<GameEntry> */
const gameEntries = (x) => validate(gameEntryParser, x)

/** @type Validator<Game> */
const games = (x) => validate(gameParser, x)

module.exports = {
  gameEntries,
  games,
}
