const { HomePage, HomeLists, UnauthenticatedWelcome } = Components.Home
const { col } = Tables


const columns = [
  col('commonMetadata.englishTranslatedTitle', 'Title'),
  col('score', 'Score'),
  col('completedDate', 'Date'),
]

const homeTableSettings = {
  iconsPrefix: 'fa',
  pagination: true,
  pageSize: 5,
  onlyInfoPagination: true,
}

const FailedToRetrieve = (statusCode) => html`
  <div class="failed-table">Failed to retrieve data. (${statusCode})</div>
`

const toData = (resp) => resp.data.map(doc => doc.data)

const initTable = (id) => (resp) =>
  $(id).bootstrapTable({ ...homeTableSettings, columns, data: toData(resp) })

const warnFailedToRetrieveTable = (id) => (statusCode) =>
  $(id).html(FailedToRetrieve(statusCode))

const fetchDataThenInitTable = (username) => (type) =>
  Netlify.getEntries(type, username)
    .map(initTable(typeToCssId(type)))
    .mapErr(warnFailedToRetrieveTable(typeToCssId(type)))

const typeToCssId = (type) => `#home-${type}`

const initHomeLists = () => {
  Netlify.getUserName()
    .map((name) =>
      Netlify.entryTypes.forEach(fetchDataThenInitTable(name))
    )
    .mapErr(() => $('#home').html('No name!!'))
}

window.pageContentAndInitializer =
  Netlify.isLoggedIn()
    ? [HomePage(HomeLists), initHomeLists]
    : [HomePage(UnauthenticatedWelcome), Utils.noOp]
