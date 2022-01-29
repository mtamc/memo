const { html } = Utils

const col = (title, field, options) => ({ title, field, ...options })

const initTable = (selector, data, settings) =>
  $(selector).bootstrapTable({ ...settings, data })

const detailFormatter = (_, row) =>
  `<p><b> Comments:</b> ${marked.parse(row.review ?? '*None yet*')}</p>`

const statuses = ['InProgress', 'Completed', 'Dropped', 'Planned']

const typeToTitle = {
  films: 'Films',
  books: 'Literature',
  games: 'Video Games',
  tv_shows: 'TV Shows',
}

const typeToAPIType = {
  films: 'Film',
  books: 'Book',
  games: 'Game',
  tv_shows: 'TVShow',
}

const basicColumns = (status) => [
  col('Title', 'commonMetadata.englishTranslatedTitle', {
    formatter: titleFormatter,
    // cellStyle: () => ({ css: { 'width': '250px' } })
  }),
  col(status === 'Planned' ? 'Preference' : 'Score', 'score', {
    sortable: true,
    align: 'center',
    cellStyle: () => ({ css: { 'width': '25px' } })
  }),
  col('Duration', 'commonMetadata.duration', {
    sortable: true,
    align: 'center',
    visible: false,
    formatter: (durationInMin) => {
      const hours = Math.floor(durationInMin/60)
      const mins = durationInMin % 60
      return durationInMin
        ? `${hours}${mins ? ':' + mins : ''}`
        : '-'
    }
  }),
  col('Year', 'commonMetadata.releaseYear', {
    sortable: true,
    align: 'center',
    cellStyle: () => ({ css: { 'width': '25px' } })
  })
]

const allColumns = (status) => [
  ...basicColumns(status),
  col('Genres', 'commonMetadata.genres', {
    sortable: true,
    formatter: listOfLinksFormatter('genres'),
    cellStyle: () => ({ css: { 'width': '250px' } }),
    visible: false,
  }),
]

const editColumn = () =>
  col('<i class="fas fa-edit"></i>', 'editCol', {
    formatter: (_, row, i) => {
      return html`
        <i id="edit-${row.status}-${i}" class="fas fa-edit edit-button" data-entry='${JSON.stringify(row)}'></i>
      `
    },
    cellStyle: () => ({ css: { 'width': '20px' } })
  })

const entryTypeToExtraColumns = (entryType, status) => ({
  films: [
    directorColumn(),
    actorsColumn(),
  ],
  tv_shows: [
    col('Progress', 'progress', {
      sortable: true,
      formatter: (progress, row) => {
        const totalEps = row.commonMetadata.episodes ?? '-'
        const seen = row.status === 'Completed'
          ? totalEps
          : progress ?? '-'
        return `${seen}/${totalEps}`
      }
    }),
    directorColumn(),
    actorsColumn(),
  ],
  games: [
    col('Platforms', 'commonMetadata.platforms', sortableAndLinked('Platforms')),
    col('Studios', 'commonMetadata.studios', sortableAndLinked('Studios')),
    col('Publishers', 'commonMetadata.publishers', sortableAndLinked('Publishers')),
  ],
  books: [
    col('Authors', 'commonMetadata.authors', sortableAndLinked('authors')),
  ],
}[entryType])

const directorColumn = () =>
  col('Director', 'commonMetadata.director', {
    ...sortableAndLinked('director'),
    visible: true,
    cellStyle: () => ({ css: { 'width': '200px', } }),
  })

const actorsColumn = () =>
  col('Actors', 'commonMetadata.actors', {
    ...sortableAndLinked('actors'),
    visible: false,
    cellStyle: () => ({ css: { 'width': '250px', } }),
  })

const sortableAndLinked = (prop, toLink) => ({
  sortable: true,
  formatter: listOfLinksFormatter(prop, toLink)
})

const statusToTitle = (entryType, status) => ({
  InProgress: {
    films: 'Watching',
    tv_shows: 'Watching',
    games: 'Playing',
    books: 'Reading'
  }[entryType],
  Completed: 'Completed',
  Dropped: 'Dropped',
  Planned: {
    films: 'To watch',
    tv_shows: 'To watch',
    games: 'To play',
    books: 'To read'
  }[entryType]
}[status])


Tables = {
  col,
  initTable,
  detailFormatter,
  typeToTitle,
  editColumn,
  typeToAPIType,
  basicColumns,
  allColumns,
  statuses,
  entryTypeToExtraColumns,
  statusToTitle,
}

///////////////////////////////////////////////////////////////////////////////

const titleFormatter = (_, row) => {
  const { originalTitle, englishTranslatedTitle } = row.commonMetadata
  const label = originalTitle && originalTitle !== englishTranslatedTitle
    ? `${originalTitle} (${englishTranslatedTitle})`
    : englishTranslatedTitle
  return toWikipediaLink(englishTranslatedTitle, label)
}

const listOfLinksFormatter = (prop, toLink) => (_, row) => {
  const list = row.commonMetadata[prop]
  const transformer = toLink ?? toWikipediaLink
  return list?.map((el) => transformer(el)).join(', ') ?? ''
}

const toWikipediaLink = (name, label) =>
  `<a href="http://en.wikipedia.org/wiki/Special:Search?search=${name}&go=Go">${label ?? name}</a>`

