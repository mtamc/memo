const initTable = (selector, data, settings) =>
  $(selector).bootstrapTable({ ...settings, data })

const profileColumns = (status) => [
  Columns.englishTitleAndLastUpdated(),
  Columns.score(status),
  Columns.date('Year', 'commonMetadata.releaseYear')
]

const entryTypeToFullColumns = (entryType, status) => ({
  films: [
    Columns.index(),
    Columns.title(),
    Columns.score(status),
    Columns.year(),
    Columns.duration(),
    Columns.directors(),
    Columns.actors(),
    Columns.date('Completed Date', 'completedDate'),
  ],
  tv_shows: [
    Columns.index(),
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
    Columns.index(),
    Columns.title(),
    Columns.score(status),
    Columns.year(),
    Columns.playtime(),
    Columns.platforms(),
    Columns.studios(),
    Columns.publishers(),
    Columns.date('Started Date', 'startedDate'),
    Columns.date('Completed Date', 'completedDate'),
  ],
  books: [
    Columns.index(),
    Columns.title(),
    Columns.score(status),
    Columns.year(),
    Columns.pages(),
    Columns.authors(),
    Columns.date('Started Date', 'startedDate'),
    Columns.date('Completed Date', 'completedDate'),
  ],
}[entryType])

const detailFormatter = (_, row) =>
  `<div class="review"><p><b>Comments:</b>${row.commonMetadata.imageUrl ? `<img src="${row.commonMetadata.imageUrl}" class="review-cover" style="float:right;">` : ''}${marked.parse(row.review || '*None yet*')}</p></div>`

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
