/** @typedef {import('@netlify/functions').HandlerContext} Context */
/** @typedef {import('@netlify/functions').HandlerEvent} Event */
/** @typedef {import('../utils/responses').Response} Response */
/** @typedef {import('../utils/errors').Error} Error */
const { combine, okAsync, ResultAsync } = require('neverthrow')
const { findOneByField_, updateByRef, create } = require('../utils/db')
const { tuple, toPromise } = require('../utils/general')
const responses = require('../utils/responses')
const { getUserId, getReqBody } = require('./utils')

/** @type {(context: Context) => Promise<Response>} */
const findOwnName = (context) =>
  getUserId(context)
    .asyncAndThen((userId) => findOneByField_('users', 'userId', userId))
    .match(
      ({ data }) => responses.ok({ username: data?.username }),
      (err) =>
        err.context?.startsWith?.('NotFound')
          ? responses.ok({ error: 'NoUsernameSet' })
          : responses.fromError(err),
    )

// TODO: dont allow people to take an existing name
/** @type {(event: Event, context: Context) => Promise<Response>} */
const setOwnName = (event, context) =>
  toPromise(
    combine(tuple([getUserId(context), getReqBody(event)])).asyncAndThen(
      assignNameIfNotTaken,
    ),
  )

module.exports = {
  findOwnName,
  setOwnName,
}

///////////////////////////////////////////////////////////////////////////////

/** @type {([userId, req]: [string, any]) => ResultAsync<Response, Response>} */
const assignNameIfNotTaken = ([userId, req]) =>
  findOneByField_('users', 'username', req.newName)
    .map(async () => responses.ok({ error: 'This name is already taken.'}))
    .mapErr((err) =>
      err.context?.startsWith('NotFound')
        ? (assignName(userId, req.newName), responses.ok())
        : responses.fromError(err)
    )

/** @type {(userId: string, newName: string) => ResultAsync<Response, Response>} */
const assignName = (userId, newName) =>
  findOneByField_('users', 'userId', userId)
    .map(({ ref }) => updateByRef(ref, { data: { username: newName } }))
    .mapErr(() => create('users', { userId, username: newName }))
