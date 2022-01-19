/** @typedef {import('@netlify/functions').HandlerContext} Context */
/** @typedef {import('@netlify/functions').HandlerEvent} Event */
/** @typedef {import('../utils/responses').Response} Response */
/** @typedef {import('../utils/errors').Error} Error */
const { combine } = require('neverthrow')
const { identity } = require('ramda')
const db = require('../utils/db')
const { tuple } = require('../utils/general')
const responses = require('../utils/responses')
const { getUserId, getReqBody } = require('./utils')

/** @type {(context: Context) => Promise<Response>} */
const findOwnName = (context) =>
  getUserId(context)
    .mapErr(responses.unauthorized)
    .asyncAndThen((userId) =>
      db.findOneByField_('users', 'userId', userId).mapErr(responses.notFound),
    )
    .map((result) => responses.ok(result?.data?.username))
    .match(identity, identity)

/** @type {(event: Event, context: Context) => Promise<Response>} */
const setOwnName = (event, context) =>
  combine(tuple([getUserId(context), getReqBody(event)]))
    .asyncMap(([userId, { newName }]) =>
      db
        .findOneByField_('users', 'userId', userId)
        .map((result) =>
          result?.data?.username === newName
            ? responses.badRequest('Name must be different from old one')
            : db.updateByRef(result.ref, { data: { username: newName } }),
        )
        .mapErr(() => db.create('users', { userId, username: newName }))
        .match(identity, identity)
    )
    .unwrapOr(responses.unauthorized())

module.exports = {
  findOwnName,
  setOwnName,
}
