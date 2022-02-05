const { initComponent } = Components
const { html, css } = Utils

const Menu = () => initComponent({
  content: ({ include }) => html`
    <div
      class="col-sm-3 col-md-2 memo-menu"
      id="sidebar"
      role="navigation"
    >
      <div id="menu-logo">
        <img src="/img/memo_logo.png">
      </div>
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
  },
  style: () => css`
    .memo-menu {
      /* margin-top: 180px; */
    }

    #menu-logo {
      text-align: center;
      margin: 10px 0;
    }

    #menu-logo img {
      width: 60px;
    }

    @media (max-width: 768px) {
      .memo-menu {
        margin-top: 20px;
      }
      .memo-menu ul {
        display: flex;
        justify-content: space-evenly;
      }
      .nav-stacked > li + li {
        margin-top: 0px;
        margin-left: 0;
      }
    }
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
    netlifyIdentity.on('login', () => {
      netlifyIdentity.refresh().then(console.log)
      location.reload()
    })
    netlifyIdentity.on('logout', () => location.reload())
  }
})
