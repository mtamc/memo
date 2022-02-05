/** @typedef {import('zod').ZodObject} ZodObject */
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

/** @param {ZodObject} specificWorkParser */
const entryParser = (specificWorkParser) => z.object({
  // commonMetadata: specificWorkParser,
  workRef: z.string().nullable().or(z.undefined()),
  overrides: specificWorkParser.partial().or(z.undefined()),
  userId: z.string(),
  status: statusParser,
  score: scoreParser.nullable().or(z.undefined()),
  startedDate: z.number().nullable().or(z.undefined()),
  completedDate: z.number().nullable().or(z.undefined()),
  review: z.string().or(z.undefined()),
  progress: z.number().nullable().or(z.undefined()),
  updatedDate: z.number().or(z.undefined()),
})

module.exports = {
  entryParser
}
