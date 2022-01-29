const { initComponent } = Components
const { html } = Utils

const Menu = () => initComponent({
  content: ({ include }) => html`
    <div
      class="col-sm-3 col-md-2"
      id="sidebar"
      role="navigation"
      style="margin-top:180px"
    >
      <hr>
      <ul class="nav nav-pills nav-stacked">
        <li><a href="/">Home</a></li>
        <li><a>${include(NetlifyIdentityLink())}</a></li>
      </ul>
    </div>
  `
})

Components.UI.Menu = Menu

///////////////////////////////////////////////////////////////////////////////

const NetlifyIdentityLink = () => initComponent({
  content: ({ id }) => html`
    <div id="netlify-identity-${id}" data-netlify-identity-button></div>
  `,
  initializer: ({ id }) => {
    netlifyIdentity.init({ container: `#netlify-identity-${id}` })
    netlifyIdentity.on('login', () => location.reload())
    netlifyIdentity.on('logout', () => location.reload())
  }
})
