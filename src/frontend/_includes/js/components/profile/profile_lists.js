const { getUserName, entryTypes, getEntries } = Netlify
const { col, initTable, typeToTitle, profileColumns } = Tables
const { html, css } = Utils
const { UsernameSetter } = Components.Profile
const { initComponent, WithRemoteData } = Components

const ProfileLists = (username) => initComponent({
  content: ({ include }) => html`
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
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
    <div class="profile-list">
      <h3><a href="/list?type=${type}&user=${username}">${typeToTitle[type]}</a></h3>
      ${include(WithRemoteData({
        remoteData: getEntries(type, username),
        component: (entries) => ProfileTable(type, entries)
      }))}
    </div>
  `,
  style: () => css`
    .profile-list {
      width: 48%;
    }

    @media (max-width: 600px) {
      .profile-list {
        width: 100%;
      }
    }
  `
})

const ProfileTable = (type, data) => initComponent({
  content: () => html`
    <table id="summary-${type}"></table>
  `,
  initializer: () => {
    initProfileTable(typeToCssId(type), [...data].sort((a, b) => (b.updatedDate ?? 0) - (a.updatedDate ?? 0)))
  }
})

const log = x => (console.log(x), x)

const initProfileTable = (selector, data) => initTable(selector, log(data), {
  iconsPrefix: 'fa',
  pagination: true,
  pageSize: 5,
  onlyInfoPagination: true,
  columns: profileColumns(),
})

const typeToCssId = (type) => `#summary-${type}`
