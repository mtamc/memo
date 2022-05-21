/**
 * @file A lot of this code is duplicated
 * with the Film adapter...
 */
/** @typedef {import('../types').Adapter} Adapter */
/** @typedef {import('../types').SearchFunction} SearchFunction */
/** @typedef {import('../types').SearchResult} SearchResult */
/** @typedef {import('../types').GameRetrieveFunction} GameRetrieveFunction */
/** @typedef {import('../../errors').Error} Error */
/** @typedef {import('../../parsers/games').Game} Game */
const { ResultAsync } = require('neverthrow')
const errors = require('../../errors')
const igdb = require('igdb-api-node').default
const axios = require('axios').default
const Hltb = require('howlongtobeat')
const hltb = new Hltb.HowLongToBeatService()

const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } = process.env
if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) {
  throw "Must set TWITCH_CLIENT_SECRET and TWITCH_CLIENT_ID environment variables."
}

const igdbClient =
  axios({
    method: 'post',
    url: `https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials`
  })
    .then(({ data }) => igdb(TWITCH_CLIENT_ID, data.access_token))

/** @type SearchFunction */
const search = (titleSearch) => ResultAsync.fromPromise(
  (async () => {
    try {
      const client = await igdbClient

      const req = await client
        .fields(['name', 'cover.url', 'release_dates.*', 'platforms.abbreviation'])
        .limit(50)
        .search(titleSearch)
        .request('/games')

      const results = req.data.map(({ name, id, release_dates, cover, platforms }) => {
        const earliest_date = release_dates?.sort((a,b) => a.date - b.date)[0]?.date * 1000
        return {
          title: name + ` [${platforms?.map((p) => p.abbreviation ?? '?')?.join(', ') ?? '?'}]`,
          ref: id,
          year: earliest_date ? (new Date(earliest_date)).toISOString().substring(0, 4) : undefined,
          imageUrl: cover?.url ? 'https:' + cover.url : undefined,
        }
      })

      return results
    } catch (e) {
      console.log(e)
      throw "Something went terribly wrong..."
    }
  })(),
  () => errors.internal('Problem searching for games with igdb.')
)

/** @type GameRetrieveFunction */
const retrieve = (ref) => ResultAsync.fromPromise(
  (async () => {
    try {
      const client = await igdbClient
      const mainData = await client
        .fields(['name', 'alternative_names.*', 'cover.url', 'release_dates.*', 'genres.name', 'platforms.abbreviation', 'involved_companies.*', 'url'])
        .where(`id = ${ref}`)
        .request('/games')
        .then(({ data }) => data[0])

      const hltbEntry = await hltb.search(mainData.name)
        .then((results) => results[0])
        .catch(() => undefined)

      const duration = hltbEntry ? hltbEntry.gameplayMain * 60 : undefined

      const publisherIds =
        mainData
          .involved_companies
          ?.filter((c) => c.publisher)
          ?.map((c) => c.company)
          ?? []

      const studioIds =
        mainData
          .involved_companies
          ?.filter((c) => c.developer)
          ?.map((c) => c.company)
          ?? []

      const companies = await (
        [studioIds, publisherIds].some((arr) => arr.length > 0)
          ? client
              .fields(['name'])
              .where(
                `id = (${[...studioIds, ...publisherIds].join(', ')})`
              )
              .limit(50)
              .request('/companies')
              .then((resp) => resp.data)
          : []
      )

      const publisherNames =
        publisherIds
          .map((id) => companies.find((c) => c.id === id)?.name)

      const studioNames =
        studioIds
          .map((id) => companies.find((c) => c.id === id)?.name)

      const releaseYearTs =
        mainData.release_dates?.sort((a, b) => a.date - b.date)[0].date

      const releaseYear = releaseYearTs
        ? parseInt(
          (new Date(releaseYearTs * 1000)).toISOString() .substring(0, 4)
        )
          || undefined
        : undefined

      return {
        entryType: 'Game',
        englishTranslatedTitle: mainData.name,
        originalTitle: mainData.alternative_names
          ?.find((n) => n.comment?.includes('riginal'))
          ?.name,
        releaseYear,
        duration,
        imageUrl: mainData.cover.url ? 'https:' + mainData.cover.url : '',
        genres: mainData.genres?.map((g) => g.name) ?? [],
        platforms: mainData.platforms?.map((p) => p.abbreviation ?? '?') ?? [],
        studios: studioNames,
        publishers: publisherNames,
        apiRefs: [
          `igdb__${mainData.id}`,
          ...(hltbEntry ? [`hltb__${hltbEntry.id}`] : []),
        ],
        externalUrls: [
          ...(mainData.url ? [{ name: 'igdb', url: mainData.url }] : []),
          ...(hltbEntry ? [{ name: 'hltb', url: 'https://howlongtobeat.com/game?id=' + String(hltbEntry.id) }] : []),
        ]
      }
    } catch (e) {
      console.log(e)
      throw "Something went very wrong..."
    }
  })(),
  () => errors.internal('Problem retrieving game with igdb and hltb.')
)

/** @type Adapter */
module.exports = {
  search,
  retrieve
}
