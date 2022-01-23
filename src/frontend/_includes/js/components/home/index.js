const { html } = Utils
const { isLoggedIn, getUserName } = Netlify
const { ProfileLists } = Components.Profile
const { initComponent, WithRemoteData, Redirect } = Components
const { Base } = Components.UI
const { UsernameSetter } = Components.Home

const HomePage = () => initComponent({
  content: ({ include }) => include(
    Base("Homepage", isLoggedIn()
      ? WithRemoteData({
        remoteData: getUserName(),
        component: ProfileListsOrUsernameSetter
      })
      : UnauthenticatedWelcome()
    )
  )
})

Components.Home.HomePage = HomePage

///////////////////////////////////////////////////////////////////////////////

const ProfileListsOrUsernameSetter = ({ error, username }) => initComponent({
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
