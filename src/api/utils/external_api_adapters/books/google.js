/** @typedef {import('../types').Adapter} Adapter */
/** @typedef {import('../types').SearchFunction} SearchFunction */
/** @typedef {import('../types').SearchResult} SearchResult */
/** @typedef {import('../types').BookRetrieveFunction} BookRetrieveFunction */
/** @typedef {import('../../errors').Error} Error */
/** @typedef {import('../../parsers/books').Book} Book */
const { ResultAsync } = require('neverthrow')
const errors = require('../../errors')
const axios = require('axios')

const { GOOGLE_API_KEY } = process.env

/* Only use key if it's present in the env vars */
const urlKey =
  GOOGLE_API_KEY
    ? `&key=${GOOGLE_API_KEY}`
    : ''

/** @type SearchFunction */
const search = (titleSearch) => ResultAsync.fromPromise(
  axios({
    method: 'get',
    url: `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(titleSearch)}&maxResults=40${urlKey}`
  })
    .then(({ data }) => data.items
      .filter(({ volumeInfo }) =>
        volumeInfo?.industryIdentifiers?.some((i) => i.type.includes('ISBN'))
      )
      .map(({ volumeInfo }) => ({
        title: `${volumeInfo?.title} [${volumeInfo?.authors?.join(', ')}]`,
        year: volumeInfo?.publishedDate?.substring(0, 4),
        ref: volumeInfo?.industryIdentifiers?.find((i) => i.type.includes('ISBN'))?.identifier,
        imageUrl: volumeInfo?.imageLinks?.thumbnail,
      }))
    ),
  () => errors.internal('Problem retrieving book with Google Books.')
)

/** @type BookRetrieveFunction */
const retrieve = (ref) => ResultAsync.fromPromise(
  axios({
    method: 'get',
    url: `https://www.googleapis.com/books/v1/volumes?q=isbn:${ref}${urlKey}`
  }).then(({ data }) => data.items.map(({ volumeInfo }) => ({
    entryType: 'Book',
    englishTranslatedTitle: volumeInfo.title,
    releaseYear: parseInt(volumeInfo.publishedDate?.substring(0, 4)) || undefined,
    duration: volumeInfo.pageCount,
    imageUrl: volumeInfo?.imageLinks?.thumbnail,
    authors: volumeInfo?.authors,
    apiRefs: [`ISBN__${ref}`],
    externalUrls: volumeInfo?.canonicalVolumeLink
      ? [{ name: 'Google Play', url: volumeInfo?.canonicalVolumeLink }]
      : [],
  }))[0]).catch((e) => {
    console.log(e)
    throw 'Something terrible happened'
  }),
  () => errors.internal('Problem retrieving book with Google Books.')
)

/** @type Adapter */
module.exports = {
  search,
  retrieve
}

const log = x => (console.log(x), x)
