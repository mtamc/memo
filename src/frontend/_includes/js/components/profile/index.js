const { initComponent, WithRemoteData, Error404 } = Components
const { Base } = Components.UI
const { getUserIdFromName } = Netlify
const { ProfileLists, ProfileStats } = Components.Profile
const { getNameFromUrl } = Http

const ProfilePage = () => initComponent({
  content: ({ include }) => include(
    WithRemoteData({
      remoteData: getUserIdFromName(getNameFromUrl()),
      component: ({ data }) => data
      ? Base(`${getNameFromUrl()}'s profile`, [
        ProfileLists(getNameFromUrl()),
        ProfileStats(getNameFromUrl()),
      ])
        : Error404()
    })
  ),
  initializer: () => {
    const user = getNameFromUrl()
    document.title = user
      ? `${user}'s profile | Memo`
      : `Not found`
  }
})

Components.Profile.ProfilePage = ProfilePage
