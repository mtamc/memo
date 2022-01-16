const col = (field, title) => ({ field, title })

const columns = [
  col('commonMetadata.englishTranslatedTitle', 'Title'),
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

const toData = (resp) => resp.data.map(doc => doc.data)

const initTable = (id) => (resp) =>
  $(id).bootstrapTable({ ...homeTableSettings, columns, data: toData(resp) })

const warnFailedToRetrieveTable = (id) => (statusCode) =>
  $(id).html(failedToRetrieve(statusCode))

const fetchDataThenInitTable = (endpoint, id) =>
  Http.get(endpoint).match(initTable(id), warnFailedToRetrieveTable(id))

window.setTimeout(() => {
  fetchDataThenInitTable('/api/games_list', '#home-games')

  fetchDataThenInitTable('/api/entries/films/tam', '#home-films')
}, 1000)

netlifyIdentity.on('login', console.log)
