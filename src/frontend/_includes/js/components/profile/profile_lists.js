const { getUserName, entryTypes, getEntries } = Netlify
const { col, initTable, typeToTitle, profileColumns } = Tables
const { html } = Utils
const { UsernameSetter } = Components.Profile
const { initComponent, WithRemoteData } = Components

const ProfileLists = (username) => initComponent({
  content: ({ include }) => html`
    <div class="row">
      ${entryTypes
        .map(type => include(ProfileList(username, type)))
        .join('')
      }
    </div>
  `
})


Components.Profile.ProfileLists = ProfileLists

///////////////////////////////////////////////////////////////////////////////

const ProfileList = (username, type) => initComponent({
  content: ({ include }) => html`
    <div class="col-md-6">
      <h3><a href="/list?type=${type}&user=${username}">${typeToTitle[type]}</a></h3>
      ${include(WithRemoteData({
        remoteData: getEntries(type, username),
        component: (entries) => ProfileTable(type, entries)
      }))}
    </div>
  `
})

const ProfileTable = (type, data) => initComponent({
  content: () => html`
    <table id="summary-${type}"></table>
  `,
  initializer: () => {
    initProfileTable(typeToCssId(type), [...data].sort((a, b) => a.updatedDate - b.updatedDate))
  }
})

const initProfileTable = (selector, data) => initTable(selector, data, {
  iconsPrefix: 'fa',
  pagination: true,
  pageSize: 5,
  onlyInfoPagination: true,
  columns: profileColumns(),
})

const typeToCssId = (type) => `#summary-${type}`
