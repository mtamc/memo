/** @typedef {import('@netlify/functions').HandlerContext} Context */
/** @typedef {import('@netlify/functions').HandlerEvent} Event */
/** @typedef {import('../utils/responses').Response} Response */
/** @typedef {import('../utils/errors').Error} Error */
const { combine, ResultAsync } = require('neverthrow')
const { findOneByField_, findOneByField, updateByRef, create } = require('../utils/db')
const { pair, toPromise } = require('../utils/general')
const responses = require('../utils/responses')
const { getUserId, getReqBody, getSegment } = require('./utils')
const feErrors = require('../utils/frontend_errors')

/** @type {(event: Event) => Promise<Response>} */
const findOwnName = (event) => toPromise(
  getUserId(event)
    .asyncAndThen((userId) => findOneByField_('users', 'userId', userId))
    .map(({ data }) => data
      ? responses.ok({ username: data.username })
      : responses.ok(feErrors.noUsernameSet())
    )
    .mapErr(() => responses.ok({}))
)

/** @type {(event: Event) => Promise<Response>} */
const getUserIdFromName = (event) =>
  findOneByField('users', 'username', getSegment(0, event))

/** @type {(event: Event) => Promise<Response>} */
const setOwnName = (event) => toPromise(
  combine(pair([
    getUserId(event),
    getReqBody(event)
  ]))
    .asyncAndThen(assignNameIfNotTaken)
    .mapErr(responses.fromError)
)

module.exports = {
  findOwnName,
  setOwnName,
  getUserIdFromName,
}

///////////////////////////////////////////////////////////////////////////////

/** @type {([userId, req]: [string, any]) => ResultAsync<Response, Error>} */
const assignNameIfNotTaken = ([userId, { newName }]) =>
  findOneByField_('users', 'username', newName)
    .map(({ data }) => data
        ? responses.ok(feErrors.nameTaken(newName))
        : (assignName(userId, newName), responses.ok())
    )

/** @type {(userId: string, newName: string) => ResultAsync<Response, Error>} */
const assignName = (userId, newName) =>
  findOneByField_('users', 'userId', userId)
    .map(({ ref }) => ref
      ? updateByRef('users', ref, { data: { username: newName } })
      : create('users', { userId, username: newName })
    )
