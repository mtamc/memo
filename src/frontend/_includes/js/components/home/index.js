const { html } = Utils
const { isLoggedIn } = Netlify
const { HomeListsPage } = Components.Home
const { initComponent, Menu, NetlifyIdentityLink } = Components

const HomePage = () => initComponent({
  content: ({ include }) => html`
    <div class="container">
      <div class="row" style="padding:20px">
        ${include(Menu())}
        <div class="col-xs-12 col-sm-9 col-md-9">
          <div class="row"> <h1>Homepage</h1> </div>
          <hr>
          <div id="home">
            ${include(
              isLoggedIn()
                ? HomeListsPage()
                : UnauthenticatedWelcome()
            )}
          </div>
          <hr>
        </div>
      </div>
    </div>
  `
})

Components.Home.HomePage = HomePage

///////////////////////////////////////////////////////////////////////////////

const UnauthenticatedWelcome = () => initComponent({
  content: () => html`
    <div>Welcome to memo. Log in to start listing.</div>
  `
})
