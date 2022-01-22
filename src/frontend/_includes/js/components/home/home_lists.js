const { getUserName, entryTypes, getEntries } = Netlify
const { col, createInitTableFunction } = Tables
const { html } = Utils
const { UsernameSetter } = Components.Home
const { initComponent, WithRemoteData } = Components

const HomeListsPage = () => initComponent({
  content: ({ include }) => include(WithRemoteData(getUserName(), ListsOrUsernameSetter))
})

const ListsOrUsernameSetter = ({ error, username }) => initComponent({
  content: ({ include }) => html`
    <div id="home-lists-page">
      ${error === 'NoUsernameSet'   ? include(UsernameSetter())
        : typeof error === 'string' ? `${error}`
                 /* if no error */  : include(HomeLists(username))
      }
    </div>
  `
})

const HomeLists = (username) => initComponent({
  content: () => html`
    <div class="row">
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
  initializer: () => {
    entryTypes.forEach(fetchDataThenInitTable(username))
  }
})

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

Components.Home.HomeListsPage = HomeListsPage
