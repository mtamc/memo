const fs = require('fs')

const entries = JSON.parse(fs.readFileSync('./to_watch.json'))
const stream = fs.createWriteStream("converted_towatch1.json", {flags:'a'});

const main = async () => {
  stream.write('[\n')
  entries.forEach((entry, i) => {
    stream.write(JSON.stringify(oldFilmToNewWithoutExternalData(entry)))
    if (i !== entries.length - 1) stream.write(',')
    stream.write('\n')
  })
  stream.write('\n]\n')
}

const oldFilmToNewWithoutExternalData = (entry) => {
  const [mm, dd, yy] = entry.date?.split('/')
  const completedDate = yy ? (new Date(100+yy, mm - 1, dd)).getTime() : undefined
  const englishTitleAttempt = entry.title.substring(entry.title.indexOf("("))
  const englishTranslatedTitle = englishTitleAttempt === entry.title
    ? entry.title
    : englishTitleAttempt.substring(1, englishTitleAttempt.length-1)
  const originalTitle = englishTitleAttempt === entry.title
    ? undefined
    : entry.title.substring(0, entry.title.indexOf("(")-1)

  return {
    commonMetadata: {
      apiRefs: [], // !!!!,
      externalUrls: [], // !!!
      entryType: 'Film',
      englishTranslatedTitle,
      originalTitle,
      releaseYear: entry.year,
      duration: 0, // !!!
      imageUrl: '', // !!!!
      genres: [], // !!!
      directors: [entry.staff], // !!
      actors: [], // !!!
    },
    userId: '860bf30e-497f-4e00-9304-160bf0e5e306',
    status: 'Planned',
    score: entry.score || undefined,
    completedDate,
    review: entry.comments,
    updatedDate: Date.now(),
  }
}

main()
