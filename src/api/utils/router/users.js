/** @typedef {import('@netlify/functions').HandlerContext} Context */
/** @typedef {import('@netlify/functions').HandlerEvent} Event */
/** @typedef {import('../responses').Response} Response */
const {identity} = require('ramda')
const db = require('../db')
const responses = require('../responses')
const { getUserId, getSegment } = require('./utils')

/** @type {(context: Context) => Promise<Response>} */
const findOwnName = (context) =>
  getUserId(context)
    .mapErr(responses.unauthorized)
    .asyncAndThen(userId =>
      db.findOneByField_('users', 'userId', userId)
        .mapErr(responses.notFound)
    )
    .map(result => responses.ok(result?.data?.username))
    .match(identity, identity)

/** @type {(event: Event, context: Context) => Promise<Response>} */
const setOwnName = (event, context) => {
  const newName = getSegment(0, event)
  return getUserId(context).asyncAndThen(userId =>
    db.findOneByField_('users', 'userId', userId)
      .map((result) => result?.data?.username === newName
        ? responses.badRequest('Name must be different from old one')
        : db.updateByRef(result.ref, { data: { username: newName }}),
      )
      .mapErr(() => db.create('users', { userId, username: newName })),
  )
  .unwrapOr(responses.unauthorized())
}


module.exports = {
  findOwnName,
  setOwnName
}
