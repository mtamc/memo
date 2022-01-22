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

Tables = {
  col,
  initTable,
  linkFormatter,
  detailFormatter,
  typeToTitle,
  basicColumns,
  byStatus,
}
