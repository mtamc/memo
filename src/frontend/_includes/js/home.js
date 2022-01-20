const { HomePage, HomeLists, UnauthenticatedWelcome, FailedToRetrieve, UsernameSetter } = Components.Home
const { col, createInitTableFunction } = Tables
const { getEntries, entryTypes, getUserName } = Netlify
const { setContent } = Utils

const initHomeTable = createInitTableFunction({
  iconsPrefix: 'fa',
  pagination: true,
  pageSize: 5,
  onlyInfoPagination: true,
  columns: [
    col('commonMetadata.englishTranslatedTitle', 'Title'),
    col('score', 'Score'),
    col('completedDate', 'Date'),
  ],
})

const toData = (resp) => resp.data.map((doc) => doc.data)

const warnFailedToRetrieveTable = (type) => (statusCode) =>
  setContent(typeToCssId(type), FailedToRetrieve(statusCode))

const initTableFromResp = (type) => (resp) =>
  initHomeTable(typeToCssId(type), toData(resp))

const fetchDataThenInitTable = (username) => (type) =>
  getEntries(type, username)
    .map(initTableFromResp(type))
    .mapErr(warnFailedToRetrieveTable(type))

const typeToCssId = (type) => `#home-${type}`

const initHomeLists = () =>
  getUserName()
    .map(({ error, username }) =>
        error === 'NoUsernameSet' ? setContent('#home', UsernameSetter)
      : typeof error === 'string' ? setContent('#home', error)
      : (
        $('#home-lists').show(),
        entryTypes.forEach(fetchDataThenInitTable(username))
      )
    )
    .mapErr((code) =>
      setContent('#home', `Error ${code} while getting username.`)
    )

TdMemoPage = Netlify.isLoggedIn() ? {
  content: HomePage(HomeLists),
  initializer: initHomeLists
} : {
  content: HomePage(UnauthenticatedWelcome)
}
