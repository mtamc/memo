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
  tv_shows: 'TV',
}

const typeToAPIType = {
  films: 'Film',
  books: 'Book',
  games: 'Game',
  tv_shows: 'TVShow',
}

const basicColumns = (isPlanned) => [
  col('Title', 'commonMetadata.englishTranslatedTitle', {
    formatter: linkFormatter,
    cellStyle: () => ({ css: { 'min-width': '200px' } })
  }),
  col(isPlanned ? 'Preference' : 'Score', 'score', { align: 'center' }),
  col('Year', 'commonMetadata.releaseYear', {
    align: 'center',
    // formatter: (_, row) =>
      // row.completedDate
        // ? (new Date(row.completedDate)).toISOString().substring(0,10)
        // : ''
  }),
]

const allColumns = (isPlanned) => [
  ...basicColumns(isPlanned),
  col('Genres', 'commonMetadata.genres', {
    sortable: true,
    formatter: listOfLinksFormatter('genres')
  }),
]

const editColumn = () =>
  col('', 'editCol', {
    formatter: (_, row, i) => {
      return html`
        <i id="edit-${row.status}-${i}" class="fas fa-edit edit-button" data-entry='${JSON.stringify(row)}'></i>
      `
    },
    cellStyle: () => ({ css: { 'width': '20px' } })
  })

const entryTypeToExtraColumns = (entryType) => ({
  films: [
    col('Staff', 'commonMetadata.staff', {
      ...sortableAndLinked('staff'),
      visible: false,
    })
  ],
  tv_shows: [
    col('Episodes', 'commonMetadata.episodes', { sortable: true }),
    col('Staff', 'commonMetadata.staff', sortableAndLinked('staff')),
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

const linkFormatter = (_, row) => {
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

