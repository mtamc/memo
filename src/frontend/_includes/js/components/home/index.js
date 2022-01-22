const { html } = Utils
const { isLoggedIn } = Netlify
const { HomeListsPage } = Components.Home
const { initComponent } = Components

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

const Menu = () => initComponent({
  content: () => html`
    <div class="hidden-xs col-sm-3 col-md-2" id="sidebar" role="navigation" style="margin-top:180px">
      <hr>
      <ul class="nav nav-pills nav-stacked">
        <li><a href="/">Home</a></li>
        <li><a><div id="netlify-identity" data-netlify-identity-button></div></a></li>
      </ul>
    </div>
  `
})

const FailedToRetrieve = (statusCode) => initComponent({
  content: () => html`
    <div class="failed-table">Failed to retrieve data. (${statusCode})</div>
  `
})

const UnauthenticatedWelcome = () => initComponent({
  content: () => html`
    <div>Welcome to memo. Log in to start listing.</div>
  `
})

Components.Home.HomePage = HomePage
Components.Home.Menu = Menu
Components.Home.UnauthenticatedWelcome = UnauthenticatedWelcome
Components.Home.FailedToRetrieve = FailedToRetrieve
