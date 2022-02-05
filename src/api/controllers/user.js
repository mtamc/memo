/** @typedef {import('@netlify/functions').HandlerContext} Context */
/** @typedef {import('@netlify/functions').HandlerEvent} Event */
/** @typedef {import('../utils/responses').Response} Response */
/** @typedef {import('../utils/errors').Error} Error */
const { findOneByField } = require('../utils/db')
const { getSegment } = require('./utils')

/** @type {(event: Event) => Promise<Response>} */
const getUserFromName = (event) =>
  findOneByField('users', 'username', getSegment(0, event))

module.exports = {
  getUserFromName,
}
