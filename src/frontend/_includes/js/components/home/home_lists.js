const { getUserName, entryTypes, getEntries, toData } = Netlify
const { col, initTable, linkFormatter, typeToTitle, basicColumns } = Tables
const { html } = Utils
const { UsernameSetter } = Components.Home
const { initComponent, WithRemoteData } = Components

const HomeListsPage = () => initComponent({
  content: ({ include }) => include(
    WithRemoteData(getUserName(), ListsOrUsernameSetter)
  )
})

Components.Home.HomeListsPage = HomeListsPage

///////////////////////////////////////////////////////////////////////////////

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
  content: ({ include }) => html`
    <div class="row">
      ${entryTypes
        .map(type => include(HomeList(username, type)))
        .join('')
      }
    </div>
  `
})

const HomeList = (username, type) => initComponent({
  content: ({ include }) => html`
    <div class="col-md-6">
      <h3><a href="/list?type=${type}&user=${username}">${typeToTitle[type]}</a></h3>
      ${include(WithRemoteData(
        getEntries(type, username),
        (resp) => HomeTable(type, toData(resp))
      ))}
    </div>
  `
})

const HomeTable = (type, data) => initComponent({
  content: () => html`
    <table id="home-${type}"></table>
  `,
  initializer: () => {
    initHomeTable(typeToCssId(type), data)
  }
})

const initHomeTable = (selector, data) => initTable(selector, data, {
  iconsPrefix: 'fa',
  pagination: true,
  pageSize: 5,
  onlyInfoPagination: true,
  columns: basicColumns,
})

const typeToCssId = (type) => `#home-${type}`
