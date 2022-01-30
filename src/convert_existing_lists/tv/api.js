const fs = require('fs')
const tmdb = require('node-themoviedb')
const mdb = new tmdb('f47573d548f071adfc0f26b21ef46c43')

const entries = JSON.parse(fs.readFileSync('./converted1.json'))

const stream = fs.createWriteStream("converted2.json", {flags:'a'});
const stream2 = fs.createWriteStream("failed_indices", {flags:'a'});

const populate = async (entry, i) => {
  const titleWithoutSeason =
    entry.commonMetadata.englishTranslatedTitle
      .split(': Season')[0]
      .split('- Season')[0]

  const results = await mdb.search.TVShows({ query: {
    query: titleWithoutSeason,
  }})
    .then(({ data }) => data.results)

  if (!results || results.length === 0) {
    console.log(`WARNING: SKIPPING ${entry.commonMetadata.englishTranslatedTitle} BECAUSE SEARCH FAILED!!! index ${i}`)
    stream2.write(i+'\n')
    return entry
  }

  const result =
    entry.commonMetadata.first_air_date
      ? results
        .find(r => r.first_air_date?.substring(0,4) == entry.commonMetadata.releaseYear)
        ?? results[0]
      : results[0]

  const ref = String(result.id)
  const apiRefs = { name: 'tmdb', ref }
  const externalUrls = { name: 'tmdb', url: `https://www.themoviedb.org/movie/${ref}` }
  const imageUrl = result.poster_path
    ? 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + result.poster_path
    : undefined

  const details = await mdb.tv.getDetails({ pathParameters: { tv_id: ref } })
    .then(({ data }) => data)

  const credits = await mdb.tv.getCredits({ pathParameters: { tv_id: ref } })
    .then(({ data }) => data)

  const duration = details.episode_run_time || undefined

  const genres = details.genres.map(g => g.name)

  const directors = credits.crew.filter((person) => person.job === 'Director').map(p => p.name)

  const actors = [...credits.cast]
    // @ts-ignore (library typing is wrong)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10)
    // @ts-ignore (library typing is wrong)
    .filter((person) => person.popularity > 6)
    .map((person) => person.name)

  return {
    ...entry,
    score: parseInt(entry.score) || undefined,
    commonMetadata: {
      ...entry.commonMetadata,
      apiRefs,
      externalUrls,
      duration,
      imageUrl,
      genres,
      directors,
      actors,
    }
  }
}

;(async () => {
  stream.write('[\n')
  for (const [i, entry] of entries.entries()) {
    try {
      stream.write(JSON.stringify(await populate(entry, i)))
    } catch (e) {
      console.log(entry)
      console.log(e)
      throw 'oof'
    }
    if (i !== entries.length - 1) stream.write(',')
    stream.write('\n')
  }
  stream.write('\n]\n')
})()
