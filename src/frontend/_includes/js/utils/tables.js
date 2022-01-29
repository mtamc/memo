const initTable = (selector, data, settings) =>
  $(selector).bootstrapTable({ ...settings, data })

const profileColumns = (status) => [
  Columns.title(),
  Columns.score(status),
  Columns.date('Year', 'commonMetadata.releaseYear')
]

const entryTypeToFullColumns = (entryType, status) => ({
  films: [
    Columns.title(),
    Columns.score(status),
    Columns.year(),
    Columns.duration(),
    Columns.directors(),
    Columns.actors(),
    Columns.date('Completed Date', 'completedDate'),
  ],
  tv_shows: [
    Columns.title(),
    Columns.score(status),
    Columns.year(),
    Columns.progress(),
    Columns.duration(),
    Columns.directors(),
    Columns.actors(),
    Columns.date('Started Date', 'startedDate'),
    Columns.date('Completed Date', 'completedDate'),
  ],
  games: [
    Columns.title(),
    Columns.score(status),
    Columns.year(),
    Columns.playtime(),
    Columns.platforms(),
    Columns.studios(),
    Columns.publishers(),
  ],
  books: [
    Columns.title(),
    Columns.score(status),
    Columns.year(),
    Columns.duration('Pages', true),
    Columns.authors(),
  ],
}[entryType])

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
  initTable,
  detailFormatter,
  typeToTitle,
  typeToAPIType,
  profileColumns,
  statuses,
  entryTypeToFullColumns,
  statusToTitle,
}
