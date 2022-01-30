const { html } = Utils
const { round } = Math

const title = () =>
  col('Title', 'commonMetadata.englishTranslatedTitle', {
    formatter: titleFormatter,
  })

const index = () =>
  col('n', 'n', {
    formatter: indexFormatter,
    visible: false,
    cellStyle: () => ({ css: { 'width': '15px' } })
  })

const englishTitleAndLastUpdated = () =>
  col('Title', 'commonMetadata.englishTranslatedTitle', {
    formatter: englishTitleAndLastUpdatedFormatter,
  })

const score = (status) =>
  col(status === 'Planned' ? 'Preference' : 'Score', 'score', {
    sortable: true,
    align: 'center',
    cellStyle: () => ({ css: { 'width': '25px' } })
  })

const year = () =>
  col('Year', 'commonMetadata.releaseYear', {
    sortable: true,
    align: 'center',
    cellStyle: () => ({ css: { 'width': '25px' } })
  })

const duration = (label, visible) =>
  col(label ?? 'Duration', 'commonMetadata.duration', {
    sortable: true,
    align: 'center',
    visible: visible ?? false,
    cellStyle: () => ({ css: { 'width': '25px' } }),
    formatter: durationFormatter,
  })

const playtime = () =>
  col('Playtime', 'commonMetadata.duration', {
    sortable: true,
    align: 'center',
    visible: true,
    cellStyle: () => ({ css: { 'width': '25px' } }),
    formatter: playtimeFormatter,
  })

const pages = () =>
  col('Pages', 'commonMetadata.duration', {
    sortable: true,
    align: 'center',
    visible: true,
    cellStyle: () => ({ css: { 'width': '25px' } }),
  })

const genre = () =>
  col('Genres', 'commonMetadata.genres', {
    sortable: true,
    formatter: listOfLinksFormatter('genres'),
    cellStyle: () => ({ css: { 'width': '250px' } }),
    visible: false,
  })

const edit =  () =>
  col('<i class="fas fa-edit"></i>', 'editCol', {
    formatter: (_, row, i) => {
      // We use `onclick` and a global (window.xx) function instead of binding
      // an event, because bootstrap-table destroys the node and rebuilds it
      // when changing displayed columns
      return html`
        <i id="edit-${row.status}-${i}" class="fas fa-edit edit-button" onclick='window.editEntry(${JSON.stringify(row).replace(/'/g, `&#39;`)})'></i>
      `
    },
    cellStyle: () => ({ css: { 'width': '20px' } }),
  })

const directors = () =>
  col('Director', 'commonMetadata.directors', {
    ...sortableAndLinked('directors'),
    visible: true,
    cellStyle: () => ({ css: { 'width': '200px', } }),
  })

const actors = () =>
  col('Actors', 'commonMetadata.actors', {
    ...sortableAndLinked('actors'),
    visible: false,
    cellStyle: () => ({ css: { 'width': '250px', } }),
  })

const date = (label, field) =>
  col(label, field, {
    sortable: true,
    visible: false,
    align: 'center',
    cellStyle: () => ({ css: { 'width': '80px', } }),
    formatter: (date) =>
      date ? (new Date(date)).toISOString().substring(0, 10) : '-'
  })

const progress = () =>
  col('Progress', 'progress', {
    sortable: true,
    cellStyle: () => ({ css: { 'width': '20px' } }),
    formatter: (progress, row) => {
      const totalEps = row.commonMetadata.episodes ?? '-'
      const seen = row.status === 'Completed'
        ? totalEps
        : progress ?? '-'
      return `${seen}/${totalEps}`
    }
  })

const platforms = () =>
  col('Platforms', 'commonMetadata.platforms', {
    ...sortableAndLinked('platforms'),
    visible: false,
  })

const studios = () =>
  col('Studios', 'commonMetadata.studios', {
    ...sortableAndLinked('studios'),
    visible: false,
  })

const publishers = () =>
  col('Publishers', 'commonMetadata.publishers', {
    ...sortableAndLinked('publishers'),
    visible: false,
  })

const authors = () =>
  col('Authors', 'commonMetadata.authors', sortableAndLinked('authors'))

Columns = {
  title,
  index,
  englishTitleAndLastUpdated,
  score,
  year,
  duration,
  playtime,
  genre,
  edit,
  directors,
  actors,
  date,
  progress,
  platforms,
  studios,
  publishers,
  authors,
  pages,
}

///////////////////////////////////////////////////////////////////////////////

const col = (title, field, options) => ({ title, field, ...options })

const titleFormatter = (_, row) => {
  const { originalTitle, englishTranslatedTitle } = row.commonMetadata
  const label = originalTitle && originalTitle !== englishTranslatedTitle
    ? `${originalTitle} (${englishTranslatedTitle})`
    : englishTranslatedTitle
  const cover = row.commonMetadata.imageUrl ?? '/img/mawaru.png'
  return `<span class="title-with-cover"><img class="mini-thumb" src="${cover}">${toWikipediaLink(englishTranslatedTitle, label)}</span>`
}

const englishTitleAndLastUpdatedFormatter = (_, { commonMetadata, updatedDate }) => {
  const { englishTranslatedTitle } = commonMetadata
  const link = toWikipediaLink(englishTranslatedTitle, englishTranslatedTitle)
  return updatedDate
    ? `${link}<i style="font-size:.85em; float: right; position: relative; top: 3px;">${relativeTime(updatedDate)}</i>`
    : link
}

const listOfLinksFormatter = (prop, toLink) => (_, row) => {
  const list = row.commonMetadata[prop]
  const transformer = toLink ?? toWikipediaLink
  return list?.map((el) => transformer(el)).join(', ') ?? ''
}

const toWikipediaLink = (name, label) =>
  `<a href="http://en.wikipedia.org/wiki/Special:Search?search=${name}&go=Go">${label ?? name}</a>`

const sortableAndLinked = (prop, toLink) => ({
  sortable: true,
  formatter: listOfLinksFormatter(prop, toLink)
})

const durationFormatter = (durationInMin) => {
  const hours = Math.floor(durationInMin/60)
  const mins = durationInMin % 60
  return durationInMin
    ? `${hours}h${mins ? mins+'m' : ''}`
    : '-'
}

const playtimeFormatter = (durationInMin, row) => {
  const hours = Math.floor(durationInMin/60)
  const mins = durationInMin % 60
  const hltbRef = row.commonMetadata.apiRefs.find(ref => ref.name === 'hltb')?.ref
  return durationInMin && hltbRef
    ? `<a href="https://howlongtobeat.com/game?id=${hltbRef}">${hours}h${mins ? mins+'m' : ''}</a>`
    : durationInMin
    ? `${hours}h${mins ? mins+'m' : ''}`
    : '-'
}

const relativeTime = (ts) => {
  const msPerMinute = 60 * 1000
  const msPerHour = msPerMinute * 60
  const msPerDay = msPerHour * 24
  const msPerMonth = msPerDay * 30
  const msPerYear = msPerDay * 365

  const elapsed = Date.now() - ts

  const [number, unit] =
    elapsed < msPerMinute ? [round(elapsed/1000), 'second'] :
    elapsed < msPerHour   ? [round(elapsed/msPerMinute), 'minute'] :
    elapsed < msPerDay    ? [round(elapsed/msPerHour), 'hour'] :
    elapsed < msPerMonth  ? [round(elapsed/msPerDay),  'day'] :
    elapsed < msPerYear   ? [round(elapsed/msPerMonth), 'month'] :
    [round(elapsed/msPerYear), 'year']

  return `${number} ${unit}${number > 1 ? 's' : ''} ago`
}

const indexFormatter = (_, __, index) => index + 1
