const { z } = require('zod')
const entryTypeParser = z.enum(['Game', 'Film', 'TVShow', 'Book'])
// const apiRefParser = z.object({
  // name: z.string(),
  // ref: z.string(),
// })
const externalUrlParser = z.object({
  name: z.string(),
  url: z.string(),
})

const workParser = z.object({
  apiRefs: z.array(z.string()),
  externalUrls: z.array(externalUrlParser).nullable().or(z.undefined()),
  entryType: entryTypeParser,
  englishTranslatedTitle: z.string().nullable(),
  originalTitle: z.string().nullable().or(z.undefined()),
  releaseYear: z.number().nullable().or(z.undefined()),
  duration: z.number().nullable().or(z.undefined()),
  imageUrl: z.string().nullable().or(z.undefined()),
  genres: z.array(z.string()).nullable().or(z.undefined()),
})

/** @typedef {z.infer<typeof workParser>} Work */

module.exports = {
  workParser
}
