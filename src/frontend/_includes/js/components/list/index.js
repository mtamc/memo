const { initComponent, Error404, WithRemoteData } = Components
const { getUserIdFromName } = Netlify
const { getNameFromUrl, getEntryTypeFromUrl } = Http
const { List } = Components.List
const { typeToTitle } = Tables

const ListPage = () => initComponent({
  content: ({ include }) => include(
    typeToTitle[getEntryTypeFromUrl()]
      ? WithRemoteData({
        remoteData: getUserIdFromName(getNameFromUrl()),
        component: ({ data }) => data
          ? List(getNameFromUrl())
          : Error404()
      })
      : Error404()
  ),
  initializer: () => {
    const typeTitle = typeToTitle[getEntryTypeFromUrl()]
    const user = getNameFromUrl()
    document.title = typeTitle && user
      ? `${user}'s ${typeTitle.toLowerCase()} | Memo`
      : `Not found`
  }
})

Components.List.ListPage = ListPage
