const { initComponent } = Components
const { html } = Utils

const Menu = () => initComponent({
  content: ({ include }) => html`
    <div
      class="col-sm-3 col-md-2 memo-menu"
      id="sidebar"
      role="navigation"
    >
      <hr>
      <ul class="nav nav-pills nav-stacked">
        <li id="home-menu-item"><a href="/">Home</a></li>
        <li><a>${include(NetlifyIdentityLink())}</a></li>
      </ul>
    </div>
  `,
  initializer: () => {
    Netlify.getUserName()
      .map(({ username }) => {
        if (username) {
          $('#home-menu-item').after(`<li id="home-menu-item"><a href="/profile/${username}">Profile</a></li>`)
        }
      })
      .mapErr(console.log)
  }
})

Components.UI.Menu = Menu

///////////////////////////////////////////////////////////////////////////////

const NetlifyIdentityLink = () => initComponent({
  content: ({ id }) => html`
    <div id="netlify-identity-${id}" data-netlify-identity-button></div>
  `,
  initializer: ({ id }) => {
    netlifyIdentity.init({ container: `#netlify-identity-${id}` })
    netlifyIdentity.on('login', () => {
      netlifyIdentity.refresh().then(console.log)
      location.reload()
    })
    netlifyIdentity.on('logout', () => location.reload())
  }
})
