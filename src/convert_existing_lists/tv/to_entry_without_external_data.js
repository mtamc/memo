const fs = require('fs')

const entries = {
  'Completed': JSON.parse(fs.readFileSync('./completed.json')),
  'Planned': JSON.parse(fs.readFileSync('./to_watch.json')),
  'Dropped': JSON.parse(fs.readFileSync('./dropped.json')),
  'InProgress': JSON.parse(fs.readFileSync('./watching.json')),
}

const main = async () => {
  const stream = fs.createWriteStream("converted1.json", {flags:'a'});
  stream.write('[\n')
  Object.entries(entries).forEach(([status, subEntries], i) => {
    subEntries.forEach(entry => {
      stream.write(JSON.stringify(oldToNew(status, entry)))
      if (i !== Object.values(entries).flat().length - 1) stream.write(',')
      stream.write('\n')
    })
  })
  stream.write('\n]\n')
}

const oldToNew = (status, entry) => {
  console.log(entry)
  const [cmm, cdd, cyy] = entry.date_finished?.split('/')
  const [smm, sdd, syy] = entry.date_started?.split('/')
  const completedDate = cyy ? (new Date(100+cyy, cmm - 1, cdd)).getTime() : undefined
  const startedDate = syy ? (new Date(100+syy, smm - 1, sdd)).getTime() : undefined
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
      entryType: 'TVShow',
      englishTranslatedTitle,
      originalTitle,
      releaseYear: entry.year,
      //duration: 0, // !!!
      imageUrl: '', // !!!!
      genres: [], // !!!
      directors: [entry.staff], // !!
      actors: [], // !!!
      //episodes
    },
    userId: '860bf30e-497f-4e00-9304-160bf0e5e306',
    status,
    score: entry.score || undefined,
    startedDate,
    completedDate,
    review: entry.comments,
    updatedDate: Date.now(),
  }
}
main()
