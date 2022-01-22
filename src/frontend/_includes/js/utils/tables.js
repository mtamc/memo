const col = (title, field, options) => ({ title, field, ...options })

const initTable = (selector, data, settings) =>
  $(selector).bootstrapTable({ ...settings, data })

const linkFormatter = (_, row) => {
  const { originalTitle, englishTranslatedTitle } = row.commonMetadata
  const label = originalTitle
    ? `${originalTitle} (${englishTranslatedTitle})`
    : englishTranslatedTitle
  return `
    <a href="http://en.wikipedia.org/wiki/Special:Search?search=${englishTranslatedTitle}&go=Go">${label}</a>
  `
}

const detailFormatter = (_, row) =>
  Object.entries(row)
    .filter(([key]) => key === 'review')
    .map(([_, value]) => `<p><b> Comments:</b> ${marked.parse(value)}</p>`)
    .join('')

const statuses = ['InProgress', 'Completed', 'Dropped', 'Planned']

const typeToTitle = {
  films: 'Films',
  books: 'Literature',
  games: 'Video Games',
  tv_shows: 'TV',
}

const byStatus = (status, entries) =>
  entries.filter((e) => e.status === status)

const basicColumns = [
  col('Title', 'commonMetadata.englishTranslatedTitle', {
    formatter: linkFormatter,
  }),
  col('Score', 'score', { align: 'center' }),
  col('Date', 'completedDate', { align: 'center' }),
]

const entryTypeToExtraColumns = (entryType) => ({
  films: [
    col('Staff', 'commonMetadata.staff', { sortable: true })
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
    e: 'Reading'
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
  linkFormatter,
  detailFormatter,
  typeToTitle,
  basicColumns,
  byStatus,
  statuses,
  entryTypeToExtraColumns,
  statusToTitle,
}
