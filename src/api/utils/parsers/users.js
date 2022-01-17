/**
 * @template T
 * @typedef {import('./utils').Validator<T>} Validator
 */
const { z } = require('zod')
const validator = require('validator')
const { isAlphanumeric } = validator.default
const { validate } = require('./utils')

const userParser = z.object({
  userId: z.string(),
  username: z.string().max(16).min(2).refine((val) => isAlphanumeric(val)),
})

/** @typedef {z.infer<typeof userParser>} User

/** @type Validator<User> */
const users = (x) => validate(userParser, x)

module.exports = {
  users
}
