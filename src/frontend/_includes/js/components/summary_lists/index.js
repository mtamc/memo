const { initComponent, WithRemoteData, Error404, Base } = Components
const { getUserIdFromName } = Netlify
const { SummaryLists } = Components.Summary
const { getNameFromUrl } = Http

const SummaryPage = () => initComponent({
  content: ({ include }) => include(
    WithRemoteData(getUserIdFromName(getNameFromUrl()),
      ({ data }) => data
        ? Base(`${getNameFromUrl()}'s profile`, SummaryLists(getNameFromUrl()))
        : Error404()
    )
  )
})

Components.Summary.SummaryPage = SummaryPage
