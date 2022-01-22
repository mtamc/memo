const { html } = Utils
const { isLoggedIn, getUserName } = Netlify
const { SummaryLists } = Components.Summary
const { initComponent, Base, WithRemoteData, Redirect } = Components

const HomePage = () => initComponent({
  content: ({ include }) => include(
    Base("Homepage", isLoggedIn()
      ? WithRemoteData(getUserName(), SummaryListsOrUsernameSetter)
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
