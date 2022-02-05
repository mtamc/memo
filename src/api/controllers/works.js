/** @typedef {import('@netlify/functions').HandlerEvent} Event */
/** @typedef {import('../utils/responses').Response} Response */
/** @typedef {import('../utils/external_api_adapters/types').Adapter} Adapter */
/** @typedef {import('../utils/errors').Error} Error */
const { toPromise } = require('../utils/general')
const { getUrlSegments } = require('./utils')
const { Result, ok, err, ResultAsync, okAsync } = require('neverthrow')
const { match } = require('ts-pattern')
const errors = require('../utils/errors')
const responses = require('../utils/responses')
const adapters = require('../utils/external_api_adapters')
const db = require('../utils/db')

/** @type {(event: Event) => Promise<Response>} */
const searchForWork = (event) =>
  withAdapter('search', event)

/** @type {(event: Event) => Promise<Response>} */
const retrieveWork = (event) => {
  const type = getUrlSegments(event)[1]
  const apiRefId = getUrlSegments(event)[2]

  // Hardcoded for now, but ideally shouldnt be
  const apiName = {
    films: 'tmdb',
    books: 'google',
    tv: 'tmdb',
    games: 'igdb',
  }[type]

  if (!apiName) return Promise.resolve(responses.notFound())
  const apiRef = `${apiName}__${apiRefId}`

  return toPromise(
    db.findOneByField_(typeToCollection(type), 'apiRefs', apiRef)
      .andThen(({ data, ref }) => data
        ? okAsync(({
          ...data,
          internalRef: ref.id
        }))
        : createWork(event)
      )
      .map(responses.ok)
      .mapErr(responses.fromError)
  )
}

module.exports = {
  searchForWork,
  retrieveWork,
}

///////////////////////////////////////////////////////////////////////////////

// Does this exist somewhere else?? >_>
const typeToCollection = (type) => ({
  films: 'films',
  books: 'books',
  tv: 'tvShows',
  games: 'games',
}[type])


/** @type {(action: keyof Adapter, event: Event) => Promise<Response>} */
const withAdapter = (action, event) => toPromise(
  withAdapter_(action, event)
    .map(responses.ok)
    .mapErr(responses.fromError)
)

/** @type {(action: keyof Adapter, event: Event) => ResultAsync<any, any>} */
const withAdapter_ = (action, event) =>
  getAdapter(event)
    // TODO: make typechecker happy
    .asyncAndThen((adapter) => adapter[action](decodeURI(getUrlSegments(event)[2])))

const createWork = (event) =>
  withAdapter_('retrieve', event)
    .andThen((data) =>
      db.create_(typeToCollection(getUrlSegments(event)[1]), data)
    )
    .map(({ data, ref }) => ({
      ...data,
      internalRef: ref.id,
    }))


/** @type {(event: Event) => Result<Adapter, Error>} */
const getAdapter = (event) => match(getUrlSegments(event)[1])
  .with('films', 'tv', 'games', 'books', (type) => ok(adapters[type]))
  .otherwise(() => err(errors.notFound()))
