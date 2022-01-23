const { html } = Utils
const { isLoggedIn, getUserName } = Netlify
const { SummaryLists } = Components.Summary
const { initComponent, WithRemoteData, Redirect } = Components
const { Base } = Components.UI

const HomePage = () => initComponent({
  content: ({ include }) => include(
    Base("Homepage", isLoggedIn()
      ? WithRemoteData({
        remoteData: getUserName(),
        component: SummaryListsOrUsernameSetter
      })
      : UnauthenticatedWelcome()
    )
  )
})

Components.Home.HomePage = HomePage

///////////////////////////////////////////////////////////////////////////////

const SummaryListsOrUsernameSetter = ({ error, username }) => initComponent({
  content: ({ include }) => html`
    <div>
      ${error === 'NoUsernameSet'   ? include(UsernameSetter())
        : typeof error === 'string' ? `${error}`
                 /* if no error */  : include(Redirect(`/profile?user=${username}`))
      }
    </div>
  `
})

const UnauthenticatedWelcome = () => initComponent({
  content: () => html`
    <div>Welcome to memo. Log in to start listing.</div>
  `
})
