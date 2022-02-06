const { initComponent, Error404, WithRemoteData } = Components
const { getUserIdFromName } = Netlify
const { getNameFromUrl, getEntryTypeFromUrl } = Http
const { List } = Components.List
const { typeToTitle } = Conversions

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

    const urlAnchor = window.location.hash.substring(1)

    // Wait for the anchor element to actually be rendered, then unfold
    // the review and jump to the element
    if (urlAnchor) {
      const observer = new MutationObserver((mutations, obs) => {
        const element = document.getElementById(urlAnchor)
        if (element) {
          $(`#${urlAnchor}`).parent().prev().find('i').trigger('click')

          // jump to the element, hacky as fuck
          location.hash = '#__nothing'
          location.hash = '#' + urlAnchor
          obs.disconnect()
          return
        }
      })

      observer.observe(document, {
        childList: true,
        subtree: true
      })
    }
  }
})

Components.List.ListPage = ListPage
