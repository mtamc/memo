/** @typedef {import('zod').ZodType} ZodType */
const { z } = require('zod')
const statusParser = z.enum(['InProgress', 'Completed', 'Dropped', 'Planned'])

const scoreParser = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
  z.literal(10)
])

/** @param {ZodType} specificWorkParser */
const entryParser = (specificWorkParser) => z.object({
  commonMetadata: specificWorkParser,
  status: statusParser,
  score: scoreParser.or(z.undefined()),
  startedDate: z.number().or(z.undefined()),
  completedDate: z.number().or(z.undefined()),
  review: z.string().or(z.undefined())
})

/**
 * @typedef {object} Entry
 * @property {'InProgress'|'Completed'|'Dropped'|'Planned'} status
 * @property {1|2|3|4|5|6|7|8|9|10} [score]
 * @property {number} [startedDate]
 * @property {number} [completedDate]
 * @property {string} [review]
 */

module.exports = {
  entryParser
}
