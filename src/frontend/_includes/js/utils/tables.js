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
  detailFormatter,
  typeToTitle,
  basicColumns,
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
  return `
    <a href="http://en.wikipedia.org/wiki/Special:Search?search=${englishTranslatedTitle}&go=Go">${label}</a>
  `
}

const staffFormatter = (prop) => (_, row) => {

}
