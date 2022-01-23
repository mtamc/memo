const { initComponent, WithRemoteData, Error404 } = Components
const { Base } = Components.UI
const { getUserIdFromName } = Netlify
const { ProfileLists } = Components.Profile
const { getNameFromUrl } = Http

const ProfilePage = () => initComponent({
  content: ({ include }) => include(
    WithRemoteData({
      remoteData: getUserIdFromName(getNameFromUrl()),
      component: ({ data }) => data
        ? Base(`${getNameFromUrl()}'s profile`, ProfileLists(getNameFromUrl()))
        : Error404()
    })
  )
})

Components.Profile.ProfilePage = ProfilePage
