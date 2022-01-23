const { initComponent, WithRemoteData, Error404 } = Components
const { Base } = Components.UI
const { getUserIdFromName } = Netlify
const { SummaryLists } = Components.Summary
const { getNameFromUrl } = Http

const SummaryPage = () => initComponent({
  content: ({ include }) => include(
    WithRemoteData({
      remoteData: getUserIdFromName(getNameFromUrl()),
      component: ({ data }) => data
        ? Base(`${getNameFromUrl()}'s profile`, SummaryLists(getNameFromUrl()))
        : Error404()
    })
  )
})

Components.Summary.SummaryPage = SummaryPage
