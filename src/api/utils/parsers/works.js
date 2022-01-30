const { z } = require('zod')
const entryTypeParser = z.enum(['Game', 'Film', 'TVShow', 'Book'])
const apiRefParser = z.object({
  name: z.string(),
  ref: z.string(),
})
const externalUrlParser = z.object({
  name: z.string(),
  url: z.string(),
})

const workParser = z.object({
  apiRefs: z.array(apiRefParser),
  externalUrls: z.array(externalUrlParser).or(z.undefined()),
  entryType: entryTypeParser,
  englishTranslatedTitle: z.string(),
  originalTitle: z.string().or(z.undefined()),
  releaseYear: z.number().or(z.undefined()),
  duration: z.number().or(z.undefined()),
  imageUrl: z.string().or(z.undefined()),
  genres: z.array(z.string()).or(z.undefined()),
})

/** @typedef {z.infer<typeof workParser>} Work */

module.exports = {
  workParser
}
