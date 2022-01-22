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

const byStatus = (status, entries) =>
  entries.filter((e) => e.status === status)

const basicColumns = () => [
  col('Title', 'commonMetadata.englishTranslatedTitle', {
    formatter: linkFormatter,
  }),
  col('Score', 'score', { align: 'center' }),
  col('Date', 'completedDate', { align: 'center' }),
]

const allColumns = () => [
  ...basicColumns(),
  col('Genres', 'commonMetadata.genres', {
    sortable: true,
    formatter: listOfLinksFormatter('genres')
  }),
]

const entryTypeToExtraColumns = (entryType) => ({
  films: [
    col('Staff', 'commonMetadata.staff', {
      sortable: true,
      formatter: listOfLinksFormatter('staff')
    })
  ],
  tv_shows: [
    col('Episodes', 'commonMetadata.episodes', { sortable: true }),
    col('Staff', 'commonMetadata.staff', { sortable: true }),
  ],
  games: [
    col('Platforms', 'commonMetadata.platforms', { sortable: true }),
    col('Studios', 'commonMetadata.studios', { sortable: true }),
    col('Publishers', 'commonMetadata.publishers', { sortable: true }),
  ],
  books: [
    col('Authors', 'commonMetadata.authors', { sortable: true }),
  ],
}[entryType])

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
  basicColumns,
  allColumns,
  byStatus,
  statuses,
  entryTypeToExtraColumns,
  statusToTitle,
}

///////////////////////////////////////////////////////////////////////////////

const linkFormatter = (_, row) => {
  const { originalTitle, englishTranslatedTitle } = row.commonMetadata
  const label = originalTitle
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

