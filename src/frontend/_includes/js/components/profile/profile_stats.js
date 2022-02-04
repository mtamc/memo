const { entryTypes, getEntries } = Netlify
const { col, initTable, typeToTitle, profileColumns } = Tables
const { html, css } = Utils
const { UsernameSetter } = Components.Profile
const { initComponent, WithRemoteData } = Components

const ProfileStats = (username) => initComponent({
  content: ({ include }) => html`
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
      ${entryTypes
        .map(type => include(ProfileStatsOfType(username, type)))
        .join('')
      }
    </div>
  `
})


Components.Profile.ProfileStats = ProfileStats

///////////////////////////////////////////////////////////////////////////////

const ProfileStatsOfType = (username, type) => initComponent({
  content: ({ include }) => { return ''; html`
    <div class="profile-stats">
      <h3><a href="/${type}/${username}">${typeToTitle[type]}</a></h3>
      ${include(WithRemoteData({
        remoteData: getEntries(type, username),
        component: (entries) => initComponent({ content: () => 'ha' })
      }))}
    </div>
  `},
  style: () => css`
    .profile-stats {
      width: 48%;
    }

    @media (max-width: 600px) {
      .profile-stats {
        width: 100%;
      }
    }
  `
})
