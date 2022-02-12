const { z } = require('zod')
const { validate } = require('./utils')

const reviewParser = z.object({
  text: z.string(),
  entryRef: z.any(),
})

/** @typedef {z.infer<typeof reviewParser>} Review */

/** @type Validator<Review> */
const reviews = (x) => validate(reviewParser, x)

module.exports = {
  reviews
}
