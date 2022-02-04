const { initComponent, Error404 } = Components
const { HomePage } = Components.Home
const { ProfilePage } = Components.Profile
const { ListPage } = Components.List

const segments = window.location.pathname?.split?.('/')?.filter(s => s)

const lists = ['games', 'tv', 'books', 'films']

const Router =
  segments.length === 0       ? HomePage :
  segments[0] === 'profile'   ? ProfilePage :
  lists.includes(segments[0]) ? ListPage :
  Error404

Components.Router = Router
