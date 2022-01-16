const { z } = require('zod')
const entryTypeParser = z.enum(['Game', 'Film', 'TVShow', 'Book'])

/**
 * @typedef {object} Work
 * @property {string} [apiRef]
 * @property {'Game'|'Film'|'TVShow'|'Book'} entryType
 * @property {string} englishTranslatedTitle
 * @property {string} [originalTitle]
 * @property {number} [releaseYear]
 * @property {number} [duration]
 * @property {string} [imageUrl]
 * @property {string[]} [genres]
 */

const workParser = z.object({
  apiRef: z.string().or(z.undefined()),
  entryType: entryTypeParser,
  englishTranslatedTitle: z.string(),
  originalTitle: z.string().or(z.undefined()),
  releaseYear: z.number().or(z.undefined()),
  duration: z.number().or(z.undefined()),
  imageUrl: z.string().or(z.undefined()),
  genres: z.array(z.string()).or(z.undefined()),
})

module.exports = {
  workParser
}
