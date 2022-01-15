const col = (field, title) => ({ field, title })

const columns = [
  col('commonMetadata.originalTitle', 'Title'),
  col('score', 'Score'),
  col('completedDate', 'Date'),
]

const homeTableSettings = {
  iconsPrefix: 'fa',
  pagination: true,
  pageSize: 5,
}

const failedToRetrieve = (statusCode) => html`
  <div class="failed-table">Failed to retrieve data. (${statusCode})</div>
`

const initTable = (id) => (data) =>
  $(id).bootstrapTable({ ...homeTableSettings, columns, data })

const warnFailedToRetrieveTable = (id) => (statusCode) =>
  $(id).html(failedToRetrieve(statusCode))

const fetchDataThenInitTable = (endpoint, id) =>
  Http.get(endpoint).match(initTable(id), warnFailedToRetrieveTable(id))

fetchDataThenInitTable('/api/games_list', '#home-games')

fetchDataThenInitTable('/api/films_list', '#home-films')

netlifyIdentity.on('login', console.log)
