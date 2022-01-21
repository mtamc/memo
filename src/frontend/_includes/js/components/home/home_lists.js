const { setContent } = Utils
const { getUserName, entryTypes, getEntries } = Netlify
const { col, createInitTableFunction } = Tables
const { html } = Utils
const { UsernameSetter } = Components.Home

const HomeLists = () => [
  html`
    <div id="home-lists" class="row" style="display: none">
      <div class="col-md-6">
        <h3><a href="list">Films</a></h3>
        <table id="home-films" > </table>
      </div>
      <div class="col-md-6">
        <h3><a href="list">Video Games</a></h3>
        <table id="home-games" > </table>
      </div>
      <div class="col-md-6">
        <h3><a href="list">Books</a></h3>
        <table id="home-books" > </table>
      </div>
      <div class="col-md-6">
        <h3><a href="list">TV Shows</a></h3>
        <table id="home-tv_shows" > </table>
      </div>
    </div>
  `,
  () => {
    getUserName()
    .map(({ error, username }) =>
        error === 'NoUsernameSet' ? setContent('#home', UsernameSetter())
      : typeof error === 'string' ? setContent('#home', error)
      : (
        $('#home-lists').show(),
        entryTypes.forEach(fetchDataThenInitTable(username))
      )
    )
    .mapErr((code) =>
      setContent('#home', `Error ${code} while getting username.`)
    )
  }
]

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

const typeToCssId = (type) => `#home-${type}`

const warnFailedToRetrieveTable = (type) => (statusCode) =>
  setContent(typeToCssId(type), FailedToRetrieve(statusCode))

const initTableFromResp = (type) => (resp) =>
  initHomeTable(typeToCssId(type), toData(resp))

const fetchDataThenInitTable = (username) => (type) =>
  getEntries(type, username)
    .map(initTableFromResp(type))
    .mapErr(warnFailedToRetrieveTable(type))

Components.Home.HomeLists = HomeLists
