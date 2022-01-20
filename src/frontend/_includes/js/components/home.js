const { html } = Utils

const HomePage = (content) => html`
  <div class="container">
    <div class="row" style="padding:20px">
      ${Menu}
      <div class="col-xs-12 col-sm-9 col-md-9">
        <div class="row"> <h1>Homepage</h1> </div>
        <hr>
        <div id="home"> ${content} </div>
        <hr>
      </div>
    </div>
  </div>
`

const Menu = html`
  <div class="hidden-xs col-sm-3 col-md-2" id="sidebar" role="navigation" style="margin-top:180px">
    <hr>
    <ul class="nav nav-pills nav-stacked">
      <li><a href="/">Home</a></li>
      <li><a><div id="netlify-identity" data-netlify-identity-button></div></a></li>
    </ul>
  </div>
`

const HomeLists = html`
  <div id="home-lists" class="row" style="display: none">
    <div class="col-md-6">
      <h3><a href="list">Films</a></h3>
      <table id="home-films" > </table>
    </div>
    <div class="col-md-6">
      <h3><a href="list">Video Games</a></h3>
      <table id="home-games" > </table>
    </div>
    <div class="col-md-6">
      <h3><a href="list">Books</a></h3>
      <table id="home-books" > </table>
    </div>
    <div class="col-md-6">
      <h3><a href="list">TV Shows</a></h3>
      <table id="home-tv_shows" > </table>
    </div>
  </div>
`

const FailedToRetrieve = (statusCode) => html`
  <div class="failed-table">Failed to retrieve data. (${statusCode})</div>
`

const UnauthenticatedWelcome = html`
  <div>Welcome to memo. Log in to start listing.</div>
`

const UsernameSetter = [
  html`
    <label for="new-name">Pick a username to start using Memo.</label><br>
    <input type="text" id="new-name"><br>
    <a id="submit-new-name">Submit</a>
    <div id="new-name-error"></div>
  `,
  () => {
    document.querySelector('#submit-new-name')
      .addEventListener('click', () => {
        Netlify.setName($('#new-name').val())
          .map(({error}) => error
            ? $('#new-name-error').html(`${error}`)
            : location.reload()
          )
      })
  }
]

Components.Home = {
  HomePage,
  Menu,
  HomeLists,
  UnauthenticatedWelcome,
  FailedToRetrieve,
  UsernameSetter
}
