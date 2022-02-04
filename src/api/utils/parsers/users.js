/**
 * @template T
 * @typedef {import('./utils').Validator<T>} Validator
 */
const { z } = require('zod')
const validator = require('validator')
const { isAlphanumeric } = validator.default
const { validate } = require('./utils')

const scoreTallyParser = z.object({
  [1]: z.number(),
  [2]: z.number(),
  [3]: z.number(),
  [4]: z.number(),
  [5]: z.number(),
  [6]: z.number(),
  [7]: z.number(),
  [8]: z.number(),
  [9]: z.number(),
  [10]: z.number(),
  unrated: z.number(),
})

const userParser = z.object({
  userId: z.string(),
  username: z.string().max(16).min(2).refine((val) => isAlphanumeric(val)),
  stats: z.object({
    updatedDate: z.number(),
    scores: z.object({
      films: scoreTallyParser,
      books: scoreTallyParser,
      tv: scoreTallyParser,
      games: scoreTallyParser,
    })
  }).nullable().or(z.undefined())
})

/** @typedef {z.infer<typeof userParser>} User

/** @type Validator<User> */
const users = (x) => validate(userParser, x)

module.exports = {
  users
}
