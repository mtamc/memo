/** @typedef {import('@netlify/functions').HandlerContext} Context */
/** @typedef {import('@netlify/functions').HandlerEvent} Event */
/** @typedef {import('../utils/responses').Response} Response */
/** @typedef {import('../utils/errors').Error} Error */
const { combine, ResultAsync } = require('neverthrow')
const { findOneByField_, updateByRef, create } = require('../utils/db')
const { tuple, toPromise } = require('../utils/general')
const responses = require('../utils/responses')
const { getUserId, getReqBody } = require('./utils')

/** @type {(context: Context) => Promise<Response>} */
const findOwnName = (context) =>
  getUserId(context)
    .asyncAndThen((userId) => findOneByField_('users', 'userId', userId))
    .match(
      ({ data }) => responses.ok(
        data ? { username: data.username } : { error: 'NoUsernameSet' }
      ),
      responses.fromError
    )

// TODO: dont allow people to take an existing name
/** @type {(event: Event, context: Context) => Promise<Response>} */
const setOwnName = (event, context) =>
  toPromise(
    combine(
      tuple([getUserId(context), getReqBody(event)])
    )
      .asyncAndThen(assignNameIfNotTaken)
  )

module.exports = {
  findOwnName,
  setOwnName,
}

///////////////////////////////////////////////////////////////////////////////

/** @type {([userId, req]: [string, any]) => ResultAsync<Response, Response>} */
const assignNameIfNotTaken = ([userId, req]) =>
  findOneByField_('users', 'username', req.newName)
    .map(({ data }) => data
        ? responses.ok({ error: 'This name is already taken.'})
        : (assignName(userId, req.newName), responses.ok())
    )
    .mapErr(responses.fromError)

/** @type {(userId: string, newName: string) => ResultAsync<Response, Error>} */
const assignName = (userId, newName) =>
  findOneByField_('users', 'userId', userId)
    .map(({ ref }) => ref
      ? updateByRef(ref, { data: { username: newName } })
      : create('users', { userId, username: newName })
    )
